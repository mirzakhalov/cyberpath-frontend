'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader, PageLoader } from '@/components/shared';
import { useTopic, useDeleteTopic } from '@/hooks/use-topics';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Pencil, Trash2, Calendar, Brain, ArrowRight, ArrowLeft, BookMarked, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TKSCategory } from '@/types';

const categoryColors: Record<TKSCategory, string> = {
  task: 'bg-blue-100 text-blue-800',
  knowledge: 'bg-green-100 text-green-800',
  skill: 'bg-purple-100 text-purple-800',
};

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: topic, isLoading } = useTopic(id);
  const deleteMutation = useDeleteTopic();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Topic deleted successfully');
      router.push('/admin/topics');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Topic not found</h2>
        <p className="text-muted-foreground mt-2">The requested topic could not be found.</p>
        <Link href="/admin/topics">
          <Button className="mt-4">Back to Topics</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={topic.name}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Topics', href: '/admin/topics' },
          { label: topic.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/topics/${id}/edit`}>
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
                dangerouslySetInnerHTML={{ __html: topic.description }}
              />
            </CardContent>
          </Card>

          {/* TKSs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                TKSs Satisfied
              </CardTitle>
              <CardDescription>
                Competencies that this topic helps satisfy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topic.tks && topic.tks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topic.tks.map((tks) => (
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
                  No TKSs assigned to this topic yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Prerequisites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Prerequisites
              </CardTitle>
              <CardDescription>
                Topics that should be completed before this one
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topic.prerequisites && topic.prerequisites.length > 0 ? (
                <div className="space-y-2">
                  {topic.prerequisites.map((prereq) => (
                    <Link
                      key={prereq.id}
                      href={`/admin/topics/${prereq.id}`}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span>{prereq.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No prerequisites defined.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Prerequisite For */}
          {topic.prerequisite_for && topic.prerequisite_for.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Prerequisite For
                </CardTitle>
                <CardDescription>
                  Topics that require this topic as a prerequisite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topic.prerequisite_for.map((dependent) => (
                    <Link
                      key={dependent.id}
                      href={`/admin/topics/${dependent.id}`}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span>{dependent.name}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Weeks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Weeks
              </CardTitle>
              <CardDescription>
                Course weeks where this topic is taught
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topic.course_weeks && topic.course_weeks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Week</TableHead>
                      <TableHead>Title</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topic.course_weeks.map((cw) => (
                      <TableRow key={cw.id}>
                        <TableCell>
                          {cw.course ? (
                            <Link
                              href={`/admin/courses/${cw.course.id}`}
                              className="hover:text-primary"
                            >
                              {cw.course.course_code} - {cw.course.course_name}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          Week {cw.week_number}
                        </TableCell>
                        <TableCell>{cw.title}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Not used in any course week yet.
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
                <span className="font-medium">{topic.tks_count ?? topic.tks?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  <span>Prerequisites</span>
                </div>
                <span className="font-medium">{topic.prerequisite_count ?? topic.prerequisites?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <BookMarked className="h-4 w-4 text-muted-foreground" />
                  <span>Course Weeks</span>
                </div>
                <span className="font-medium">{topic.course_week_count ?? 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topic.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {topic.updated_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(topic.updated_at).toLocaleDateString()}</span>
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
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This action cannot be undone."
        itemName={topic.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

