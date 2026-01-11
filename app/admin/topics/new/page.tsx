'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { TopicForm } from '@/components/forms/topic-form';
import { useCreateTopic } from '@/hooks/use-topics';
import { TopicSchemaType } from '@/lib/validations/topic';
import { toast } from 'sonner';

export default function NewTopicPage() {
  const router = useRouter();
  const createMutation = useCreateTopic();

  const handleSubmit = async (data: TopicSchemaType) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Topic created successfully');
      router.push('/admin/topics');
    } catch (error) {
      toast.error('Failed to create topic');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Topic"
        description="Create a new educational topic"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Topics', href: '/admin/topics' },
          { label: 'New' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Topic Details</CardTitle>
          <CardDescription>
            Enter the details for the new educational topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopicForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}

