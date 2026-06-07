import DashboardLayout from "@/app/dashboard/layout";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="border-b-4 border-primary pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-heading font-black uppercase">Contracts</h1>
            <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Long-Term Commitments</p>
          </div>
          <button className="bg-primary text-primary-foreground font-black px-6 py-3 uppercase shadow-brutalist hover:bg-destructive transition-colors">
            Sign New Contract
          </button>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase inline-block border-4 border-primary px-4 py-2 bg-destructive text-primary-foreground">Active Contracts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContractCard 
              title="Lose 5kg" 
              description="Drop body fat percentage before Summer."
              target="5 kg"
              progress="2 kg"
              deadline="30 Days Left"
              reward="5000 XP"
              stake="Shave head if failed"
              status="ACTIVE"
            />
            <ContractCard 
              title="Build Startup MVP" 
              description="Launch V1 of the SaaS app to first 10 users."
              target="10 Users"
              progress="3 Users"
              deadline="14 Days Left"
              reward="10000 XP"
              stake="Buy dinner for the group"
              status="ACTIVE"
            />
          </div>
        </section>

        <section className="space-y-6 opacity-75">
          <h2 className="text-3xl font-heading font-black uppercase inline-block border-b-4 border-primary pb-2">Completed Contracts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContractCard 
              title="Read 12 Books" 
              description="Read 1 book per week for 3 months."
              target="12 Books"
              progress="12 Books"
              deadline="Completed"
              reward="8000 XP"
              status="COMPLETED"
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function ContractCard({ title, description, target, progress, deadline, reward, stake, status }: any) {
  const isCompleted = status === "COMPLETED";
  return (
    <div className={`border-4 border-primary p-6 shadow-brutalist flex flex-col justify-between ${isCompleted ? 'bg-muted' : 'bg-card'}`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <Badge className={`${isCompleted ? 'bg-success' : 'bg-destructive'} text-primary-foreground rounded-none uppercase px-3 py-1 font-bold border-2 border-primary`}>
            {status}
          </Badge>
          <span className="font-bold uppercase text-xl flex items-center gap-2">
            {isCompleted ? <CheckCircle2 className="text-success" /> : <ShieldAlert className="text-destructive" />}
            {deadline}
          </span>
        </div>
        <h3 className="font-black text-3xl uppercase mb-2 line-clamp-1">{title}</h3>
        <p className="text-muted-foreground font-bold uppercase mb-6">{description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between font-bold uppercase mb-2">
              <span>Progress</span>
              <span>{progress} / {target}</span>
            </div>
            <div className="h-4 border-2 border-primary w-full bg-muted">
              <div className={`h-full border-r-2 border-primary ${isCompleted ? 'bg-success w-full' : 'bg-accent w-2/5'}`}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t-4 border-primary grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase text-muted-foreground">Reward</span>
          <span className="font-black text-xl text-accent">{reward}</span>
        </div>
        {stake && (
          <div className="flex flex-col border-l-4 border-primary pl-4">
            <span className="text-xs font-bold uppercase text-muted-foreground">Stake</span>
            <span className="font-black text-sm text-destructive">{stake}</span>
          </div>
        )}
      </div>
    </div>
  );
}
