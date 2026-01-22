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
import { clusterSchema, ClusterSchemaType } from '@/lib/validations/cluster';
import { Cluster } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useTKSList } from '@/hooks/use-tks';

interface ClusterFormProps {
  initialData?: Cluster;
  onSubmit: (data: ClusterSchemaType) => Promise<void>;
  isLoading?: boolean;
}

export function ClusterForm({ initialData, onSubmit, isLoading }: ClusterFormProps) {
  const { data: tksData, isLoading: tksLoading } = useTKSList({ page_size: 1000 });

  const form = useForm<ClusterSchemaType>({
    resolver: zodResolver(clusterSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      code: initialData?.code ?? '',
      tks_ids: initialData?.tks?.map((t) => t.id) ?? [],
    },
  });

  const handleSubmit = async (data: ClusterSchemaType) => {
    await onSubmit(data);
  };

  const tksOptions = (tksData?.data ?? []).map((tks) => ({
    value: tks.id,
    label: `${tks.code} - ${tks.name}`,
    description: tks.category.charAt(0).toUpperCase() + tks.category.slice(1),
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Analyze" {...field} />
                </FormControl>
                <FormDescription>
                  The name of this competency cluster
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AN" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormDescription>
                  A short code identifier
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe this cluster..."
                />
              </FormControl>
              <FormDescription>
                A detailed description of what this cluster represents
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
              <FormLabel>TKSs (Tasks, Knowledge, Skills)</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tksOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder={tksLoading ? 'Loading TKSs...' : 'Select TKSs...'}
                  searchPlaceholder="Search TKSs..."
                  emptyMessage="No TKSs found."
                  disabled={tksLoading}
                />
              </FormControl>
              <FormDescription>
                Select the competencies that belong to this cluster
              </FormDescription>
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
            {initialData ? 'Update Cluster' : 'Create Cluster'}
          </Button>
        </div>
      </form>
    </Form>
  );
}


