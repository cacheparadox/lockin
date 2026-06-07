import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full border-8 border-primary bg-card p-12 shadow-[16px_16px_0px_0px_#171717]">
        <div className="flex justify-center mb-8">
          <Shield size={120} className="text-primary" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-7xl md:text-9xl font-heading font-black text-center uppercase tracking-tighter mb-6">
          Lock In
        </h1>
        
        <p className="text-2xl md:text-3xl font-bold text-center uppercase mb-12 border-y-4 border-primary py-6">
          Private Social Accountability Operating System
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link 
            href="/dashboard"
            className="flex items-center justify-center gap-4 bg-primary text-primary-foreground font-black text-2xl uppercase px-8 py-6 hover:bg-accent transition-colors shadow-brutalist w-full md:w-auto"
          >
            Enter OS <ArrowRight size={32} />
          </Link>
        </div>
      </div>
    </div>
  );
}
