'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { JobForm } from '@/components/forms/job-form';
import { useJob, useUpdateJob } from '@/hooks/use-jobs';
import { JobSchemaType } from '@/lib/validations/job';
import { toast } from 'sonner';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: job, isLoading } = useJob(id);
  const updateMutation = useUpdateJob();

  const handleSubmit = async (data: JobSchemaType) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Job updated successfully');
      router.push(`/admin/jobs/${id}`);
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <p className="text-muted-foreground mt-2">The requested job could not be found.</p>
        <Link href="/admin/jobs">
          <Button className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${job.title}`}
        description="Update the job details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Jobs', href: '/admin/jobs' },
          { label: job.title, href: `/admin/jobs/${id}` },
          { label: 'Edit' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Update the details for this job role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm
            initialData={job}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

