'use client';

import { SkillProgressRing } from './skill-progress-ring';
import type { SkillItem } from '@/types';

interface MatchScoreOrbitProps {
  score: number;
  skills: SkillItem[];
  skillsHave: number;
  totalSkills: number;
  size?: number;
}

function normalizeScore(score: number) {
  if (score <= 1) return score;
  return Math.min(score / 100, 1);
}

function formatSkillName(name: string): string {
  return name.replace(/^Skill in /i, '').replace(/^Ability to /i, '').trim();
}

export function MatchScoreOrbit({
  score,
  skills,
  skillsHave,
  totalSkills,
  size = 90,
}: MatchScoreOrbitProps) {
  const normalizedScore = normalizeScore(score);
  const maxOrbitSkills = 5;
  const sortedSkills = [...skills]
    .filter((skill) => skill.has)
    .sort((a, b) => b.importance - a.importance);
  const orbitItems = sortedSkills.slice(0, maxOrbitSkills);

  const containerSize = size + 140;
  const orbitRadius = size / 2 + 46;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: containerSize, height: containerSize }}
    >
      <SkillProgressRing
        skillsHave={skillsHave}
        totalSkills={totalSkills}
        size={size}
        strokeWidth={7}
        showLabel={false}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">
            {Math.round(normalizedScore * 100)}%
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Match
          </p>
        </div>
      </div>
      <div className="absolute inset-0 motion-safe:animate-[orbit-spin_28s_linear_infinite]">
        {orbitItems.map((skill, index) => {
          const angle = (360 / orbitItems.length) * index - 90;
          return (
            <div
              key={skill.code}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${orbitRadius}px) rotate(${-angle}deg)`,
              }}
            >
              <div className="motion-safe:animate-[orbit-spin-reverse_28s_linear_infinite]">
                <span
                  className="inline-flex max-w-[160px] items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold leading-tight text-emerald-700 shadow-sm"
                >
                  <span className="text-center break-words">
                    {formatSkillName(skill.name)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
