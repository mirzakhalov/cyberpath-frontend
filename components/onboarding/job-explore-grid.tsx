'use client';

import { JobExploreCard } from './job-explore-card';
import type { JobExploreItemWithSkills } from '@/types';

interface JobExploreGridProps {
  jobs: JobExploreItemWithSkills[];
  onSelectJob: (jobId: string) => void;
  onToggleCompare?: (jobId: string) => void;
  isSelecting?: boolean;
  compareIds?: string[];
  showMatchOrbit?: boolean;
  showMicroStory?: boolean;
}

export function JobExploreGrid({
  jobs,
  onSelectJob,
  onToggleCompare,
  isSelecting = false,
  compareIds = [],
  showMatchOrbit = true,
  showMicroStory = true,
}: JobExploreGridProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No matching jobs found. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {jobs.map((job, index) => (
        <JobExploreCard
          key={job.id}
          job={job}
          rank={index + 1}
          onSelect={onSelectJob}
          onToggleCompare={onToggleCompare}
          isSelecting={isSelecting}
          isCompared={compareIds.includes(job.id)}
          showMatchOrbit={showMatchOrbit}
          showMicroStory={showMicroStory}
        />
      ))}
    </div>
  );
}

export function JobExploreGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border rounded-lg p-5 space-y-4 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="h-8 w-8 bg-muted rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
          <div className="flex justify-center py-4">
            <div className="h-20 w-20 bg-muted rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="flex gap-1.5">
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-5 w-20 bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="flex gap-1.5">
              <div className="h-5 w-18 bg-muted rounded" />
              <div className="h-5 w-14 bg-muted rounded" />
            </div>
          </div>
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
