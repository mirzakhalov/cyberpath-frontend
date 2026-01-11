'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminHeader() {
  const { user, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        {/* Placeholder for breadcrumbs or page title - handled by individual pages */}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications placeholder */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User info */}
        <div className="flex items-center gap-3">
          {isLoaded ? (
            <>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user?.fullName || user?.emailAddresses[0]?.emailAddress}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9',
                  },
                }}
              />
            </>
          ) : (
            <>
              <div className="hidden md:block space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-9 w-9 rounded-full" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

