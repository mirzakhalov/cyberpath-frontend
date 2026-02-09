'use client';

import type { JobExploreItemWithSkills, SkillItem } from '@/types';

interface RoleMicroStoryProps {
  job: JobExploreItemWithSkills;
}

function pickTopSkill(skills: SkillItem[]) {
  return [...skills].sort((a, b) => b.importance - a.importance)[0];
}

function formatSkillName(name: string): string {
  return name.replace(/^Skill in /i, '').replace(/^Ability to /i, '').trim();
}

export function RoleMicroStory({ job }: RoleMicroStoryProps) {
  const skillsHave = job.skills.filter((skill) => skill.has);
  const skillsNeed = job.skills.filter((skill) => !skill.has);

  const topHave = pickTopSkill(skillsHave);
  const topNeed = pickTopSkill(skillsNeed);

  let story = 'Strong fit based on your current profile.';

  if (topHave && skillsNeed.length <= 2) {
    story = `You already have ${formatSkillName(topHave.name)} and you are only ${skillsNeed.length} skills away.`;
  } else if (topHave && topNeed) {
    story = `Your ${formatSkillName(topHave.name)} experience pairs well with ${formatSkillName(topNeed.name)} to reach this role.`;
  } else if (topHave) {
    story = `Your ${formatSkillName(topHave.name)} background maps well to this role.`;
  }

  return (
    <p className="text-sm text-muted-foreground mb-3">
      {story}
    </p>
  );
}
