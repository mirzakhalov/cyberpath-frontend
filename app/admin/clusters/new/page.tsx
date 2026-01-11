'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { ClusterForm } from '@/components/forms/cluster-form';
import { useCreateCluster } from '@/hooks/use-clusters';
import { ClusterSchemaType } from '@/lib/validations/cluster';
import { toast } from 'sonner';

export default function NewClusterPage() {
  const router = useRouter();
  const createMutation = useCreateCluster();

  const handleSubmit = async (data: ClusterSchemaType) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Cluster created successfully');
      router.push('/admin/clusters');
    } catch (error) {
      toast.error('Failed to create cluster');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Cluster"
        description="Create a new NICE competency cluster"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Clusters', href: '/admin/clusters' },
          { label: 'New' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cluster Details</CardTitle>
          <CardDescription>
            Enter the details for the new competency cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClusterForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}

