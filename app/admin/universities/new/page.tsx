'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { UniversityForm } from '@/components/forms/university-form';
import { useCreateUniversity } from '@/hooks/use-universities';
import { UniversitySchemaType } from '@/lib/validations/university';
import { toast } from 'sonner';

export default function NewUniversityPage() {
  const router = useRouter();
  const createMutation = useCreateUniversity();

  const handleSubmit = async (data: UniversitySchemaType) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('University created successfully');
      router.push('/admin/universities');
    } catch (error) {
      toast.error('Failed to create university');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New University"
        description="Add a new partner institution"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Universities', href: '/admin/universities' },
          { label: 'New' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>University Details</CardTitle>
          <CardDescription>
            Enter the details for the new partner university
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UniversityForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}

