import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Lock, Users, BookOpen, Sparkles, Target, TrendingUp, GraduationCap } from 'lucide-react';
import { AuthRedirect } from '@/components/auth/auth-redirect';

export default async function HomePage() {
  const { userId } = await auth();

  // If authenticated, show client-side redirect component
  // that checks localStorage for onboarding state
  if (userId) {
    return <AuthRedirect />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CyberPath</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <main className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full px-4 py-2 text-sm mb-8 border border-cyan-500/30">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-300">AI-Powered Career Guidance</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Path to a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                Cybersecurity
              </span>{' '}
              Career
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your resume, discover personalized career matches, and get a 
              custom learning pathway tailored to your goals and experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/onboarding">
                <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 gap-2">
                  Find Your Career Path
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="ghost" className="h-14 px-8 text-lg border border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* How it works */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 mb-4">
                  <span className="text-lg font-bold text-cyan-400">1</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Upload Resume</h3>
                <p className="text-xs text-slate-400">Share your background</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 mb-4">
                  <span className="text-lg font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Get Matched</h3>
                <p className="text-xs text-slate-400">AI-powered recommendations</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-violet-500/10 border border-violet-500/30 mb-4">
                  <span className="text-lg font-bold text-violet-400">3</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Start Learning</h3>
                <p className="text-xs text-slate-400">Personalized pathway</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Career Matching</h3>
              <p className="text-slate-400 text-sm">
                Our AI analyzes your skills and experience to find cybersecurity careers 
                that match your potential and aspirations.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-500/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">University Courses</h3>
              <p className="text-slate-400 text-sm">
                Access curated content from top universities including Stanford, MIT, 
                Carnegie Mellon, and Georgia Tech.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-violet-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalized Pathways</h3>
              <p className="text-slate-400 text-sm">
                Get a custom learning path that bridges your skill gaps and prepares 
                you for your dream cybersecurity role.
              </p>
            </div>
          </div>

          {/* Admin section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs mb-4">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-300">For Administrators</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">CyberPath Admin Dashboard</h2>
                  <p className="text-slate-400 text-sm mb-4">
                    Manage NICE Framework data, university courses, and educational content. 
                    Designed for curriculum administrators and educators.
                  </p>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10 hover:text-white gap-2">
                      Admin Login
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">Courses</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-slate-300">Jobs</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <Lock className="h-4 w-4 text-violet-400" />
                    <span className="text-xs text-slate-300">TKS</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <GraduationCap className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">Universities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 mt-16 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-500" />
              <p>© 2026 CyberPath. All rights reserved.</p>
            </div>
            <p>Aligned with the NICE Cybersecurity Workforce Framework</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
