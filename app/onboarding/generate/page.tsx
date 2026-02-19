'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingProgress, PathwayGenerationLoading } from '@/components/onboarding';
import { useOnboarding } from '@/hooks';
import { toast } from 'sonner';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Upload Resume' },
  { id: 2, name: 'Job Matches' },
  { id: 3, name: 'Select Career' },
  { id: 4, name: 'Create Account' },
  { id: 5, name: 'Your Pathway' },
];

export default function GeneratePathwayPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const {
    selectedJob,
    pathway,
    generateUserPathway,
    isLoading,
    isInitialized,
    error,
  } = useOnboarding();

  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/onboarding/select');
    }
  }, [isLoaded, isSignedIn, router]);

  // Redirect if no selected job (only after initialized)
  useEffect(() => {
    if (isLoaded && isSignedIn && isInitialized && !selectedJob) {
      router.push('/onboarding/recommendations');
    }
  }, [isLoaded, isSignedIn, isInitialized, selectedJob, router]);

  // Start generation automatically when the page loads
  useEffect(() => {
    if (isInitialized && isSignedIn && selectedJob && !hasStarted && !pathway) {
      setHasStarted(true);
      generateUserPathway('parallel', 'challenge')
        .then(() => {
          setIsComplete(true);
        })
        .catch(() => {
          toast.error(error?.message || 'Failed to generate pathway. Please try again.');
        });
    }
  }, [isInitialized, isSignedIn, selectedJob, hasStarted, pathway, generateUserPathway, error]);

  // If pathway already exists, mark as complete
  useEffect(() => {
    if (pathway) {
      setIsComplete(true);
    }
  }, [pathway]);

  const handleViewPathway = () => {
    if (pathway) {
      router.push(`/pathway/${pathway.id}`);
    }
  };

  const handleRetry = () => {
    setHasStarted(false);
    setIsComplete(false);
  };

  if (!isLoaded || !isSignedIn || !isInitialized || !selectedJob) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Progress indicator */}
      <div className="max-w-2xl mx-auto mb-12">
        <OnboardingProgress steps={ONBOARDING_STEPS} currentStep={isComplete ? 5 : 4} />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {isComplete && pathway ? (
          // Success state
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Pathway is Ready!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              {pathway.generation_mode === 'challenge' ? (
                <>
                  We&apos;ve created a personalized {pathway.cyberpath_courses.reduce((sum, c) => sum + (c.challenges?.length ?? 0), 0)}-challenge hands-on pathway
                  to help you become a {selectedJob.title}.
                </>
              ) : pathway.generation_mode === 'topic' ? (
                <>
                  We&apos;ve created a personalized {pathway.cyberpath_courses.reduce((sum, c) => sum + (c.topics?.length ?? 0), 0)}-topic learning journey
                  to help you become a {selectedJob.title}.
                </>
              ) : (
                <>
                  We&apos;ve created a personalized {pathway.total_weeks}-week learning journey
                  to help you become a {selectedJob.title}.
                </>
              )}
            </p>

            {/* Pathway stats */}
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-2xl font-bold text-foreground">
                  {pathway.cyberpath_courses?.length || 4}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Courses
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-2xl font-bold text-foreground">
                  {pathway.generation_mode === 'challenge'
                    ? pathway.cyberpath_courses.reduce((sum, c) => sum + (c.challenges?.length ?? 0), 0)
                    : pathway.generation_mode === 'topic'
                    ? pathway.cyberpath_courses.reduce((sum, c) => sum + (c.topics?.length ?? 0), 0)
                    : pathway.total_weeks}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {pathway.generation_mode === 'challenge' ? 'Challenges' : pathway.generation_mode === 'topic' ? 'Topics' : 'Weeks'}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-2xl font-bold text-foreground">
                  {pathway.generation_mode === 'topic' && pathway.ks_coverage_percentage != null
                    ? `${Math.round(pathway.ks_coverage_percentage * 100)}%`
                    : pathway.tks_gap_count}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {pathway.generation_mode === 'topic' ? 'KS Coverage' : 'Skills Gap'}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleViewPathway}
              className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/25"
            >
              View My Learning Pathway
            </Button>
          </div>
        ) : isLoading ? (
          // Loading state
          <div className="py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Creating Your Learning Pathway
              </h1>
              <p className="text-muted-foreground">
                for {selectedJob.title}
              </p>
            </div>
            <PathwayGenerationLoading />
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-destructive/10 mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Something Went Wrong
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              {error.message || 'We encountered an error while generating your pathway. Please try again.'}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleRetry}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/onboarding/recommendations')}
              >
                Choose Different Career
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

