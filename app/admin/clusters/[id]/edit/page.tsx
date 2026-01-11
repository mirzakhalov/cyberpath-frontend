'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { ClusterForm } from '@/components/forms/cluster-form';
import { useCluster, useUpdateCluster } from '@/hooks/use-clusters';
import { ClusterSchemaType } from '@/lib/validations/cluster';
import { toast } from 'sonner';

export default function EditClusterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: cluster, isLoading } = useCluster(id);
  const updateMutation = useUpdateCluster();

  const handleSubmit = async (data: ClusterSchemaType) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Cluster updated successfully');
      router.push(`/admin/clusters/${id}`);
    } catch (error) {
      toast.error('Failed to update cluster');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!cluster) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Cluster not found</h2>
        <p className="text-muted-foreground mt-2">The requested cluster could not be found.</p>
        <Link href="/admin/clusters">
          <Button className="mt-4">Back to Clusters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${cluster.name}`}
        description="Update the cluster details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Clusters', href: '/admin/clusters' },
          { label: cluster.name, href: `/admin/clusters/${id}` },
          { label: 'Edit' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cluster Details</CardTitle>
          <CardDescription>
            Update the details for this cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClusterForm
            initialData={cluster}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

