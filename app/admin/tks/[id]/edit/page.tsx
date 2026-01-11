'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { TKSForm } from '@/components/forms/tks-form';
import { useTKS, useUpdateTKS } from '@/hooks/use-tks';
import { TKSSchemaType } from '@/lib/validations/tks';
import { toast } from 'sonner';

export default function EditTKSPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: tks, isLoading } = useTKS(id);
  const updateMutation = useUpdateTKS();

  const handleSubmit = async (data: TKSSchemaType) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('TKS updated successfully');
      router.push(`/admin/tks/${id}`);
    } catch (error) {
      toast.error('Failed to update TKS');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!tks) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">TKS not found</h2>
        <p className="text-muted-foreground mt-2">The requested TKS could not be found.</p>
        <Link href="/admin/tks">
          <Button className="mt-4">Back to TKSs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${tks.code}`}
        description="Update the TKS details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'TKSs', href: '/admin/tks' },
          { label: tks.code, href: `/admin/tks/${id}` },
          { label: 'Edit' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>TKS Details</CardTitle>
          <CardDescription>
            Update the details for this competency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TKSForm
            initialData={tks}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

