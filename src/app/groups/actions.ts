"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LOCKIN-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createGroup(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const inviteCode = generateInviteCode();

  // 1. Create Group
  const { data: group, error: groupError } = await supabase
    .from("li_groups")
    .insert({
      name,
      description,
      invite_code: inviteCode,
      created_by: user.id
    })
    .select()
    .single();

  if (groupError) {
    console.error(groupError);
    redirect(`/groups/new?error=${encodeURIComponent(groupError.message)}`);
  }

  // 2. Add creator as OWNER
  const { error: memberError } = await supabase
    .from("li_group_members")
    .insert({
      group_id: group.id,
      user_id: user.id,
      role: 'OWNER'
    });

  if (memberError) {
    console.error(memberError);
    redirect(`/groups/new?error=${encodeURIComponent(memberError.message)}`);
  }

  revalidatePath("/groups");
  redirect("/groups");
}

export async function joinGroup(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let inviteCode = formData.get("invite_code") as string;
  inviteCode = inviteCode.trim().toUpperCase();

  // 1. Find group by code
  const { data: group, error: groupError } = await supabase
    .from("li_groups")
    .select("id")
    .eq("invite_code", inviteCode)
    .single();

  if (groupError || !group) {
    redirect(`/groups/join?error=Invalid invite code or group not found.`);
  }

  // 2. Insert as MEMBER
  const { error: memberError } = await supabase
    .from("li_group_members")
    .insert({
      group_id: group.id,
      user_id: user.id,
      role: 'MEMBER'
    });

  if (memberError) {
    if (memberError.code === '23505') {
      redirect(`/groups/join?error=You are already a member of this group.`);
    }
    console.error(memberError);
    redirect(`/groups/join?error=${encodeURIComponent(memberError.message)}`);
  }

  revalidatePath("/groups");
  redirect("/groups");
}
