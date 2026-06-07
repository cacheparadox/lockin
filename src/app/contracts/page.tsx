import DashboardLayout from "@/app/dashboard/layout";
import Link from "next/link";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ContractsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: contracts } = await supabase
    .from("li_contracts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activeContracts = contracts?.filter(c => c.state === 'ACTIVE') || [];
  const completedContracts = contracts?.filter(c => c.state === 'COMPLETED' || c.state === 'FAILED') || [];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="border-b-4 border-primary pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-heading font-black uppercase">Contracts</h1>
            <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Long-Term Commitments</p>
          </div>
          <Link href="/contracts/new" className="bg-primary text-primary-foreground font-black px-6 py-3 uppercase shadow-brutalist hover:bg-destructive transition-colors">
            Assign Contract
          </Link>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-heading font-black uppercase inline-block border-4 border-primary px-4 py-2 bg-destructive text-primary-foreground">Active Contracts</h2>
          
          {activeContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeContracts.map(contract => (
                <ContractCard 
                  key={contract.id}
                  title={contract.title} 
                  description={contract.description}
                  target={`${contract.target_value} ${contract.target_metric}`}
                  progress={`${contract.current_value} ${contract.target_metric}`}
                  deadline={contract.deadline ? new Date(contract.deadline).toLocaleDateString() : 'No Deadline'}
                  reward={`${contract.reward_xp} XP`}
                  stake={contract.optional_stake}
                  status={contract.state}
                />
              ))}
            </div>
          ) : (
            <div className="border-4 border-border p-10 bg-card text-center text-muted-foreground font-bold uppercase text-xl">
              NO ACTIVE CONTRACTS. COMFORT IS THE ENEMY.
            </div>
          )}
        </section>

        <section className="space-y-6 opacity-75">
          <h2 className="text-3xl font-heading font-black uppercase inline-block border-b-4 border-primary pb-2">Contract History</h2>
          
          {completedContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {completedContracts.map(contract => (
                <ContractCard 
                  key={contract.id}
                  title={contract.title} 
                  description={contract.description}
                  target={`${contract.target_value} ${contract.target_metric}`}
                  progress={`${contract.current_value} ${contract.target_metric}`}
                  deadline={contract.deadline ? new Date(contract.deadline).toLocaleDateString() : 'No Deadline'}
                  reward={`${contract.reward_xp} XP`}
                  stake={contract.optional_stake}
                  status={contract.state}
                />
              ))}
            </div>
          ) : (
            <div className="border-4 border-border p-10 bg-card text-center text-muted-foreground font-bold uppercase text-xl">
              NO COMPLETED CONTRACTS
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

function ContractCard({ title, description, target, progress, deadline, reward, stake, status }: any) {
  const isActive = status === "ACTIVE";
  
  return (
    <div className={`border-8 border-primary p-8 bg-card shadow-brutalist relative overflow-hidden ${!isActive ? 'opacity-70 grayscale' : ''}`}>
      <div className="absolute -right-10 -top-10 text-primary opacity-10">
        <ShieldAlert size={200} />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <Badge className={`${isActive ? 'bg-destructive' : 'bg-muted text-muted-foreground'} text-primary-foreground font-black text-lg px-4 py-1 rounded-none uppercase`}>
            {status}
          </Badge>
          <span className="font-bold text-muted-foreground uppercase">{deadline}</span>
        </div>
        
        <h3 className="font-black text-4xl uppercase tracking-tighter mb-4">{title}</h3>
        <p className="text-xl font-bold text-muted-foreground mb-8">{description}</p>
        
        <div className="space-y-6 border-t-4 border-primary pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-muted-foreground">Target</p>
              <p className="text-2xl font-black uppercase">{target}</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-muted-foreground">Progress</p>
              <p className="text-2xl font-black uppercase">{progress}</p>
            </div>
          </div>
          
          <div className="bg-muted border-2 border-primary p-4">
            <p className="text-sm font-bold uppercase text-muted-foreground mb-1">Reward</p>
            <p className="text-xl font-black text-accent flex items-center gap-2">
              <CheckCircle2 size={24} /> {reward}
            </p>
          </div>
          
          {stake && (
            <div className="bg-destructive text-primary-foreground border-2 border-primary p-4">
              <p className="text-sm font-bold uppercase mb-1">Blood Stake (If Failed)</p>
              <p className="text-xl font-black uppercase">{stake}</p>
            </div>
          )}
        </div>

        {isActive && (
          <button className="w-full bg-primary text-primary-foreground font-black text-xl uppercase py-4 mt-8 hover:bg-accent transition-colors shadow-brutalist">
            Log Progress
          </button>
        )}
      </div>
    </div>
  );
}
