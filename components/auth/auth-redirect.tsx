'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const SELECTED_JOB_KEY = 'cyberpath_selected_job';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  age_verified: boolean;
  consent_given: boolean;
  created_at: string;
  // Optional: if backend returns pathway info
  has_pathway?: boolean;
  pathway_id?: string;
}

/**
 * Client-side component that handles redirecting authenticated users
 * to the appropriate page based on their role and onboarding state.
 * 
 * Routing logic:
 * - Admin users → /admin/dashboard
 * - Students with existing pathway → /student/dashboard (or pathway view)
 * - Students with selected job (onboarding in progress) → /onboarding/generate
 * - Students without selected job → /onboarding (start fresh)
 */
export function AuthRedirect() {
  const router = useRouter();
  const { getToken, isLoaded } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const checkUserRoleAndRedirect = async () => {
      try {
        // Get auth token from Clerk
        const token = await getToken();
        
        if (!token) {
          // No token, redirect to sign in
          router.replace('/sign-in');
          return;
        }

        // Fetch user info from backend API
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // API error, default to onboarding
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
          // Admin users go to admin dashboard
          router.replace('/admin/dashboard');
          return;
        }

        // For students, check if they have an existing pathway
        // (If your /auth/me returns pathway info, use it here)
        if (user.has_pathway && user.pathway_id) {
          router.replace(`/pathway/${user.pathway_id}`);
          return;
        }

        // Check localStorage for onboarding in progress
        const selectedJob = localStorage.getItem(SELECTED_JOB_KEY);
        
        if (selectedJob) {
          // Student has a selected job, continue to pathway generation
          router.replace('/onboarding/generate');
        } else {
          // Try to fetch user's pathways from backend
          try {
            const pathwaysResponse = await fetch(`${API_BASE_URL}/pathways/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (pathwaysResponse.ok) {
              const pathwaysData = await pathwaysResponse.json();
              if (pathwaysData.success && pathwaysData.data?.length > 0) {
                // User has existing pathways, go to the most recent one
                const latestPathway = pathwaysData.data[0];
                router.replace(`/pathway/${latestPathway.id}`);
                return;
              }
            }
          } catch (e) {
            // Pathways endpoint might not exist, continue to onboarding
            console.log('Could not fetch pathways:', e);
          }
          
          // No pathway found, start onboarding
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        // On error, default to onboarding for students
        router.replace('/onboarding');
      } finally {
        setIsChecking(false);
      }
    };

    checkUserRoleAndRedirect();
  }, [router, getToken, isLoaded]);

  // Show a loading state while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-white/70 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}

