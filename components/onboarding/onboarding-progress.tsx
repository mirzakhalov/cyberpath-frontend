'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  description?: string;
}

interface OnboardingProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function OnboardingProgress({
  steps,
  currentStep,
  className,
}: OnboardingProgressProps) {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              'flex items-center',
              stepIdx !== steps.length - 1 ? 'flex-1' : ''
            )}
          >
            {/* Step circle and label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  step.id < currentStep
                    ? 'border-cyan-500 bg-cyan-500'
                    : step.id === currentStep
                    ? 'border-cyan-500 bg-white dark:bg-slate-900'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                )}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      step.id === currentStep
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-xs font-medium',
                    step.id <= currentStep
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </p>
              </div>
            </div>

            {/* Connecting line */}
            {stepIdx !== steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    'h-0.5 w-full transition-all duration-500',
                    step.id < currentStep
                      ? 'bg-cyan-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Compact mobile version
export function OnboardingProgressMobile({
  steps,
  currentStep,
  className,
}: OnboardingProgressProps) {
  const currentStepData = steps.find((s) => s.id === currentStep);
  
  return (
    <div className={cn('w-full', className)}>
      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-medium text-foreground">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm text-muted-foreground">
          {currentStepData?.name}
        </span>
      </div>
    </div>
  );
}

