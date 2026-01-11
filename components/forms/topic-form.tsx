'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { MultiSelect } from '@/components/ui/multi-select';
import { topicSchema, TopicSchemaType } from '@/lib/validations/topic';
import { Topic } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useTKSList } from '@/hooks/use-tks';
import { useTopics } from '@/hooks/use-topics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface TopicFormProps {
  initialData?: Topic;
  onSubmit: (data: TopicSchemaType) => Promise<void>;
  isLoading?: boolean;
}

export function TopicForm({ initialData, onSubmit, isLoading }: TopicFormProps) {
  const { data: tksData, isLoading: tksLoading } = useTKSList({ page_size: 1000 });
  const { data: topicsData, isLoading: topicsLoading } = useTopics({ page_size: 1000 });

  const form = useForm<TopicSchemaType>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      tks_ids: initialData?.tks?.map((t) => t.id) ?? [],
      prerequisite_ids: initialData?.prerequisites?.map((p) => p.id) ?? [],
    },
  });

  const handleSubmit = async (data: TopicSchemaType) => {
    await onSubmit(data);
  };

  const tksOptions = (tksData?.data ?? []).map((tks) => ({
    value: tks.id,
    label: `${tks.code} - ${tks.name}`,
    description: tks.category.charAt(0).toUpperCase() + tks.category.slice(1),
  }));

  // Filter out the current topic from prerequisites to prevent self-reference
  const prerequisiteOptions = (topicsData?.data ?? [])
    .filter((topic) => topic.id !== initialData?.id)
    .map((topic) => ({
      value: topic.id,
      label: topic.name,
    }));

  const selectedPrerequisites = form.watch('prerequisite_ids');
  const hasCircularDependency = initialData?.prerequisite_for?.some(
    (topic) => selectedPrerequisites.includes(topic.id)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Network Security Fundamentals" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for this educational topic
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe what this topic covers..."
                />
              </FormControl>
              <FormDescription>
                A detailed description of the topic content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tks_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TKSs Satisfied</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tksOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder={tksLoading ? 'Loading TKSs...' : 'Select TKSs this topic satisfies...'}
                  searchPlaceholder="Search TKSs..."
                  emptyMessage="No TKSs found."
                  disabled={tksLoading}
                />
              </FormControl>
              <FormDescription>
                Select the competencies that learning this topic will help satisfy
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prerequisite_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prerequisites</FormLabel>
              <FormControl>
                <MultiSelect
                  options={prerequisiteOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder={topicsLoading ? 'Loading topics...' : 'Select prerequisite topics...'}
                  searchPlaceholder="Search topics..."
                  emptyMessage="No topics found."
                  disabled={topicsLoading}
                />
              </FormControl>
              <FormDescription>
                Select topics that should be completed before this one
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasCircularDependency && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: Some selected prerequisites depend on this topic, which would create a circular dependency.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || hasCircularDependency}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {initialData ? 'Update Topic' : 'Create Topic'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

