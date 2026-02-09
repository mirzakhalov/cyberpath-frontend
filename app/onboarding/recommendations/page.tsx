'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Compass, Target, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  OnboardingProgress,
  JobRecommendationCard,
  RecommendationsLoading,
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
    goalBasedRecs,
    skillBasedRecs,
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

  const hasRecommendations = (goalBasedRecs && goalBasedRecs.length > 0) ||
                             (skillBasedRecs && skillBasedRecs.length > 0) ||
                             (recommendations && recommendations.length > 0);

  // Show loading state while initializing or fetching
  if (!isInitialized || (isLoading && !hasRecommendations)) {
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
      <div className="max-w-5xl mx-auto mb-6">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to start
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Career Matches
        </h1>
        <p className="text-muted-foreground">
          We&apos;ve found careers that match your goals and leverage your skills. Select one to continue.
        </p>
      </div>

      {/* Overall analysis - more compact */}
      {overallAnalysis && (
        <div className="max-w-5xl mx-auto mb-6">
          <Card className="bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-slate-900 dark:to-orange-950/30 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {overallAnalysis}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job recommendations - Two sections */}
      <div className="max-w-5xl mx-auto">
        {hasRecommendations ? (
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
            <div className="space-y-8">
              {/* Goal-based recommendations */}
              {goalBasedRecs && goalBasedRecs.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                      <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Based on Your Goals</h2>
                      <p className="text-xs text-muted-foreground">Careers aligned with where you want to go</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {goalBasedRecs.map((rec) => (
                      <JobRecommendationCard
                        key={rec.job.id}
                        recommendation={rec}
                        isSelected={selectedJobId === rec.job.id}
                        onSelect={() => handleSelectJob(rec.job.id)}
                        disabled={isSelecting}
                        category="goal_based"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Skill-based recommendations */}
              {skillBasedRecs && skillBasedRecs.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                      <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Based on Your Skills</h2>
                      <p className="text-xs text-muted-foreground">Careers that leverage your existing experience</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {skillBasedRecs.map((rec) => (
                      <JobRecommendationCard
                        key={rec.job.id}
                        recommendation={rec}
                        isSelected={selectedJobId === rec.job.id}
                        onSelect={() => handleSelectJob(rec.job.id)}
                        disabled={isSelecting}
                        category="skill_based"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Fallback: Show flat list if categories not available */}
              {!goalBasedRecs?.length && !skillBasedRecs?.length && recommendations && (
                <div className="grid gap-4">
                  {recommendations.map((rec) => (
                    <JobRecommendationCard
                      key={rec.job.id}
                      recommendation={rec}
                      isSelected={selectedJobId === rec.job.id}
                      onSelect={() => handleSelectJob(rec.job.id)}
                      disabled={isSelecting}
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className="mt-8 lg:mt-0 lg:sticky lg:top-6 h-fit space-y-4">
              {/* Prominent Explore All Roles CTA */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shrink-0">
                        <Compass className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Want to explore more options?
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          See all cybersecurity roles with detailed skill matching
                        </p>
                      </div>
                    </div>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md"
                    >
                      <Link href="/onboarding/explore">
                        <Compass className="h-4 w-4 mr-2" />
                        Explore All Roles
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Continue button */}
              <Card className="border-slate-200/70 dark:border-slate-800/70">
                <CardContent className="p-5">
                  <div className="flex flex-col items-center gap-3">
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      disabled={!selectedJobId || isSelecting}
                      className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg"
                    >
                      {isSelecting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        'Continue with Selected Career'
                      )}
                    </Button>
                    {!selectedJobId && (
                      <p className="text-sm text-muted-foreground">
                        Select a career above to continue
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </aside>
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
        ) : null}
      </div>
    </div>
  );
}
