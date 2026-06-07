import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Star, Trophy, Target } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if they completed onboarding
  const { data: aiProfile } = await supabase
    .from("li_ai_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!aiProfile) {
    redirect("/onboarding");
  }

  // Fetch their profile
  const { data: profile } = await supabase
    .from("li_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Should exist if actions.ts worked, but fallback just in case
    return <div>Profile error</div>;
  }

  // Fetch active contracts count
  const { count: contractsCount } = await supabase
    .from("li_contracts")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id)
    .eq("state", "ACTIVE");

  // Fetch today's pending tasks (placeholder for actual date logic)
  const { data: tasks } = await supabase
    .from("li_tasks")
    .select("*")
    .eq("assignee_id", user.id)
    .eq("status", "PENDING")
    .limit(3);

  // Fetch recent war room posts
  const { data: posts } = await supabase
    .from("li_war_room_posts")
    .select("*, li_profiles(username, level)")
    .order("created_at", { ascending: false })
    .limit(2);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b-4 border-primary pb-6">
        <div>
          <h1 className="text-5xl font-heading font-black uppercase">Dashboard</h1>
          <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Lvl. {profile.level} {profile.title}</p>
        </div>
        <div className="flex gap-4">
          <Badge className="text-lg py-2 px-4 border-2 border-primary rounded-none shadow-brutalist bg-accent text-primary-foreground">
            <Flame className="mr-2" /> {profile.current_streak} Day Streak
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Current XP" value={profile.current_xp.toLocaleString()} icon={<Star size={32} />} />
        <StatsCard title="Reputation" value={`${profile.reputation_score}%`} icon={<Trophy size={32} />} />
        <StatsCard title="Active Contracts" value={(contractsCount || 0).toString()} icon={<Target size={32} />} />
        <StatsCard title="Group Rank" value="-" icon={<Trophy size={32} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase border-b-4 border-primary pb-2 inline-block">Today's Tasks</h2>
          <div className="space-y-4">
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="border-4 border-primary p-4 bg-card flex justify-between items-center shadow-brutalist">
                  <div>
                    <h3 className="font-bold text-xl uppercase">{task.title}</h3>
                    <p className="text-muted-foreground">{task.description}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground rounded-none px-3 py-1">{task.difficulty}</Badge>
                </div>
              ))
            ) : (
              <div className="border-4 border-border p-8 bg-card text-center text-muted-foreground font-bold uppercase">
                NO PENDING TASKS
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase border-b-4 border-primary pb-2 inline-block">Recent War Room</h2>
          
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border-4 border-primary p-6 bg-card shadow-brutalist mb-4">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-primary pb-4">
                  <div className="w-12 h-12 bg-accent border-2 border-primary"></div>
                  <div>
                    <p className="font-bold uppercase">{(post as any).li_profiles?.username} (Lvl {(post as any).li_profiles?.level})</p>
                    <p className="text-sm text-muted-foreground">Just now</p>
                  </div>
                </div>
                <p className="font-bold text-lg">{post.caption}</p>
              </div>
            ))
          ) : (
            <div className="border-4 border-border p-8 bg-card text-center text-muted-foreground font-bold uppercase">
              WAR ROOM IS SILENT
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="border-4 border-primary rounded-none shadow-brutalist">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold uppercase">{title}</CardTitle>
        <div className="text-accent">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black font-heading">{value}</div>
      </CardContent>
    </Card>
  );
}
