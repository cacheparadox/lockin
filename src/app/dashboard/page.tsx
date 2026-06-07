import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Star, Trophy, Target } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b-4 border-primary pb-6">
        <div>
          <h1 className="text-5xl font-heading font-black uppercase">Dashboard</h1>
          <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Lvl. 14 Disciplined</p>
        </div>
        <div className="flex gap-4">
          <Badge className="text-lg py-2 px-4 border-2 border-primary rounded-none shadow-brutalist bg-accent text-primary">
            <Flame className="mr-2" /> 7 Day Streak
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Current XP" value="1,240" icon={<Star size={32} />} />
        <StatsCard title="Reputation" value="98%" icon={<Trophy size={32} />} />
        <StatsCard title="Active Contracts" value="2" icon={<Target size={32} />} />
        <StatsCard title="Group Rank" value="#3" icon={<Trophy size={32} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase border-b-4 border-primary pb-2 inline-block">Today's Tasks</h2>
          <div className="space-y-4">
            {/* Task Item Placeholder */}
            <div className="border-4 border-primary p-4 bg-card flex justify-between items-center shadow-brutalist">
              <div>
                <h3 className="font-bold text-xl uppercase">Deep Work Session</h3>
                <p className="text-muted-foreground">90 minutes uninterrupted</p>
              </div>
              <Badge className="bg-primary text-primary-foreground rounded-none px-3 py-1">HARD (150 XP)</Badge>
            </div>
            <div className="border-4 border-primary p-4 bg-card flex justify-between items-center shadow-brutalist">
              <div>
                <h3 className="font-bold text-xl uppercase">Gym: Push Day</h3>
                <p className="text-muted-foreground">Log workout on Strava</p>
              </div>
              <Badge className="bg-primary text-primary-foreground rounded-none px-3 py-1">MEDIUM (75 XP)</Badge>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase border-b-4 border-primary pb-2 inline-block">Recent War Room</h2>
          <div className="border-4 border-primary p-6 bg-card shadow-brutalist">
            <div className="flex items-center gap-4 mb-4 border-b-2 border-primary pb-4">
              <div className="w-12 h-12 bg-accent border-2 border-primary"></div>
              <div>
                <p className="font-bold uppercase">Alex (Lvl 21)</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <p className="font-bold text-lg">Just crushed a 10km run. No excuses.</p>
            <div className="mt-4 bg-muted h-32 border-2 border-primary flex items-center justify-center font-bold text-muted-foreground">
              [Proof Image]
            </div>
          </div>
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
