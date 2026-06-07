import Link from "next/link";
import { Shield, Home, Target, Sword, Users, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r-4 border-primary bg-background flex flex-col h-screen font-sans">
      <div className="p-6 border-b-4 border-primary">
        <h1 className="text-3xl font-heading font-black tracking-tighter uppercase">
          Lock In
        </h1>
      </div>

      <nav className="flex-1 p-6 flex flex-col gap-4">
        <SidebarLink href="/dashboard" icon={<Home size={24} />} label="Dashboard" />
        <SidebarLink href="/tasks" icon={<Target size={24} />} label="Tasks" />
        <SidebarLink href="/contracts" icon={<Shield size={24} />} label="Contracts" />
        <SidebarLink href="/war-room" icon={<Sword size={24} />} label="War Room" />
        <SidebarLink href="/groups" icon={<Users size={24} />} label="Groups" />
      </nav>

      <div className="p-6 border-t-4 border-primary mt-auto">
        <SidebarLink href="/settings" icon={<Settings size={24} />} label="Settings" />
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 text-xl font-bold uppercase hover:bg-primary hover:text-primary-foreground p-3 transition-colors border-2 border-transparent hover:border-primary shadow-none hover:shadow-brutalist"
    >
      {icon}
      {label}
    </Link>
  );
}
