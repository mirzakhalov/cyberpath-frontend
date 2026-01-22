import Link from 'next/link';
import { Shield } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const userName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 transition-transform group-hover:scale-105">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">CyberPath</span>
            </Link>
            
            {/* Show different content based on auth state */}
            <SignedOut>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Already have an account?</span>
                <Link
                  href="/sign-in"
                  className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground font-medium">
                  Hi, {userName}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-8 w-8',
                    },
                  }}
                />
              </div>
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-200/50 dark:border-slate-800/50 mt-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 CyberPath. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

