"use client";

import { useState, useEffect } from "react";
import { completeOnboarding } from "@/app/onboarding/actions";

const LOADING_MESSAGES = [
  "INITIALIZING NEURAL LINK...",
  "ANALYZING PSYCHOLOGICAL WEAKNESSES...",
  "CALCULATING DISCIPLINE COEFFICIENTS...",
  "OPTIMIZING RPG MULTIPLIERS...",
  "CONTACTING NEMOTRON 120B...",
  "FORGING YOUR PROTOCOL..."
];

const QUESTIONS = [
  // Discipline & Baseline Habits
  { id: "q1", question: "How many hours of sleep do you average per night?", options: ["< 5 hours", "5-6 hours", "7-8 hours", "8+ hours"] },
  { id: "q2", question: "How consistent is your morning routine?", options: ["Non-existent", "Varies wildly", "Mostly consistent", "Military precision"] },
  { id: "q3", question: "How often do you exercise?", options: ["Never", "1-2 times a week", "3-4 times a week", "Every day"] },
  { id: "q4", question: "Describe your typical diet.", options: ["Junk/Fast food", "Average, some junk", "Mostly clean", "Strictly tracked macros"] },
  { id: "q5", question: "Do you meditate or practice mindfulness?", options: ["Never", "Rarely", "A few times a week", "Daily"] },
  // Focus & Deep Work
  { id: "q6", question: "Average daily screen time on distractions?", options: ["8+ hours", "4-7 hours", "1-3 hours", "< 1 hour"] },
  { id: "q7", question: "How long can you work without checking your phone?", options: ["< 15 minutes", "30 minutes", "1 hour", "2+ hours"] },
  { id: "q8", question: "How often do you procrastinate on important tasks?", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { id: "q9", question: "Do you use focus techniques (e.g., Pomodoro, time-blocking)?", options: ["Never heard of them", "Tried but failed", "Use them occasionally", "Every single day"] },
  { id: "q10", question: "When do you feel most productive?", options: ["Never", "Late at night", "Afternoons", "Early mornings"] },
  // Ambition & Risk Tolerance
  { id: "q11", question: "What is your primary financial goal right now?", options: ["Survive", "Pay off debt", "Build emergency fund", "Aggressive investing/Business"] },
  { id: "q12", question: "How do you view failure?", options: ["It breaks me", "It hurts, I try to avoid it", "It's a learning experience", "It's necessary data for success"] },
  { id: "q13", question: "Are you willing to sacrifice short-term comfort for long-term gain?", options: ["No", "Maybe slightly", "Usually", "I thrive on discomfort"] },
  { id: "q14", question: "How much risk are you willing to take in your career/business?", options: ["Zero risk", "Calculated low risk", "Moderate risk", "High risk, high reward"] },
  { id: "q15", question: "Do you prefer building alone or with a team?", options: ["Need constant direction", "Prefer a team", "Can do both", "Lone wolf builder"] },
  // Resilience & Mental Health
  { id: "q16", question: "How do you handle high-stress situations?", options: ["Shut down/Panic", "Distract myself", "Push through it", "Analyze and execute"] },
  { id: "q17", question: "How quickly do you bounce back from setbacks?", options: ["Weeks/Months", "A few days", "A few hours", "Instantly"] },
  { id: "q18", question: "What is your social battery like?", options: ["Always drained", "Need frequent breaks", "Balanced", "I draw energy from others"] },
  { id: "q19", question: "How often do you feel burnt out?", options: ["Constantly", "Often", "Occasionally", "Rarely, I manage it well"] },
  { id: "q20", question: "How would you rate your current overall discipline?", options: ["1/10 (Abysmal)", "4/10 (Needs work)", "7/10 (Solid)", "10/10 (Machine)"] },
];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const QUESTIONS_PER_PAGE = 5;
  const totalPages = Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE) + 2; // +1 for text fields, +1 for BYOK
  const progress = Math.round((step / (totalPages - 1)) * 100);

  const handleSelect = (qId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleNext = () => {
    if (step < Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE)) {
      const startIdx = step * QUESTIONS_PER_PAGE;
      const endIdx = startIdx + QUESTIONS_PER_PAGE;
      const currentQuestions = QUESTIONS.slice(startIdx, endIdx);
      const allAnswered = currentQuestions.every(q => answers[q.id]);
      if (!allAnswered) {
        setError("You must answer all questions to proceed.");
        return;
      }
    }
    setError(null);
    setStep(s => Math.min(s + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setError(null);
    setStep(s => Math.max(s - 1, 0));
  };

  const executeCalibration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const prompt = `You are an elite, brutally honest RPG Calibration Engine. Your job is to calibrate a user's RPG experience multipliers based on a 20-question psychological exam and their current goals.

User Main Quest: ${answers["main_quest"] || "None"}
Side Quests & Hobbies: ${answers["side_quests"] || "None"}
Current Status: ${answers["current_status"] || "None"}

Psychological Exam Answers (20 Questions):
${Object.entries(answers)
  .filter(([k]) => k.startsWith("q"))
  .map(([k, v]) => {
    const questionText = QUESTIONS.find(q => q.id === k)?.question || k;
    return `Q: ${questionText}\nA: ${v}`;
  }).join("\n\n")}

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
          "Authorization": `Bearer ${answers["openrouter_key"]}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error("OpenRouter API failed: " + await response.text());
      }

      const json = await response.json();
      let content = json.choices[0].message.content;
      
      // Clean potential markdown blocks
      if (content.startsWith("\`\`\`json")) {
        content = content.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      } else if (content.startsWith("\`\`\`")) {
        content = content.replace(/\`\`\`/g, "").trim();
      }

      const parsed = JSON.parse(content);
      const fd = new FormData();
      Object.entries(answers).forEach(([key, val]) => fd.append(key, val));
      fd.append("multipliers", JSON.stringify(parsed));

      await completeOnboarding(fd);
    } catch (err: any) {
      console.error(err);
      setError("AI Calibration Failed. Ensure your API Key is valid or try again.");
      setIsSubmitting(false);
    }
  };

  const renderQuestions = () => {
    const startIdx = step * QUESTIONS_PER_PAGE;
    const endIdx = startIdx + QUESTIONS_PER_PAGE;
    const currentQuestions = QUESTIONS.slice(startIdx, endIdx);

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentQuestions.map(q => (
          <div key={q.id} className="space-y-4">
            <h3 className="text-2xl font-black uppercase tracking-tight">{q.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(q.id, opt)}
                  className={`border-4 p-4 text-left font-bold uppercase transition-all shadow-brutalist
                    ${answers[q.id] === opt 
                      ? 'border-primary bg-primary text-primary-foreground translate-y-1 translate-x-1 shadow-none' 
                      : 'border-border bg-card hover:border-primary hover:bg-accent'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTextFields = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-3xl font-black uppercase text-primary border-b-4 border-primary pb-2 inline-block">The Protocol</h3>
      
      <div>
        <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="main_quest">Main Quest</label>
        <p className="text-sm font-bold text-muted-foreground mb-3 uppercase">Your primary objective for the next 6-12 months.</p>
        <textarea
          id="main_quest"
          name="main_quest"
          required
          rows={3}
          value={answers["main_quest"] || ""}
          onChange={(e) => setAnswers(prev => ({ ...prev, main_quest: e.target.value }))}
          className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors resize-none uppercase shadow-brutalist"
          placeholder="E.g. Build a SaaS startup to $10k MRR"
        ></textarea>
      </div>

      <div>
        <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="side_quests">Side Quests & Hobbies</label>
        <textarea
          id="side_quests"
          name="side_quests"
          required
          rows={2}
          value={answers["side_quests"] || ""}
          onChange={(e) => setAnswers(prev => ({ ...prev, side_quests: e.target.value }))}
          className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors resize-none uppercase shadow-brutalist"
          placeholder="E.g. Lifting, Reading Philosophy, Chess"
        ></textarea>
      </div>

      <div>
        <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="current_status">Current Status</label>
        <textarea
          id="current_status"
          name="current_status"
          required
          rows={3}
          value={answers["current_status"] || ""}
          onChange={(e) => setAnswers(prev => ({ ...prev, current_status: e.target.value }))}
          className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors resize-none uppercase shadow-brutalist"
          placeholder="Working 9-5, gym 2x a week, feeling stuck."
        ></textarea>
      </div>
    </div>
  );

  const renderBYOK = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-8 border-destructive p-8 bg-destructive/10 relative overflow-hidden">
        <h3 className="text-4xl font-black uppercase text-destructive mb-4 relative z-10">Neural Link Required</h3>
        <p className="text-lg font-bold text-destructive/80 mb-6 uppercase relative z-10">
          To finalize your profile, the AI requires calibration via the OpenRouter network (Nemotron 120b). 
          Enter your API key below. It will be encrypted and stored locally.
        </p>
        
        <input
          type="password"
          id="openrouter_key"
          name="openrouter_key"
          required
          value={answers["openrouter_key"] || ""}
          onChange={(e) => setAnswers(prev => ({ ...prev, openrouter_key: e.target.value }))}
          className="w-full border-4 border-destructive bg-background p-6 text-xl font-black text-foreground focus:outline-none focus:bg-destructive/20 transition-colors uppercase shadow-brutalist relative z-10"
          placeholder="sk-or-v1-..."
        />
      </div>
    </div>
  );

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="max-w-2xl w-full border-8 border-primary p-10 bg-card shadow-brutalist flex flex-col items-center text-center space-y-8">
            <div className="w-16 h-16 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-4xl font-black uppercase text-primary animate-pulse tracking-widest">
              {LOADING_MESSAGES[loadingMsgIdx]}
            </h2>
            <p className="text-xl font-bold text-muted-foreground uppercase">
              Please wait. The Nemotron 120b model requires up to 20 seconds to process your psychological profile.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl w-full mx-auto">
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4 border-b-4 border-primary pb-4">
          <div>
            <h1 className="text-6xl font-heading font-black uppercase tracking-tighter">Psychological Exam</h1>
            <p className="text-2xl font-bold text-muted-foreground uppercase mt-2">Phase {step + 1} of {totalPages}</p>
          </div>
          <span className="text-5xl font-black text-primary">{progress}%</span>
        </div>
        
        {/* Brutalist Progress Bar */}
        <div className="h-6 w-full border-4 border-primary bg-background p-1">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/20 border-4 border-destructive p-4 mb-8 text-destructive font-black uppercase">
          {error}
        </div>
      )}

      <form onSubmit={executeCalibration}>
        {step < Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE) && renderQuestions()}
        {step === Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE) && renderTextFields()}
        {step === totalPages - 1 && renderBYOK()}

        <div className="flex justify-between mt-12 pt-8 border-t-4 border-primary">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 0 || isSubmitting}
            className="border-4 border-primary px-8 py-4 font-black text-xl uppercase hover:bg-accent disabled:opacity-50 transition-colors shadow-brutalist disabled:shadow-none disabled:translate-y-1 disabled:translate-x-1"
          >
            Retreat
          </button>
          
          {step < totalPages - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-primary text-primary-foreground px-12 py-4 font-black text-xl uppercase hover:bg-accent transition-colors shadow-brutalist"
            >
              Advance
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !answers["openrouter_key"]}
              className="bg-destructive text-primary-foreground px-12 py-4 font-black text-2xl uppercase hover:bg-primary transition-colors shadow-brutalist disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? "CALIBRATING..." : "INITIATE PROTOCOL"}
            </button>
          )}
        </div>
      </form>
    </div>
    </>
  );
}
