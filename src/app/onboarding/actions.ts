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
    custom_multiplier: 1.0
  };

  try {
    const prompt = `You are the Lock In AI. Your job is to calibrate a user's RPG experience multipliers based on their current status and goals.
User Main Quest: ${mainQuest}
Side Quests: ${sideQuests}
Current Status: ${currentStatus}

Analyze their goals and generate XP multipliers for the following categories: fitness, deep_work, business, study, creative, health, custom.
A multiplier of 1.0 is baseline. If a category is highly relevant to their Main Quest, assign a higher multiplier (up to 3.0). If relevant to Side Quests, assign a moderate multiplier (up to 1.5).

You MUST respond with a raw JSON object containing exactly these 7 keys mapped to numbers (decimals). Do not include markdown formatting or explanation.

Example response:
{
  "fitness_multiplier": 2.1,
  "deep_work_multiplier": 1.2,
  "business_multiplier": 1.0,
  "study_multiplier": 1.0,
  "creative_multiplier": 1.0,
  "health_multiplier": 1.5,
  "custom_multiplier": 1.0
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${orKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (response.ok) {
      const json = await response.json();
      let content = json.choices[0].message.content;
      
      // Clean potential markdown blocks
      if (content.startsWith("\`\`\`json")) {
        content = content.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      } else if (content.startsWith("\`\`\`")) {
        content = content.replace(/\`\`\`/g, "").trim();
      }

      const parsed = JSON.parse(content);
      if (parsed.fitness_multiplier !== undefined) {
        multipliers = {
          fitness_multiplier: parsed.fitness_multiplier,
          deep_work_multiplier: parsed.deep_work_multiplier,
          business_multiplier: parsed.business_multiplier,
          study_multiplier: parsed.study_multiplier,
          creative_multiplier: parsed.creative_multiplier,
          health_multiplier: parsed.health_multiplier,
          custom_multiplier: parsed.custom_multiplier
        };
      }
    } else {
      console.error("OpenRouter API error:", await response.text());
    }
  } catch (err) {
    console.error("Calibration parsing error:", err);
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
    redirect("/onboarding?error=Failed to calibrate profile");
  }

  redirect("/dashboard");
}
