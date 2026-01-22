'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  OnboardingProgress,
  JobRecommendationCard,
  RecommendationsLoading,
  JobCardSkeleton,
} from '@/components/onboarding';
import { useOnboarding } from '@/hooks';
import { toast } from 'sonner';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Upload Resume' },
  { id: 2, name: 'Job Matches' },
  { id: 3, name: 'Select Career' },
  { id: 4, name: 'Create Account' },
  { id: 5, name: 'Your Pathway' },
];

export default function RecommendationsPage() {
  const router = useRouter();
  const {
    sessionToken,
    desiredJob,
    recommendations,
    overallAnalysis,
    fetchRecommendations,
    selectJobForPathway,
    isLoading,
    isInitialized,
    error,
    clearError,
  } = useOnboarding();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch recommendations on mount if we have a session but no recommendations
  useEffect(() => {
    if (isInitialized && sessionToken && !recommendations && !hasFetched && !isLoading) {
      setHasFetched(true);
      fetchRecommendations().catch(() => {
        toast.error('Failed to get recommendations. Please try again.');
      });
    }
  }, [isInitialized, sessionToken, recommendations, hasFetched, isLoading, fetchRecommendations]);

  // Redirect if no session (only after initialized)
  useEffect(() => {
    if (isInitialized && !sessionToken && !isLoading) {
      router.push('/onboarding');
    }
  }, [isInitialized, sessionToken, isLoading, router]);

  const handleSelectJob = async (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleContinue = async () => {
    if (!selectedJobId) {
      toast.error('Please select a career path to continue');
      return;
    }

    setIsSelecting(true);
    clearError();

    try {
      await selectJobForPathway(selectedJobId);
      router.push('/onboarding/select');
    } catch {
      toast.error(error?.message || 'Failed to select job. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  // Show loading state while initializing or fetching
  if (!isInitialized || (isLoading && !recommendations)) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto mb-12">
          <OnboardingProgress steps={ONBOARDING_STEPS} currentStep={2} />
        </div>
        <RecommendationsLoading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Progress indicator */}
      <div className="max-w-2xl mx-auto mb-12">
        <OnboardingProgress steps={ONBOARDING_STEPS} currentStep={2} />
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to start
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Your Career Matches
        </h1>
        <p className="text-lg text-muted-foreground">
          Based on your background and goals, we've identified these cybersecurity careers 
          that could be a great fit for you.
        </p>
      </div>

      {/* Overall analysis */}
      {overallAnalysis && (
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-slate-50 to-cyan-50/30 dark:from-slate-900 dark:to-cyan-950/30 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/40 shrink-0">
                  <Lightbulb className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    AI Analysis of Your Profile
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {overallAnalysis}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job recommendations */}
      <div className="max-w-4xl mx-auto">
        {recommendations && recommendations.length > 0 ? (
          <div className="grid gap-6">
            {recommendations.map((rec, index) => (
              <JobRecommendationCard
                key={rec.job.id}
                recommendation={rec}
                rank={index + 1}
                isSelected={selectedJobId === rec.job.id}
                onSelect={() => handleSelectJob(rec.job.id)}
                disabled={isSelecting}
              />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No recommendations found. Please try again with more details about your background.
            </p>
            <Button asChild variant="outline">
              <Link href="/onboarding">Update Your Profile</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        )}

        {/* Continue button */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedJobId || isSelecting}
              className="w-full md:w-auto min-w-[300px] h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25"
            >
              {isSelecting ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Continue with Selected Career'
              )}
            </Button>
            {!selectedJobId && (
              <p className="text-sm text-muted-foreground">
                Select a career path above to continue
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

