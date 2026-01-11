'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageHeader, PageLoader } from '@/components/shared';
import { useTKS, useDeleteTKS } from '@/hooks/use-tks';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Pencil, Trash2, Calendar, Layers, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TKSCategory } from '@/types';

const categoryColors: Record<TKSCategory, string> = {
  task: 'bg-blue-100 text-blue-800',
  knowledge: 'bg-green-100 text-green-800',
  skill: 'bg-purple-100 text-purple-800',
};

const categoryLabels: Record<TKSCategory, string> = {
  task: 'Task',
  knowledge: 'Knowledge',
  skill: 'Skill',
};

export default function TKSDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: tks, isLoading } = useTKS(id);
  const deleteMutation = useDeleteTKS();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('TKS deleted successfully');
      router.push('/admin/tks');
    } catch (error) {
      toast.error('Failed to delete TKS');
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
        title={tks.code}
        description={tks.name}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'TKSs', href: '/admin/tks' },
          { label: tks.code },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/tks/${id}/edit`}>
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
              <div className="flex items-center justify-between">
                <CardTitle>Details</CardTitle>
                <Badge variant="secondary" className={categoryColors[tks.category]}>
                  {categoryLabels[tks.category]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Code</h4>
                  <p className="font-mono">{tks.code}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                  <p>{tks.name}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: tks.description }}
                  />
                </div>
              </div>
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
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span>Clusters</span>
                </div>
                <span className="font-medium">{tks.cluster_count ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Topics</span>
                </div>
                <span className="font-medium">{tks.topic_count ?? 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tks.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(tks.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {tks.updated_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(tks.updated_at).toLocaleDateString()}</span>
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
        title="Delete TKS"
        description="Are you sure you want to delete this TKS? This action cannot be undone."
        itemName={tks.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

