'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Search, BookOpen, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Animated loading messages for recommendations
const recommendationMessages = [
  { icon: Search, text: 'Analyzing your resume...' },
  { icon: Sparkles, text: 'Matching your skills to career paths...' },
  { icon: BookOpen, text: 'Finding personalized recommendations...' },
];

// Animated loading messages for pathway generation
const pathwayMessages = [
  { icon: Search, text: 'Analyzing your skills gap...' },
  { icon: BookOpen, text: 'Finding relevant courses...' },
  { icon: Cog, text: 'Building your personalized curriculum...' },
  { icon: Sparkles, text: 'Optimizing course sequence...' },
];

interface LoadingMessageProps {
  messages: { icon: React.ComponentType<{ className?: string }>; text: string }[];
  interval?: number;
  className?: string;
}

export function AnimatedLoadingMessage({
  messages,
  interval = 3000,
  className,
}: LoadingMessageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [messages.length, interval]);

  const CurrentIcon = messages[currentIndex].icon;

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      {/* Animated icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
          <CurrentIcon className="h-10 w-10 text-white animate-pulse" />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-lg font-medium text-foreground animate-pulse">
          {messages[currentIndex].text}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This may take a few moments
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {messages.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'bg-cyan-500 w-4'
                : index < currentIndex
                ? 'bg-cyan-500'
                : 'bg-slate-300 dark:bg-slate-600'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function RecommendationsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AnimatedLoadingMessage messages={recommendationMessages} />
    </div>
  );
}

export function PathwayGenerationLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AnimatedLoadingMessage messages={pathwayMessages} interval={4000} />
    </div>
  );
}

// Skeleton for job recommendation cards
export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

// Skeleton for pathway course cards
export function PathwayCourseCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}

