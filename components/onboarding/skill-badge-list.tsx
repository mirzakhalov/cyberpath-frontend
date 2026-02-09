'use client';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { SkillItem } from '@/types';

interface SkillBadgeListProps {
  skills: SkillItem[];
  variant: 'have' | 'need';
  maxVisible?: number;
  className?: string;
}

function formatSkillName(name: string): string {
  // Remove "Skill in " / "Ability to " prefix and capitalize first letter
  let formatted = name
    .replace(/^Skill in /i, '')
    .replace(/^Ability to /i, '')
    .trim();

  // Capitalize first letter
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return formatted;
}

export function SkillBadgeList({
  skills,
  variant,
  maxVisible = 3,
  className,
}: SkillBadgeListProps) {
  const visibleSkills = skills.slice(0, maxVisible);
  const remainingCount = Math.max(0, skills.length - maxVisible);
  const hiddenSkills = skills.slice(maxVisible);

  const badgeStyles = {
    have: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    need: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };

  if (skills.length === 0) {
    return (
      <span className="text-xs text-muted-foreground italic">
        {variant === 'have' ? 'None yet' : 'All covered!'}
      </span>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn('flex flex-wrap gap-1.5', className)}>
        {visibleSkills.map((skill) => {
          const displayName = formatSkillName(skill.name);

          return (
            <Tooltip key={skill.code}>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs font-normal cursor-help',
                    badgeStyles[variant]
                  )}
                >
                  {displayName}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px]">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground mt-1">Code: {skill.code}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="text-xs font-normal bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 cursor-help"
              >
                +{remainingCount} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[350px]">
              <p className="text-xs font-medium mb-2">Additional skills:</p>
              <ul className="text-xs space-y-1">
                {hiddenSkills.slice(0, 10).map((skill) => (
                  <li key={skill.code} className="text-muted-foreground">
                    {formatSkillName(skill.name)}
                  </li>
                ))}
                {hiddenSkills.length > 10 && (
                  <li className="text-muted-foreground italic">
                    ...and {hiddenSkills.length - 10} more
                  </li>
                )}
              </ul>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
