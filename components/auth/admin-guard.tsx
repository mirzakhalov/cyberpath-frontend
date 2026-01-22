'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  age_verified: boolean;
  consent_given: boolean;
  created_at: string;
}

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component that checks if the current user is an admin.
 * If not an admin, redirects to the appropriate page.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    const checkAdminRole = async () => {
      try {
        const token = await getToken();
        
        if (!token) {
          router.replace('/sign-in');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user info');
          router.replace('/onboarding');
          return;
        }

        const data = await response.json();
        
        if (!data.success) {
          router.replace('/onboarding');
          return;
        }

        const user: AuthUser = data.data;

        if (user.role === 'admin') {
          setIsAuthorized(true);
        } else {
          // Not an admin, redirect to student flow
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.replace('/onboarding');
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminRole();
  }, [router, getToken, isLoaded, isSignedIn]);

  // Show loading state while checking authorization
  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

