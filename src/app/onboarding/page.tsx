import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OnboardingWizard } from "@/components/onboarding/Wizard";

export const maxDuration = 60; // Allow up to 60 seconds for the Nemotron 120b model

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user already has an ai_profile
  const { data: profile } = await supabase
    .from("li_ai_profiles")
    .select("main_quest")
    .eq("user_id", user.id)
    .single();

  if (profile) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <OnboardingWizard />
    </div>
  );
}
