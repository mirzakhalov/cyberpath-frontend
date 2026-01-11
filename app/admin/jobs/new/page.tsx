'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { JobForm } from '@/components/forms/job-form';
import { useCreateJob } from '@/hooks/use-jobs';
import { JobSchemaType } from '@/lib/validations/job';
import { toast } from 'sonner';

export default function NewJobPage() {
  const router = useRouter();
  const createMutation = useCreateJob();

  const handleSubmit = async (data: JobSchemaType) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Job created successfully');
      router.push('/admin/jobs');
    } catch (error) {
      toast.error('Failed to create job');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Job"
        description="Create a new cybersecurity job role"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Jobs', href: '/admin/jobs' },
          { label: 'New' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Enter the details for the new job role. Remember to select exactly 4 NICE clusters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}

