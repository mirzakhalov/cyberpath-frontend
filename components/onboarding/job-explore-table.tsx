'use client';

import { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { JobExploreItem, CareerDomain } from '@/types';

interface JobExploreTableProps {
  jobs: JobExploreItem[];
  onJobClick: (job: JobExploreItem) => void;
  isLoading?: boolean;
}

type SortField = 'title' | 'resume_match_score' | 'goal_match_score' | 'salary_max';
type SortDirection = 'asc' | 'desc';

function formatSalary(amount?: number): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBgColor(score: number): string {
  if (score >= 70) return 'bg-emerald-100 dark:bg-emerald-900/30';
  if (score >= 40) return 'bg-amber-100 dark:bg-amber-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
}

export function JobExploreTable({
  jobs,
  onJobClick,
  isLoading = false,
}: JobExploreTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('resume_match_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Extract unique career domains from jobs
  const careerDomains = useMemo(() => {
    const domains = new Map<string, CareerDomain>();
    jobs.forEach((job) => {
      if (job.career_domain) {
        domains.set(job.career_domain.id, job.career_domain);
      }
    });
    return Array.from(domains.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.career_domain?.name.toLowerCase().includes(query)
      );
    }

    // Filter by career domain
    if (selectedDomain !== 'all') {
      result = result.filter((job) => job.career_domain?.id === selectedDomain);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'resume_match_score':
          comparison = a.resume_match_score - b.resume_match_score;
          break;
        case 'goal_match_score':
          comparison = a.goal_match_score - b.goal_match_score;
          break;
        case 'salary_max':
          comparison = (a.salary_max || 0) - (b.salary_max || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [jobs, searchQuery, selectedDomain, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="border rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 border-b last:border-0 bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Career Domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Career Domains</SelectItem>
            {careerDomains.map((domain) => (
              <SelectItem key={domain.id} value={domain.id}>
                {domain.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredJobs.length} of {jobs.length} roles
      </p>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 -ml-3 font-medium"
                  onClick={() => handleSort('title')}
                >
                  Role
                  <SortIcon field="title" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Career Domain
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-medium"
                  onClick={() => handleSort('resume_match_score')}
                >
                  Resume Match
                  <SortIcon field="resume_match_score" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-medium"
                  onClick={() => handleSort('goal_match_score')}
                >
                  Goal Match
                  <SortIcon field="goal_match_score" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-medium"
                  onClick={() => handleSort('salary_max')}
                >
                  Salary Range
                  <SortIcon field="salary_max" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No jobs found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="cursor-pointer hover:bg-muted/70"
                  onClick={() => onJobClick(job)}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span>{job.title}</span>
                      <span className="text-xs text-muted-foreground md:hidden">
                        {job.career_domain?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {job.career_domain ? (
                      <Badge variant="secondary" className="font-normal">
                        {job.career_domain.code} - {job.career_domain.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div
                      className={cn(
                        'inline-flex items-center justify-center rounded-full px-2.5 py-1 text-sm font-semibold',
                        getScoreBgColor(job.resume_match_score),
                        getScoreColor(job.resume_match_score)
                      )}
                    >
                      {job.resume_match_score}%
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div
                      className={cn(
                        'inline-flex items-center justify-center rounded-full px-2.5 py-1 text-sm font-semibold',
                        getScoreBgColor(job.goal_match_score),
                        getScoreColor(job.goal_match_score)
                      )}
                    >
                      {job.goal_match_score}%
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-right">
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <DollarSign className="h-3 w-3 text-emerald-600" />
                      <span className="text-muted-foreground">
                        {formatSalary(job.salary_min)} -{' '}
                        {formatSalary(job.salary_max)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
