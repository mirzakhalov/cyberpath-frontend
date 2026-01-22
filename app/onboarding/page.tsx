'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Target, GraduationCap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeDropzone, OnboardingProgress } from '@/components/onboarding';
import { useOnboarding } from '@/hooks';
import { toast } from 'sonner';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Upload Resume' },
  { id: 2, name: 'Job Matches' },
  { id: 3, name: 'Select Career' },
  { id: 4, name: 'Create Account' },
  { id: 5, name: 'Your Pathway' },
];

const FEATURES = [
  {
    icon: Target,
    title: 'AI-Powered Matching',
    description: 'Get personalized career recommendations based on your unique background',
  },
  {
    icon: GraduationCap,
    title: 'Curated Learning',
    description: 'Access courses from top universities tailored to fill your skill gaps',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Build a clear pathway from where you are to where you want to be',
  },
];

export default function OnboardingStartPage() {
  const router = useRouter();
  const { startSession, isLoading, error, clearError } = useOnboarding();
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [careerGoals, setCareerGoals] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!careerGoals.trim()) {
      toast.error('Please describe your career goals');
      return;
    }

    try {
      clearError();
      await startSession(careerGoals, resumeFile || undefined);
      router.push('/onboarding/recommendations');
    } catch {
      toast.error(error?.message || 'Failed to start onboarding. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Progress indicator */}
      <div className="max-w-2xl mx-auto mb-12">
        <OnboardingProgress steps={ONBOARDING_STEPS} currentStep={1} />
      </div>

      {/* Hero section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-950/50 rounded-full px-4 py-2 text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-6">
          <Sparkles className="h-4 w-4" />
          AI-Powered Career Guidance
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Discover Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
            Cybersecurity
          </span>{' '}
          Career Path
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your resume and tell us about your goals. Our AI will match you with 
          the perfect cybersecurity career and create a personalized learning pathway.
        </p>
      </div>

      {/* Main form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resume upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Upload Your Resume
              <span className="text-muted-foreground font-normal ml-2">(optional but recommended)</span>
            </label>
            <ResumeDropzone
              selectedFile={resumeFile}
              onFileSelect={setResumeFile}
              disabled={isLoading}
            />
          </div>

          {/* Career goals */}
          <div className="space-y-3">
            <label htmlFor="careerGoals" className="block text-sm font-medium text-foreground">
              What are your career goals?
              <span className="text-destructive ml-1">*</span>
            </label>
            <Textarea
              id="careerGoals"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="Example: I want to become a penetration tester. I have experience in IT support and recently earned my CompTIA Security+ certification. I'm interested in ethical hacking and finding vulnerabilities in systems."
              className="min-h-[140px] text-base"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Be specific about your current skills, certifications, and desired roles. 
              The more detail you provide, the better we can match you.
            </p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !careerGoals.trim()}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing your profile...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Find My Career Path
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </form>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4">
                <feature.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Powered by content from leading universities and aligned with the NICE Framework
          </p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            {['Stanford', 'MIT', 'Carnegie Mellon', 'Georgia Tech'].map((name) => (
              <span key={name} className="text-sm font-medium text-muted-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

