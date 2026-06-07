import DashboardLayout from "@/app/dashboard/layout";
import { joinGroup } from "@/app/groups/actions";

export default function JoinGroupPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-10">
        <header className="border-b-4 border-primary pb-6">
          <h1 className="text-5xl font-heading font-black uppercase">Join Group</h1>
          <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Enter an invite code to join an alliance.</p>
        </header>

        {searchParams?.error && (
          <div className="bg-destructive/20 border-4 border-destructive p-4 text-destructive font-black uppercase">
            {searchParams.error}
          </div>
        )}

        <form action={joinGroup} className="space-y-8 bg-card border-8 border-primary p-10 shadow-brutalist">
          <div>
            <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="invite_code">Invite Code</label>
            <input
              type="text"
              id="invite_code"
              name="invite_code"
              required
              className="w-full border-4 border-primary bg-input p-6 text-2xl tracking-widest font-black text-foreground focus:outline-none focus:bg-accent transition-colors uppercase shadow-brutalist text-center"
              placeholder="LOCKIN-XXXXX"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground px-12 py-6 font-black text-2xl uppercase hover:bg-accent transition-colors shadow-brutalist"
          >
            Enter Alliance
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
