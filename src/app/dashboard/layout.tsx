import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10 md:max-h-screen md:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
