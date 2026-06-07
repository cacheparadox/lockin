import { login } from "./actions";
import Link from "next/link";
import { Shield } from "lucide-react";

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md border-4 border-border bg-card p-8 shadow-brutalist">
        <div className="flex justify-center mb-6">
          <Shield size={64} className="text-primary" strokeWidth={2} />
        </div>
        <h1 className="text-4xl font-heading font-black text-center uppercase tracking-tight mb-8">
          Sign In
        </h1>

        {searchParams.message && (
          <div className="bg-destructive/20 border-2 border-destructive text-destructive font-bold p-4 mb-6 uppercase text-sm">
            {searchParams.message}
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase text-muted-foreground mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border-2 border-border bg-input p-3 font-bold text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase text-muted-foreground mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border-2 border-border bg-input p-3 font-bold text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={login}
            className="w-full bg-primary text-primary-foreground font-black text-xl uppercase py-4 mt-4 hover:bg-accent hover:text-accent-foreground transition-all shadow-brutalist"
          >
            Enter OS
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-border text-center">
          <p className="text-muted-foreground font-bold uppercase text-sm">
            No Account?{" "}
            <Link href="/signup" className="text-primary hover:text-accent underline underline-offset-4">
              Initialize Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
