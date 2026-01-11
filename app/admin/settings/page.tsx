'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Database, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not configured';

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Platform configuration and information"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Backend API connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">API URL</p>
              <p className="font-mono text-sm mt-1 break-all">{apiUrl}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="secondary" className="mt-1">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              Authentication provider settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Provider</p>
              <p className="mt-1">Clerk</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="secondary" className="mt-1">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Platform Information
            </CardTitle>
            <CardDescription>
              Version and build information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="mt-1">1.0.0</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Framework</p>
              <p className="mt-1">Next.js 14</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Environment</p>
              <Badge variant="outline" className="mt-1">
                {process.env.NODE_ENV}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Links
            </CardTitle>
            <CardDescription>
              Useful resources and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/BACKEND_API_DOCUMENTATION.md"
              target="_blank"
              className="block text-sm text-primary hover:underline"
            >
              API Documentation →
            </a>
            <a
              href="https://niccs.cisa.gov/workforce-development/nice-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:underline"
            >
              NICE Framework Reference →
            </a>
            <a
              href="https://clerk.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:underline"
            >
              Clerk Documentation →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

