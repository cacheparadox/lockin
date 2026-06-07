import DashboardLayout from "@/app/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: tasks } = await supabase
    .from("li_tasks")
    .select("*, li_profiles!creator_id(username)")
    .eq("assignee_id", user.id)
    .order("created_at", { ascending: false });

  const personalTasks = tasks?.filter(t => t.is_personal) || [];
  const assignedTasks = tasks?.filter(t => !t.is_personal) || [];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="border-b-4 border-primary pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-heading font-black uppercase">Tasks</h1>
            <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Your Daily Objectives</p>
          </div>
          <button className="bg-primary text-primary-foreground font-black px-6 py-3 uppercase shadow-brutalist hover:bg-accent transition-colors">
            Create Task
          </button>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase inline-block bg-primary text-primary-foreground px-4 py-2">Assigned Tasks</h2>
          
          {assignedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  title={task.title} 
                  difficulty={task.difficulty} 
                  category={task.category} 
                  assignedBy={(task as any).li_profiles?.username} 
                />
              ))}
            </div>
          ) : (
            <div className="border-4 border-border p-10 bg-card text-center text-muted-foreground font-bold uppercase text-xl">
              NO ACTIVE ASSIGNMENTS
            </div>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase inline-block border-4 border-primary px-4 py-2">Personal Tasks</h2>
          
          {personalTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  title={task.title} 
                  difficulty={task.difficulty} 
                  category={task.category} 
                  isPersonal 
                />
              ))}
            </div>
          ) : (
            <div className="border-4 border-border p-10 bg-card text-center text-muted-foreground font-bold uppercase text-xl">
              NO PERSONAL TASKS
            </div>
          )}
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
          {isPersonal ? "Self Assigned" : `Assigned by ${assignedBy || 'Unknown'}`}
        </span>
        <button className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase hover:bg-accent transition-colors">
          Submit Proof
        </button>
      </div>
    </div>
  );
}
