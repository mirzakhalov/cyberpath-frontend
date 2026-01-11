'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader, PageLoader } from '@/components/shared';
import { useCluster, useDeleteCluster } from '@/hooks/use-clusters';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Pencil, Trash2, Calendar, Briefcase, Brain } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TKSCategory } from '@/types';

const categoryColors: Record<TKSCategory, string> = {
  task: 'bg-blue-100 text-blue-800',
  knowledge: 'bg-green-100 text-green-800',
  skill: 'bg-purple-100 text-purple-800',
};

export default function ClusterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: cluster, isLoading } = useCluster(id);
  const deleteMutation = useDeleteCluster();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Cluster deleted successfully');
      router.push('/admin/clusters');
    } catch (error) {
      toast.error('Failed to delete cluster');
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
        title={cluster.name}
        description={cluster.code ? `Code: ${cluster.code}` : undefined}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Clusters', href: '/admin/clusters' },
          { label: cluster.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/clusters/${id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: cluster.description }}
              />
            </CardContent>
          </Card>

          {/* TKSs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                TKSs in this Cluster
              </CardTitle>
              <CardDescription>
                {cluster.tks?.length ?? 0} competencies assigned to this cluster
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cluster.tks && cluster.tks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cluster.tks.map((tks) => (
                      <TableRow key={tks.id}>
                        <TableCell>
                          <Link
                            href={`/admin/tks/${tks.id}`}
                            className="font-mono text-sm hover:text-primary"
                          >
                            {tks.code}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/tks/${tks.id}`}
                            className="hover:text-primary"
                          >
                            {tks.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={categoryColors[tks.category]}>
                            {tks.category}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No TKSs assigned to this cluster yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <span>TKSs</span>
                </div>
                <span className="font-medium">{cluster.tks_count ?? cluster.tks?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Jobs</span>
                </div>
                <span className="font-medium">{cluster.job_count ?? 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cluster.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(cluster.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {cluster.updated_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(cluster.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Cluster"
        description="Are you sure you want to delete this cluster? This action cannot be undone."
        itemName={cluster.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

