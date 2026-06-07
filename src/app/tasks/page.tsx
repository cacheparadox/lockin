import DashboardLayout from "@/app/dashboard/layout";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="border-b-4 border-primary pb-6">
          <h1 className="text-5xl font-heading font-black uppercase">Tasks</h1>
          <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Your Daily Objectives</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase inline-block bg-primary text-primary-foreground px-4 py-2">Assigned Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaskCard title="100 Pushups" difficulty="EXTREME (300 XP)" category="FITNESS" assignedBy="David G." />
            <TaskCard title="Finish Chapter 3" difficulty="MEDIUM (75 XP)" category="STUDY" assignedBy="Alex" />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase inline-block border-4 border-primary px-4 py-2">Personal Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaskCard title="Read 30 pages" difficulty="EASY (25 XP)" category="STUDY" isPersonal />
            <TaskCard title="2 Hours Deep Work" difficulty="HARD (150 XP)" category="DEEP_WORK" isPersonal />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function TaskCard({ title, difficulty, category, assignedBy, isPersonal }: any) {
  return (
    <div className="border-4 border-primary p-6 bg-card flex flex-col justify-between shadow-brutalist min-h-[200px]">
      <div>
        <div className="flex justify-between items-start mb-4">
          <Badge className="bg-primary text-primary-foreground rounded-none uppercase">{category}</Badge>
          <Badge className="bg-accent text-accent-foreground border-2 border-primary rounded-none uppercase">{difficulty}</Badge>
        </div>
        <h3 className="font-bold text-2xl uppercase mt-4">{title}</h3>
      </div>
      <div className="mt-6 border-t-2 border-primary pt-4 flex justify-between items-center">
        <span className="text-sm font-bold uppercase text-muted-foreground">
          {isPersonal ? "Self Assigned" : `Assigned by ${assignedBy}`}
        </span>
        <button className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase hover:bg-accent transition-colors">
          Submit Proof
        </button>
      </div>
    </div>
  );
}
