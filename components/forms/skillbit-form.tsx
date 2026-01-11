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
import { Textarea } from '@/components/ui/textarea';
import { skillbitSchema, SkillbitSchemaType } from '@/lib/validations/skillbit';
import { SkillBitChallenge } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface SkillBitFormProps {
  initialData?: SkillBitChallenge;
  defaultWeekId?: string;
  onSubmit: (data: SkillbitSchemaType) => Promise<void>;
  isLoading?: boolean;
}

export function SkillBitForm({ initialData, defaultWeekId, onSubmit, isLoading }: SkillBitFormProps) {
  const form = useForm<SkillbitSchemaType>({
    resolver: zodResolver(skillbitSchema),
    defaultValues: {
      course_week_id: initialData?.course_week_id ?? defaultWeekId ?? '',
      name: initialData?.name ?? '',
      external_id: initialData?.external_id ?? '',
      url: initialData?.url ?? '',
      description: initialData?.description ?? '',
    },
  });

  const handleSubmit = async (data: SkillbitSchemaType) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="course_week_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Week ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter course week ID" {...field} />
              </FormControl>
              <FormDescription>
                The ID of the course week this challenge is associated with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Challenge Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Network Packet Analysis Lab" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for this challenge
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="external_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., skillbit-123" {...field} />
                </FormControl>
                <FormDescription>
                  The ID from the external challenge platform
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://skillbit.io/challenge/..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The URL to access the challenge
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this challenge covers..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {initialData ? 'Update Challenge' : 'Create Challenge'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

