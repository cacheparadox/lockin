"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const DIFFICULTY_XP: Record<string, number> = {
  'EASY': 100,
  'MEDIUM': 300,
  'HARD': 600,
  'EXTREME': 1000,
  'LEGENDARY': 2000
};

export async function createContract(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const group_id = formData.get("group_id") as string;
  const assignee_id = formData.get("assignee_id") as string;
  const category = formData.get("category") as string;
  const difficulty = formData.get("difficulty") as string;
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const target_metric = formData.get("target_metric") as string;
  const target_value = parseInt(formData.get("target_value") as string);
  const deadline = formData.get("deadline") as string;
  const optional_stake = formData.get("optional_stake") as string;

  // 1. Calculate Base XP
  const base_xp = DIFFICULTY_XP[difficulty] || 300;
  
  // 2. Get assignee's AI profile multiplier for dynamic scaling
  const { data: aiProfile } = await supabase
    .from("li_ai_profiles")
    .select("*")
    .eq("user_id", assignee_id)
    .single();

  let final_xp = base_xp;
  if (aiProfile) {
    const multiplierKey = `${category.toLowerCase()}_multiplier`;
    // @ts-ignore
    const multiplier = aiProfile[multiplierKey] || 1.0;
    final_xp = Math.round(base_xp * multiplier);
  }

  // 3. Insert Contract
  const { error } = await supabase
    .from("li_contracts")
    .insert({
      user_id: assignee_id,
      group_id,
      title,
      description,
      category,
      difficulty,
      target_metric,
      target_value,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      reward_xp: final_xp,
      optional_stake
    });

  if (error) {
    console.error(error);
    redirect(`/contracts/new?error=${encodeURIComponent(error.message)}`);
  }

  // 4. Send Ntfy.sh Notification
  const { data: group } = await supabase
    .from("li_groups")
    .select("ntfy_topic")
    .eq("id", group_id)
    .single();

  if (group && group.ntfy_topic) {
    const { data: assignee } = await supabase
      .from("li_profiles")
      .select("username")
      .eq("id", assignee_id)
      .single();

    const username = assignee?.username || "A member";
    const stakeText = optional_stake ? ` Blood Stake: ${optional_stake}.` : "";
    
    try {
      await fetch(`https://ntfy.sh/${group.ntfy_topic}`, {
        method: "POST",
        body: `MISSION ALERT: ${username} has been assigned to conquer "${title}" (${difficulty} difficulty).${stakeText}`,
        headers: {
          "Title": "New Contract Assigned",
          "Tags": "warning,skull"
        }
      });
    } catch (e) {
      console.error("Failed to send ntfy push notification", e);
    }
  }

  revalidatePath("/contracts");
  redirect("/contracts");
}
