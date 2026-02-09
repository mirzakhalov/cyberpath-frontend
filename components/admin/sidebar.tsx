'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Brain,
  BookOpen,
  GraduationCap,
  BookMarked,
  Zap,
  Settings,
  ChevronDown,
  Users,
  Route,
  TrendingUp,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: (NavItem | NavGroup)[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Analytics',
    items: [
      { title: 'Students', href: '/admin/students', icon: Users },
      { title: 'Pathways', href: '/admin/pathways', icon: Route },
      { title: 'Progress', href: '/admin/progress', icon: TrendingUp },
      { title: 'AI Audit', href: '/admin/audit', icon: Bot },
    ],
  },
  {
    title: 'NICE Framework',
    items: [
      { title: 'Jobs', href: '/admin/jobs', icon: Briefcase },
      { title: 'TKSs', href: '/admin/tks', icon: Brain },
    ],
  },
  {
    title: 'Curriculum',
    items: [
      { title: 'Universities', href: '/admin/universities', icon: GraduationCap },
      { title: 'Courses', href: '/admin/courses', icon: BookMarked },
      { title: 'Topics', href: '/admin/topics', icon: BookOpen },
      { title: 'SkillBit Challenges', href: '/admin/skillbits', icon: Zap },
    ],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return 'items' in item;
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {item.title}
    </Link>
  );
}

function NavGroupComponent({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const isGroupActive = group.items.some((item) => pathname.startsWith(item.href));
  const [isOpen, setIsOpen] = useState(isGroupActive);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
        <span className="font-medium uppercase tracking-wider text-xs">
          {group.title}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-2">
        {group.items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Image src="/skillbit-owl.svg" alt="SkillBit" width={20} height={20} className="brightness-0 invert" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">CyberPath</span>
            <span className="text-xs text-sidebar-foreground/60">SkillBit Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-4 py-4">
          <div className="space-y-2">
            {navigation.map((item, index) => {
              if (isNavGroup(item)) {
                return <NavGroupComponent key={index} group={item} />;
              }
              return (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/50 text-center">
            SkillBit CyberPath v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}


