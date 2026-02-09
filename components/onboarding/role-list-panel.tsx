'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExploreFilterChips } from './explore-filter-chips';
import { RoleListItem, RoleListItemSkeleton } from './role-list-item';
import type { QuickFilterId } from './explore-filter-chips';
import type { JobExploreItemWithSkills } from '@/types';

// ── Props ─────────────────────────────────────────────────────────────
export type SortOption = 'readiness' | 'match' | 'salary';

interface RoleListPanelProps {
  jobs: JobExploreItemWithSkills[];
  allJobs: JobExploreItemWithSkills[];
  selectedJobId: string | null;
  onSelectRole: (jobId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeDomain: string | null;
  onDomainChange: (domain: string | null) => void;
  activeQuickFilter: QuickFilterId | null;
  onQuickFilterChange: (filter: QuickFilterId | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  compareIds: string[];
  onToggleCompare: (jobId: string) => void;
  isLoading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────
export function RoleListPanel({
  jobs,
  allJobs,
  selectedJobId,
  onSelectRole,
  searchQuery,
  onSearchChange,
  activeDomain,
  onDomainChange,
  activeQuickFilter,
  onQuickFilterChange,
  sortBy,
  onSortChange,
  compareIds,
  onToggleCompare,
  isLoading = false,
}: RoleListPanelProps) {
  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      {allJobs.length > 0 && (
        <ExploreFilterChips
          jobs={allJobs}
          activeDomain={activeDomain}
          activeQuickFilter={activeQuickFilter}
          onDomainChange={onDomainChange}
          onQuickFilterChange={onQuickFilterChange}
        />
      )}

      {/* Sort + count row */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground shrink-0">
          {jobs.length} role{jobs.length !== 1 ? 's' : ''}
        </p>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="readiness">Sort: Readiness</SelectItem>
            <SelectItem value="match">Sort: Best Match</SelectItem>
            <SelectItem value="salary">Sort: Highest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scrollable role list */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <RoleListItemSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No roles match your search. Try different filters.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-420px)] min-h-[300px]">
          <div className="space-y-2 pr-2">
            {jobs.map((job) => (
              <RoleListItem
                key={job.id}
                job={job}
                isSelected={selectedJobId === job.id}
                isCompared={compareIds.includes(job.id)}
                onClick={() => onSelectRole(job.id)}
                onToggleCompare={() => onToggleCompare(job.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
