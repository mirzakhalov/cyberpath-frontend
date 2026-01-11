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
import { jobSchema, JobSchemaType } from '@/lib/validations/job';
import { Job } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useClusters } from '@/hooks/use-clusters';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface JobFormProps {
  initialData?: Job;
  onSubmit: (data: JobSchemaType) => Promise<void>;
  isLoading?: boolean;
}

export function JobForm({ initialData, onSubmit, isLoading }: JobFormProps) {
  const { data: clustersData, isLoading: clustersLoading } = useClusters({ page_size: 100 });

  const form = useForm<JobSchemaType>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      salary_min: initialData?.salary_min ?? undefined,
      salary_max: initialData?.salary_max ?? undefined,
      requirements: initialData?.requirements ?? '',
      cluster_ids: initialData?.clusters?.map((c) => c.id) ?? [],
    },
  });

  const handleSubmit = async (data: JobSchemaType) => {
    await onSubmit(data);
  };

  const clusterOptions = (clustersData?.data ?? []).map((cluster) => ({
    value: cluster.id,
    label: cluster.name,
    description: cluster.code ? `Code: ${cluster.code}` : undefined,
  }));

  const selectedClusters = form.watch('cluster_ids');
  const clusterCount = selectedClusters.length;
  const hasExactlyFour = clusterCount === 4;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Security Analyst" {...field} />
              </FormControl>
              <FormDescription>
                The title of the cybersecurity job role
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
                  placeholder="Describe the job role, responsibilities, and expectations..."
                />
              </FormControl>
              <FormDescription>
                A detailed description of the job role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="salary_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 60000"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 95000"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements (Optional)</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="List job requirements, qualifications, certifications..."
                />
              </FormControl>
              <FormDescription>
                Additional requirements or qualifications for this role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cluster_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NICE Clusters (Exactly 4 Required)</FormLabel>
              <FormControl>
                <MultiSelect
                  options={clusterOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder={clustersLoading ? 'Loading clusters...' : 'Select exactly 4 clusters...'}
                  searchPlaceholder="Search clusters..."
                  emptyMessage="No clusters found."
                  maxSelected={4}
                  disabled={clustersLoading}
                />
              </FormControl>
              <FormDescription>
                Each job must be mapped to exactly 4 NICE clusters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cluster count indicator */}
        <Alert variant={hasExactlyFour ? 'default' : 'destructive'}>
          {hasExactlyFour ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {hasExactlyFour
              ? '✓ You have selected exactly 4 clusters'
              : `You have selected ${clusterCount} cluster${clusterCount !== 1 ? 's' : ''}. Please select exactly 4.`}
          </AlertDescription>
        </Alert>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !hasExactlyFour}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {initialData ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

