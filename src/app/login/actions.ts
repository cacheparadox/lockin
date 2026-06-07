"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        username: formData.get("username") as string,
      }
    }
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error || !authData.user) {
    redirect("/signup?message=Could not authenticate user");
  }

  // Insert into our custom profiles table
  const { error: profileError } = await supabase.from("li_profiles").insert({
    id: authData.user.id,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
  });

  if (profileError) {
    console.error("Error creating profile:", profileError);
    // Even if it fails, they are signed up in Auth, but we log the error.
  }

  revalidatePath("/", "layout");
  // Redirect to onboarding after sign up
  redirect("/onboarding");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
