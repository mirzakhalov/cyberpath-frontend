'use client';

import { cn } from '@/lib/utils';

interface SkillProgressRingProps {
  skillsHave: number;
  totalSkills: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function SkillProgressRing({
  skillsHave,
  totalSkills,
  size = 80,
  strokeWidth = 6,
  className,
  showLabel = true,
}: SkillProgressRingProps) {
  const percentage = totalSkills > 0 ? Math.round((skillsHave / totalSkills) * 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 70) return { stroke: '#10b981', text: 'text-emerald-600' }; // emerald-500
    if (pct >= 40) return { stroke: '#f59e0b', text: 'text-amber-600' }; // amber-500
    return { stroke: '#ef4444', text: 'text-red-500' }; // red-500
  };

  const colors = getColor(percentage);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center text */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-lg font-bold', colors.text)}>{percentage}%</span>
        </div>
      )}
    </div>
  );
}
