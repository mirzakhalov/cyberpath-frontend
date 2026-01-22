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
import { useJob, useDeleteJob } from '@/hooks/use-jobs';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Pencil, Trash2, Calendar, Layers, DollarSign, Brain } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TKSCategory } from '@/types';

const categoryColors: Record<TKSCategory, string> = {
  task: 'bg-blue-100 text-blue-800',
  knowledge: 'bg-green-100 text-green-800',
  skill: 'bg-purple-100 text-purple-800',
};

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Not specified';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return 'Not specified';
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: job, isLoading } = useJob(id, true);
  const deleteMutation = useDeleteJob();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Job deleted successfully');
      router.push('/admin/jobs');
    } catch (error) {
      toast.error('Failed to delete job');
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
        title={job.title}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Jobs', href: '/admin/jobs' },
          { label: job.title },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/jobs/${id}/edit`}>
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
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </CardContent>
          </Card>

          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Salary Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-semibold">
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {job.updated_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(job.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Required TKSs - Full Width */}
      {job.required_tks && job.required_tks.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Linked TKSs
            </CardTitle>
            <CardDescription>
              {job.required_tks.length} competencies linked to this job
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px]">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.required_tks.map((tks) => (
                    <TableRow key={tks.id}>
                      <TableCell className="whitespace-nowrap">
                        <Link
                          href={`/admin/tks/${tks.id}`}
                          className="font-mono text-sm hover:text-primary"
                        >
                          {tks.code}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-0">
                        <Link
                          href={`/admin/tks/${tks.id}`}
                          className="hover:text-primary block truncate"
                          title={tks.name}
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
            </div>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        itemName={job.title}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

