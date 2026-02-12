'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, DollarSign, Briefcase, User } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OnboardingProgress } from '@/components/onboarding';
import { useOnboarding } from '@/hooks';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Upload Resume' },
  { id: 2, name: 'Job Matches' },
  { id: 3, name: 'Select Career' },
  { id: 4, name: 'Create Account' },
  { id: 5, name: 'Your Pathway' },
];

function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SelectJobPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { selectedJob, sessionToken, isInitialized } = useOnboarding();

  // If already signed in, skip straight to generate
  useEffect(() => {
    if (isLoaded && isSignedIn && isInitialized && selectedJob) {
      router.push('/onboarding/generate');
    }
  }, [isLoaded, isSignedIn, isInitialized, selectedJob, router]);

  // Redirect if no selected job (only after initialized)
  useEffect(() => {
    if (isInitialized && !selectedJob) {
      router.push('/onboarding/recommendations');
    }
  }, [isInitialized, selectedJob, router]);

  // Redirect if no session (only after initialized)
  useEffect(() => {
    if (isInitialized && !sessionToken) {
      router.push('/onboarding');
    }
  }, [isInitialized, sessionToken, router]);

  if (!isInitialized || !selectedJob) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Progress indicator */}
      <div className="max-w-2xl mx-auto mb-12">
        <OnboardingProgress steps={ONBOARDING_STEPS} currentStep={3} />
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mb-6">
          <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Great Choice!
        </h1>
        <p className="text-lg text-muted-foreground">
          You've selected your career path. Create an account to get your 
          personalized learning pathway.
        </p>
      </div>

      {/* Selected job card */}
      <div className="max-w-2xl mx-auto mb-10">
        <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-white to-orange-50/30 dark:from-slate-900 dark:to-orange-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-3 bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-0">
                  Selected Career Path
                </Badge>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {selectedJob.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Job details */}
            <div className={cn(
              'grid gap-4',
              selectedJob.salary_min || selectedJob.salary_max ? 'md:grid-cols-2' : 'md:grid-cols-1'
            )}>
              {(selectedJob.salary_min > 0 || selectedJob.salary_max > 0) && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Salary Range</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatSalary(selectedJob.salary_min)} - {formatSalary(selectedJob.salary_max)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Skills to Learn</p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedJob.skills_need_count ?? selectedJob.tks_count} skills to develop
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">About This Role</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements */}
            {selectedJob.requirements && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Requirements</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedJob.requirements}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40">
              <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Create Your Account
              </h3>
              <p className="text-sm text-muted-foreground">
                Sign up to save your progress and generate your learning pathway
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              <Link href="/sign-up?redirect_url=/onboarding/generate">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 text-base font-semibold"
            >
              <Link href="/sign-in?redirect_url=/onboarding/generate">
                I Already Have an Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/onboarding/recommendations"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Choose a different career path
          </Link>
        </div>
      </div>
    </div>
  );
}

