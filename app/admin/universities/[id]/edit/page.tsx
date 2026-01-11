'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { UniversityForm } from '@/components/forms/university-form';
import { useUniversity, useUpdateUniversity } from '@/hooks/use-universities';
import { UniversitySchemaType } from '@/lib/validations/university';
import { toast } from 'sonner';

export default function EditUniversityPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: university, isLoading } = useUniversity(id);
  const updateMutation = useUpdateUniversity();

  const handleSubmit = async (data: UniversitySchemaType) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('University updated successfully');
      router.push(`/admin/universities/${id}`);
    } catch (error) {
      toast.error('Failed to update university');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!university) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">University not found</h2>
        <p className="text-muted-foreground mt-2">The requested university could not be found.</p>
        <Link href="/admin/universities">
          <Button className="mt-4">Back to Universities</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${university.name}`}
        description="Update the university details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Universities', href: '/admin/universities' },
          { label: university.name, href: `/admin/universities/${id}` },
          { label: 'Edit' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>University Details</CardTitle>
          <CardDescription>
            Update the details for this university
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UniversityForm
            initialData={university}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

