import DashboardLayout from "@/app/dashboard/layout";
import { Users, Plus, Shield } from "lucide-react";

export default function GroupsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="flex justify-between items-end border-b-4 border-primary pb-6">
          <div>
            <h1 className="text-5xl font-heading font-black uppercase">Your Groups</h1>
            <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Your Circles of Accountability</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground font-black px-6 py-3 uppercase shadow-brutalist hover:bg-accent transition-colors flex items-center gap-2">
              <Plus size={24} /> New Group
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GroupCard name="Iron Council" members={12} rank={3} xp="142K" status="Thriving" />
          <GroupCard name="Founders Club" members={5} rank={1} xp="89K" status="Active" />
        </div>
      </div>
    </DashboardLayout>
  );
}

function GroupCard({ name, members, rank, xp, status }: any) {
  return (
    <div className="border-4 border-primary bg-card shadow-brutalist overflow-hidden flex flex-col h-full">
      <div className="h-32 bg-accent border-b-4 border-primary p-6 flex items-end">
        <h2 className="text-3xl font-black uppercase text-primary-foreground">{name}</h2>
      </div>
      <div className="p-6 flex-1 space-y-4">
        <div className="flex justify-between items-center border-b-2 border-primary pb-2">
          <span className="font-bold uppercase text-muted-foreground">Status</span>
          <span className="font-black uppercase">{status}</span>
        </div>
        <div className="flex justify-between items-center border-b-2 border-primary pb-2">
          <span className="font-bold uppercase text-muted-foreground">Members</span>
          <span className="font-black uppercase flex items-center gap-2"><Users size={20}/> {members}</span>
        </div>
        <div className="flex justify-between items-center border-b-2 border-primary pb-2">
          <span className="font-bold uppercase text-muted-foreground">Your Rank</span>
          <span className="font-black uppercase">#{rank}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold uppercase text-muted-foreground">Group XP</span>
          <span className="font-black uppercase">{xp}</span>
        </div>
      </div>
      <div className="p-4 border-t-4 border-primary bg-primary text-primary-foreground text-center hover:bg-accent cursor-pointer transition-colors">
        <span className="font-black text-xl uppercase tracking-widest">Enter Group</span>
      </div>
    </div>
  );
}
