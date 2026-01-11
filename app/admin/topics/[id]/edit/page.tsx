'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { TopicForm } from '@/components/forms/topic-form';
import { useTopic, useUpdateTopic } from '@/hooks/use-topics';
import { TopicSchemaType } from '@/lib/validations/topic';
import { toast } from 'sonner';

export default function EditTopicPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: topic, isLoading } = useTopic(id);
  const updateMutation = useUpdateTopic();

  const handleSubmit = async (data: TopicSchemaType) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Topic updated successfully');
      router.push(`/admin/topics/${id}`);
    } catch (error) {
      toast.error('Failed to update topic');
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
        title={`Edit ${topic.name}`}
        description="Update the topic details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Topics', href: '/admin/topics' },
          { label: topic.name, href: `/admin/topics/${id}` },
          { label: 'Edit' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Topic Details</CardTitle>
          <CardDescription>
            Update the details for this topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopicForm
            initialData={topic}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

