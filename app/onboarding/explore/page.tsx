'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Compass, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  OnboardingProgress,
  RoleListPanel,
  RoleDetailPanel,
  RoleCompareRail,
  RoleListItemSkeleton,
} from '@/components/onboarding';
import { getReadinessTier, normalizeScore } from '@/components/onboarding/role-list-item';
import type { SortOption } from '@/components/onboarding/role-list-panel';
import type { QuickFilterId } from '@/components/onboarding';
import { useOnboarding, useJobExplore } from '@/hooks';
import { toast } from 'sonner';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Upload Resume' },
  { id: 2, name: 'Job Matches' },
  { id: 3, name: 'Select Career' },
  { id: 4, name: 'Create Account' },
  { id: 5, name: 'Your Pathway' },
];

const TIER_ORDER = { ready: 0, short: 1, growth: 2 } as const;

export default function ExplorePage() {
  const router = useRouter();
  const {
    sessionToken,
    desiredJob,
    selectJobForPathway,
    isLoading: onboardingLoading,
    isInitialized,
  } = useOnboarding();

  const {
    jobs,
    totalJobs,
    selectedJobPreview,
    isLoading: exploreLoading,
    isPreviewLoading,
    error,
    fetchTopJobScores,
    fetchJobPreview,
    clearPreview,
    clearError,
  } = useJobExplore();

  // ── Local state ─────────────────────────────────────────────────────
  const [hasFetched, setHasFetched] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('readiness');
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterId | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const hasAutoSelected = useRef(false);

  // ── Mobile detection ────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Filtering ───────────────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    let filtered = [...jobs];

    // Domain filter
    if (activeDomain) {
      filtered = filtered.filter((job) => job.career_domain?.name === activeDomain);
    }

    // Quick filters
    if (activeQuickFilter === 'best-match') {
      filtered = filtered.filter((job) => normalizeScore(job.combined_score) >= 0.8);
    }
    if (activeQuickFilter === 'low-gap') {
      filtered = filtered.filter((job) => job.skills_need_count <= 2);
    }
    if (activeQuickFilter === 'high-coverage') {
      filtered = filtered.filter(
        (job) => job.skills_have_count / Math.max(job.total_skills, 1) >= 0.8
      );
    }

    return filtered;
  }, [jobs, activeDomain, activeQuickFilter]);

  // ── Search + Sort ───────────────────────────────────────────────────
  const sortedFilteredJobs = useMemo(() => {
    let result = [...filteredJobs];

    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((j) => j.title.toLowerCase().includes(q));
    }

    // Sort
    switch (sortBy) {
      case 'readiness':
        result.sort((a, b) => {
          const tierDiff =
            TIER_ORDER[getReadinessTier(a)] - TIER_ORDER[getReadinessTier(b)];
          if (tierDiff !== 0) return tierDiff;
          return normalizeScore(b.combined_score) - normalizeScore(a.combined_score);
        });
        break;
      case 'match':
        result.sort(
          (a, b) => normalizeScore(b.combined_score) - normalizeScore(a.combined_score)
        );
        break;
      case 'salary':
        result.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
        break;
    }

    return result;
  }, [filteredJobs, searchQuery, sortBy]);

  // ── Fetch jobs on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (isInitialized && sessionToken && desiredJob && !hasFetched && !exploreLoading) {
      setHasFetched(true);
      fetchTopJobScores(sessionToken, desiredJob, undefined, 10).catch(() => {
        toast.error('Failed to load jobs. Please try again.');
      });
    }
  }, [isInitialized, sessionToken, desiredJob, hasFetched, exploreLoading, fetchTopJobScores]);

  // Redirect if no session
  useEffect(() => {
    if (isInitialized && !sessionToken && !onboardingLoading) {
      router.push('/onboarding');
    }
  }, [isInitialized, sessionToken, onboardingLoading, router]);

  // ── Auto-select first role ──────────────────────────────────────────
  useEffect(() => {
    if (sortedFilteredJobs.length > 0 && !hasAutoSelected.current) {
      hasAutoSelected.current = true;
      handleSelectRole(sortedFilteredJobs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedFilteredJobs]);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleSelectRole = useCallback(
    (jobId: string) => {
      setSelectedJobId(jobId);
      clearPreview();
      fetchJobPreview(jobId, sessionToken).catch(() => {
        // Preview loading failed - non-critical, skills tab still works
      });
    },
    [fetchJobPreview, clearPreview, sessionToken]
  );

  const handleSelectJob = async (jobId: string) => {
    setIsSelecting(true);
    clearError();

    try {
      await selectJobForPathway(jobId);
      toast.success('Career path selected!');
      router.push('/onboarding/select');
    } catch {
      toast.error('Failed to select job. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  const handleToggleCompare = (jobId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      if (prev.length >= 3) {
        toast.error('Compare up to 3 roles at a time');
        return prev;
      }
      return [...prev, jobId];
    });
  };

  // Find the selected job summary from list data
  const selectedJobSummary = useMemo(
    () => jobs?.find((j) => j.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  // ── Loading state ───────────────────────────────────────────────────
  if (!isInitialized || (exploreLoading && !jobs)) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto mb-12">
          <OnboardingProgress steps={ONBOARDING_STEPS} currentStep={2} />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-8" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[380px] space-y-2">
              {[...Array(6)].map((_, i) => (
                <RoleListItemSkeleton key={i} />
              ))}
            </div>
            <div className="hidden lg:block flex-1">
              <div className="h-[500px] bg-muted/30 animate-pulse rounded-xl border border-dashed border-slate-200" />
            </div>
          </div>
        </div>
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
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          href="/onboarding/recommendations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to recommendations
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Top {totalJobs} Career Matches
            </h1>
            <p className="text-sm text-muted-foreground">
              Based on your skills and goals
            </p>
          </div>
        </div>

        <p className="text-muted-foreground max-w-2xl">
          These are your best-matched cybersecurity career paths based on your resume skills
          and stated goals. Select a role to see detailed skill breakdown and gap analysis.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Goals card */}
      {desiredJob && (
        <div className="max-w-6xl mx-auto mb-6">
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Your stated goals:</span>{' '}
                &ldquo;{desiredJob.length > 150 ? `${desiredJob.slice(0, 150)}...` : desiredJob}&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Master-Detail Layout ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto">
        {jobs && jobs.length > 0 ? (
          <>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Role list panel */}
              <div className="w-full lg:w-[380px] lg:shrink-0">
                <RoleListPanel
                  jobs={sortedFilteredJobs}
                  allJobs={jobs}
                  selectedJobId={selectedJobId}
                  onSelectRole={handleSelectRole}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeDomain={activeDomain}
                  onDomainChange={setActiveDomain}
                  activeQuickFilter={activeQuickFilter}
                  onQuickFilterChange={setActiveQuickFilter}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  compareIds={compareIds}
                  onToggleCompare={handleToggleCompare}
                  isLoading={exploreLoading && !jobs}
                />
              </div>

              {/* Right: Detail panel (desktop) */}
              <div className="hidden lg:block flex-1 min-w-0">
                <RoleDetailPanel
                  jobSummary={selectedJobSummary}
                  preview={selectedJobPreview}
                  isLoading={isPreviewLoading}
                  onSelectRole={handleSelectJob}
                  isSelecting={isSelecting}
                />
              </div>

              {/* Right: Detail panel (mobile - Sheet) */}
              {isMobile && (
                <Sheet
                  open={!!selectedJobId}
                  onOpenChange={(open) => {
                    if (!open) setSelectedJobId(null);
                  }}
                >
                  <SheetContent
                    side="right"
                    className="w-full sm:max-w-lg p-0 overflow-y-auto"
                  >
                    <SheetTitle className="sr-only">Role Details</SheetTitle>
                    <div className="pt-10">
                      <RoleDetailPanel
                        jobSummary={selectedJobSummary}
                        preview={selectedJobPreview}
                        isLoading={isPreviewLoading}
                        onSelectRole={handleSelectJob}
                        isSelecting={isSelecting}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>

            {/* Compare rail */}
            <RoleCompareRail
              jobs={jobs}
              selectedIds={compareIds}
              onRemove={(id) =>
                setCompareIds((prev) => prev.filter((compareId) => compareId !== id))
              }
              onClear={() => setCompareIds([])}
            />
          </>
        ) : !exploreLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No jobs found. Please try again.
            </p>
            <Button asChild variant="outline">
              <Link href="/onboarding">Start Over</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
