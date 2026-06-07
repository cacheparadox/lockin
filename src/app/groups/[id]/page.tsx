import DashboardLayout from "@/app/dashboard/layout";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function GroupDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch group details
  const { data: group, error } = await supabase
    .from("li_groups")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !group) {
    redirect("/groups");
  }

  // 2. Fetch members
  const { data: members } = await supabase
    .from("li_group_members")
    .select("role, li_profiles(username, avatar_url, level, title)")
    .eq("group_id", params.id);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="border-b-4 border-primary pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-heading font-black uppercase">{group.name}</h1>
            <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">{group.description || "NO MISSION PROTOCOL DECLARED"}</p>
          </div>
          <div className="bg-primary/10 border-4 border-primary p-4 text-center">
            <p className="text-sm font-bold text-muted-foreground uppercase mb-1">Invite Code</p>
            <p className="text-2xl font-black text-primary tracking-widest uppercase">{group.invite_code}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-card border-4 border-primary p-6 shadow-brutalist">
            <h2 className="text-3xl font-black uppercase mb-6 border-b-2 border-primary pb-2">Active Members</h2>
            <div className="space-y-4">
              {members?.map((m: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-accent p-4 border-2 border-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 flex items-center justify-center font-black">
                      {m.li_profiles?.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-black uppercase">{m.li_profiles?.username || "UNKNOWN"}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase">LVL {m.li_profiles?.level || 1} • {m.li_profiles?.title || "WANDERER"}</p>
                    </div>
                  </div>
                  <span className="font-black uppercase text-sm px-2 py-1 bg-primary text-primary-foreground">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card border-4 border-primary p-6 shadow-brutalist">
            <h2 className="text-3xl font-black uppercase mb-6 border-b-2 border-primary pb-2">Active Contracts</h2>
            <div className="text-center text-muted-foreground font-bold uppercase py-10">
              No active contracts for this group.
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
