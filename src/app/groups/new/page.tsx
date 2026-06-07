import DashboardLayout from "@/app/dashboard/layout";
import { createGroup } from "@/app/groups/actions";

export default function NewGroupPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-10">
        <header className="border-b-4 border-primary pb-6">
          <h1 className="text-5xl font-heading font-black uppercase">Forge Group</h1>
          <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Create a new circle of accountability.</p>
        </header>

        {searchParams?.error && (
          <div className="bg-destructive/20 border-4 border-destructive p-4 text-destructive font-black uppercase">
            {searchParams.error}
          </div>
        )}

        <form action={createGroup} className="space-y-8 bg-card border-8 border-primary p-10 shadow-brutalist">
          <div>
            <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="name">Group Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors uppercase shadow-brutalist"
              placeholder="e.g. 5AM CLUB"
            />
          </div>

          <div>
            <label className="block text-xl font-black uppercase mb-3 text-foreground" htmlFor="description">Mission Protocol (Description)</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors resize-none uppercase shadow-brutalist"
              placeholder="What is the shared goal of this group?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground px-12 py-6 font-black text-2xl uppercase hover:bg-accent transition-colors shadow-brutalist"
          >
            Forge Alliance
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
