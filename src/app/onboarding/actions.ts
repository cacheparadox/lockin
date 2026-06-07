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

  try {
    const prompt = `You are an elite, brutally honest RPG Calibration Engine. Your job is to calibrate a user's RPG experience multipliers based on a 20-question psychological exam and their current goals.

User Main Quest: ${mainQuest}
Side Quests & Hobbies: ${sideQuests}
Current Status: ${currentStatus}

Psychological Exam Answers (20 Questions):
${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join("\n")}

Analyze their psychological profile, weaknesses, and ambitions. Generate precise XP multipliers for the following 8 categories: fitness, deep_work, business, study, creative, health, finance, mindfulness.

Rules for Multipliers:
- A multiplier of 1.0 is baseline.
- If a category is critical to their Main Quest or they show severe weakness in a vital area that needs balancing, assign a high multiplier (up to 3.0).
- If a category is highly relevant to Side Quests, assign a moderate multiplier (up to 1.8).
- If they are already perfect at something, you can leave it near 1.0 so they don't get free XP for what's already easy for them.

You MUST respond with a raw JSON object containing EXACTLY these 8 keys mapped to numbers (decimals). Do not include any markdown formatting, backticks, or explanation.

Example response:
{
  "fitness_multiplier": 2.1,
  "deep_work_multiplier": 1.5,
  "business_multiplier": 1.0,
  "study_multiplier": 1.8,
  "creative_multiplier": 1.0,
  "health_multiplier": 1.5,
  "finance_multiplier": 2.5,
  "mindfulness_multiplier": 1.2
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
          fitness_multiplier: parsed.fitness_multiplier || 1.0,
          deep_work_multiplier: parsed.deep_work_multiplier || 1.0,
          business_multiplier: parsed.business_multiplier || 1.0,
          study_multiplier: parsed.study_multiplier || 1.0,
          creative_multiplier: parsed.creative_multiplier || 1.0,
          health_multiplier: parsed.health_multiplier || 1.0,
          finance_multiplier: parsed.finance_multiplier || 1.0,
          mindfulness_multiplier: parsed.mindfulness_multiplier || 1.0
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
