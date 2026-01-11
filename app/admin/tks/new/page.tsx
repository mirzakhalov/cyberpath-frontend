'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { TKSForm } from '@/components/forms/tks-form';
import { useCreateTKS } from '@/hooks/use-tks';
import { TKSSchemaType } from '@/lib/validations/tks';
import { toast } from 'sonner';

export default function NewTKSPage() {
  const router = useRouter();
  const createMutation = useCreateTKS();

  const handleSubmit = async (data: TKSSchemaType) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('TKS created successfully');
      router.push('/admin/tks');
    } catch (error) {
      toast.error('Failed to create TKS');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New TKS"
        description="Create a new Task, Knowledge, or Skill"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'TKSs', href: '/admin/tks' },
          { label: 'New' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>TKS Details</CardTitle>
          <CardDescription>
            Enter the details for the new competency from the NICE Framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TKSForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}

