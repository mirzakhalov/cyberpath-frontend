'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SkillBitLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-10 w-10',
};

const containerMap = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

export function SkillBitLogo({ size = 'md', className }: SkillBitLogoProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600',
        containerMap[size],
        className
      )}
    >
      <Image
        src="/skillbit-owl.svg"
        alt="SkillBit"
        width={28}
        height={28}
        className={cn(sizeMap[size], 'brightness-0 invert')}
      />
    </div>
  );
}

export function SkillBitLogoInline({ className }: { className?: string }) {
  return (
    <Image
      src="/skillbit-owl.svg"
      alt="SkillBit"
      width={20}
      height={20}
      className={cn('h-4 w-4', className)}
    />
  );
}
