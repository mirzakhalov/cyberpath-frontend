'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { useSkillBit, useDeleteSkillBit } from '@/hooks/use-skillbits';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Pencil, Trash2, Calendar, ExternalLink, Hash, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SkillBitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: skillbit, isLoading } = useSkillBit(id);
  const deleteMutation = useDeleteSkillBit();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('SkillBit challenge deleted successfully');
      router.push('/admin/skillbits');
    } catch (error) {
      toast.error('Failed to delete SkillBit challenge');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!skillbit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Challenge not found</h2>
        <p className="text-muted-foreground mt-2">The requested SkillBit challenge could not be found.</p>
        <Link href="/admin/skillbits">
          <Button className="mt-4">Back to Challenges</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={skillbit.name}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'SkillBit Challenges', href: '/admin/skillbits' },
          { label: skillbit.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/skillbits/${id}/edit`}>
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
          {skillbit.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{skillbit.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Challenge Link</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={skillbit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                {skillbit.url}
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">External ID:</span>
                <span className="font-mono">{skillbit.external_id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Week ID:</span>
                <span className="font-mono text-xs">{skillbit.course_week_id}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillbit.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(skillbit.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {skillbit.updated_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(skillbit.updated_at).toLocaleDateString()}</span>
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
        title="Delete SkillBit Challenge"
        description="Are you sure you want to delete this challenge?"
        itemName={skillbit.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

