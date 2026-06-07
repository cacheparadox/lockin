import Link from "next/link";
import { Shield, Home, Target, Sword, Users, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-primary bg-background flex flex-col md:h-screen font-sans shrink-0">
      <div className="p-4 md:p-6 border-b-4 border-primary">
        <h1 className="text-3xl font-heading font-black tracking-tighter uppercase">
          Lock In
        </h1>
      </div>

      <nav className="p-4 md:p-6 flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide md:flex-1">
        <SidebarLink href="/dashboard" icon={<Home size={20} className="md:w-6 md:h-6" />} label="Dashboard" />
        <SidebarLink href="/tasks" icon={<Target size={20} className="md:w-6 md:h-6" />} label="Tasks" />
        <SidebarLink href="/contracts" icon={<Shield size={20} className="md:w-6 md:h-6" />} label="Contracts" />
        <SidebarLink href="/war-room" icon={<Sword size={20} className="md:w-6 md:h-6" />} label="War Room" />
        <SidebarLink href="/groups" icon={<Users size={20} className="md:w-6 md:h-6" />} label="Groups" />
      </nav>

      <div className="hidden md:block p-6 border-t-4 border-primary mt-auto">
        <SidebarLink href="/settings" icon={<Settings size={24} />} label="Settings" />
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 md:gap-4 text-sm md:text-xl font-bold uppercase hover:bg-primary hover:text-primary-foreground p-2 md:p-3 transition-colors border-2 border-transparent hover:border-primary shadow-none hover:shadow-brutalist shrink-0"
    >
      {icon}
      <span className="hidden sm:inline md:inline">{label}</span>
    </Link>
  );
}
