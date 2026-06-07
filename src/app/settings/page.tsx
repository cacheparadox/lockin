import DashboardLayout from "@/app/dashboard/layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="border-b-4 border-primary pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-heading font-black uppercase">Settings</h1>
            <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">System Configuration</p>
          </div>
        </header>

        <section className="space-y-6">
          <div className="border-4 border-primary p-6 bg-card shadow-brutalist">
            <h2 className="font-bold text-2xl uppercase mb-4">Profile Settings</h2>
            <p className="text-muted-foreground">Profile editing will be available after onboarding is fully connected.</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
