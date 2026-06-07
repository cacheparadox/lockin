import { redirect } from "next/navigation";
import { completeOnboarding } from "./actions";
import { createClient } from "@/utils/supabase/server";

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
      <div className="max-w-2xl w-full border-4 border-border bg-card p-10 shadow-brutalist">
        <h1 className="text-5xl font-heading font-black uppercase mb-4 text-primary">Target Lock</h1>
        <p className="text-xl font-bold text-muted-foreground uppercase mb-10 border-b-2 border-border pb-6">
          Define your parameters. AI will calibrate your experience.
        </p>

        <form action={completeOnboarding} className="space-y-8">
          <div>
            <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="main_quest">
              Main Quest
            </label>
            <p className="text-sm font-bold text-muted-foreground mb-3 uppercase">Your primary objective for the next 6-12 months.</p>
            <textarea
              id="main_quest"
              name="main_quest"
              required
              rows={3}
              className="w-full border-2 border-border bg-input p-4 font-bold text-foreground focus:outline-none focus:border-primary transition-colors resize-none uppercase placeholder-muted-foreground"
              placeholder="E.g. Build a SaaS startup to $10k MRR"
            ></textarea>
          </div>

          <div>
            <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="side_quests">
              Side Quests & Hobbies
            </label>
            <textarea
              id="side_quests"
              name="side_quests"
              required
              rows={2}
              className="w-full border-2 border-border bg-input p-4 font-bold text-foreground focus:outline-none focus:border-primary transition-colors resize-none uppercase placeholder-muted-foreground"
              placeholder="E.g. Lifting, Reading Philosophy, Chess"
            ></textarea>
          </div>

          <div>
            <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="current_status">
              Current Status
            </label>
            <textarea
              id="current_status"
              name="current_status"
              required
              rows={3}
              className="w-full border-2 border-border bg-input p-4 font-bold text-foreground focus:outline-none focus:border-primary transition-colors resize-none uppercase placeholder-muted-foreground"
              placeholder="Working 9-5, going to gym 2x a week, feeling stuck."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-black text-2xl uppercase py-6 hover:bg-accent hover:text-accent-foreground transition-all shadow-brutalist-lg mt-8"
          >
            Calibrate Profile
          </button>
        </form>
      </div>
    </div>
  );
}
