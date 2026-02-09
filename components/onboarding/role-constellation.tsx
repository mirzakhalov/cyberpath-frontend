'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { JobExploreItemWithSkills } from '@/types';

const clusterPalette = [
  'bg-cyan-500/15 text-cyan-700 border-cyan-200',
  'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  'bg-amber-500/15 text-amber-700 border-amber-200',
  'bg-blue-500/15 text-blue-700 border-blue-200',
  'bg-rose-500/15 text-rose-700 border-rose-200',
  'bg-violet-500/15 text-violet-700 border-violet-200',
];

interface RoleConstellationProps {
  jobs: JobExploreItemWithSkills[];
  activeJobId?: string | null;
  onSelect?: (jobId: string) => void;
  maxPerDomain?: number;
}

function normalizeScore(score: number) {
  if (score <= 1) return score;
  return Math.min(score / 100, 1);
}

export function RoleConstellation({
  jobs,
  activeJobId,
  onSelect,
  maxPerDomain = 7,
}: RoleConstellationProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, JobExploreItemWithSkills[]>();
    jobs.forEach((job) => {
      const key = job.career_domain?.name || 'Other';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(job);
    });

    return Array.from(map.entries()).map(([domain, items]) => ({
      domain,
      items: [...items]
        .sort((a, b) => b.combined_score - a.combined_score)
        .slice(0, maxPerDomain),
    }));
  }, [jobs, maxPerDomain]);

  if (grouped.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {grouped.map((group, groupIndex) => {
        const [center, ...satellites] = group.items;
        const palette = clusterPalette[groupIndex % clusterPalette.length];
        const ringSize = 6;
        return (
          <div key={group.domain} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">{group.domain}</p>
              <span className="text-xs text-muted-foreground">
                {group.items.length} roles
              </span>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[240px]">
              {center && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onSelect?.(center.id)}
                      className={cn(
                        'absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border text-xs font-semibold shadow-sm transition-transform hover:scale-105',
                        palette,
                        activeJobId === center.id && 'ring-2 ring-cyan-500'
                      )}
                      style={{
                        width: 76,
                        height: 76,
                        transform: 'translate(-50%, -50%)',
                      }}
                      aria-label={`Select ${center.title}`}
                    >
                      {center.title.split(' ').slice(0, 2).join(' ')}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-semibold">{center.title}</p>
                    <p className="text-[10px] text-background/70">
                      {Math.round(normalizeScore(center.combined_score) * 100)}% match
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {satellites.map((job, index) => {
                const ring = Math.floor(index / ringSize);
                const ringIndex = index % ringSize;
                const ringCount = Math.min(ringSize, satellites.length - ring * ringSize);
                const angle = (360 / ringCount) * ringIndex - 90;
                const radius = 70 + ring * 34;
                const size = 40 + Math.round(normalizeScore(job.combined_score) * 16);

                return (
                  <Tooltip key={job.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onSelect?.(job.id)}
                        className={cn(
                          'absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border text-[10px] font-semibold shadow-sm transition-transform hover:scale-105',
                          palette,
                          activeJobId === job.id && 'ring-2 ring-cyan-500'
                        )}
                        style={{
                          width: size,
                          height: size,
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
                        }}
                        aria-label={`Select ${job.title}`}
                      >
                        {job.title.split(' ').slice(0, 2).join(' ')}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-[10px] text-background/70">
                        {Math.round(normalizeScore(job.combined_score) * 100)}% match
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
