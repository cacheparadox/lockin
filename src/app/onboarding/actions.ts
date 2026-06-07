"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { encrypt } from "@/utils/encryption";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract all 20 questions + text fields
  const answers: Record<string, string> = {};
  for (let i = 1; i <= 20; i++) {
    answers[`q${i}`] = formData.get(`q${i}`) as string || "No answer provided";
  }

  const mainQuest = formData.get("main_quest") as string;
  const sideQuests = formData.get("side_quests") as string;
  const currentStatus = formData.get("current_status") as string;
  const orKey = formData.get("openrouter_key") as string;

  // Mask and save the OR key
  const maskedKey = encrypt(orKey);
  const { error: profileUpdateError } = await supabase
    .from("li_profiles")
    .update({ openrouter_key: maskedKey })
    .eq("id", user.id);
  
  if (profileUpdateError) {
    console.error("Failed to store OR key", profileUpdateError);
  }

  let multipliers = {
    fitness_multiplier: 1.0,
    deep_work_multiplier: 1.0,
    business_multiplier: 1.0,
    study_multiplier: 1.0,
    creative_multiplier: 1.0,
    health_multiplier: 1.0,
    finance_multiplier: 1.0,
    mindfulness_multiplier: 1.0
  };

  let parsedMultipliers;
  try {
    parsedMultipliers = JSON.parse(formData.get("multipliers") as string);
  } catch (err) {
    console.error("Failed to parse multipliers", err);
  }

  if (parsedMultipliers && parsedMultipliers.fitness_multiplier !== undefined) {
    multipliers = {
      fitness_multiplier: parsedMultipliers.fitness_multiplier || 1.0,
      deep_work_multiplier: parsedMultipliers.deep_work_multiplier || 1.0,
      business_multiplier: parsedMultipliers.business_multiplier || 1.0,
      study_multiplier: parsedMultipliers.study_multiplier || 1.0,
      creative_multiplier: parsedMultipliers.creative_multiplier || 1.0,
      health_multiplier: parsedMultipliers.health_multiplier || 1.0,
      finance_multiplier: parsedMultipliers.finance_multiplier || 1.0,
      mindfulness_multiplier: parsedMultipliers.mindfulness_multiplier || 1.0
    };
  }

  const aiProfile = {
    user_id: user.id,
    main_quest: mainQuest,
    ...multipliers
  };

  const { error } = await supabase
    .from("li_ai_profiles")
    .upsert(aiProfile);

  if (error) {
    console.error("Error saving AI profile:", error);
    redirect(`/onboarding?error=${encodeURIComponent(error.message || "Failed to calibrate profile")}`);
  }

  redirect("/dashboard");
}
