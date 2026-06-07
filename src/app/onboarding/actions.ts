"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const mainQuest = formData.get("main_quest") as string;
  const sideQuests = formData.get("side_quests") as string;
  const currentStatus = formData.get("current_status") as string;

  // In a real scenario, we would call OpenRouter here to generate multipliers.
  // Example: 
  // const prompt = `User goal: ${mainQuest}, Side quests: ${sideQuests}, Status: ${currentStatus}. Generate XP multipliers for Fitness, DeepWork, Business, Study, Creative, Health, Custom.`;
  // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", { ... });

  // For now, we'll assign baseline multipliers and simulate an AI response
  const aiProfile = {
    user_id: user.id,
    main_quest: mainQuest,
    fitness_multiplier: mainQuest.toLowerCase().includes("gym") || mainQuest.toLowerCase().includes("fit") ? 2.0 : 1.1,
    deep_work_multiplier: mainQuest.toLowerCase().includes("business") || mainQuest.toLowerCase().includes("startup") ? 2.0 : 1.2,
    business_multiplier: mainQuest.toLowerCase().includes("business") || mainQuest.toLowerCase().includes("startup") ? 1.8 : 1.0,
    study_multiplier: mainQuest.toLowerCase().includes("study") || mainQuest.toLowerCase().includes("learn") ? 1.5 : 1.0,
    creative_multiplier: 1.0,
    health_multiplier: 1.2,
    custom_multiplier: 1.0
  };

  const { error } = await supabase
    .from("ai_profiles")
    .upsert(aiProfile);

  if (error) {
    console.error("Error saving AI profile:", error);
    redirect("/onboarding?error=Failed to calibrate profile");
  }

  // Once calibrated, redirect to the dashboard
  redirect("/dashboard");
}
