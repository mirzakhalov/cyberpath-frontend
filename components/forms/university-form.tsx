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
import { universitySchema, UniversitySchemaType } from '@/lib/validations/university';
import { University } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface UniversityFormProps {
  initialData?: University;
  onSubmit: (data: UniversitySchemaType) => Promise<void>;
  isLoading?: boolean;
}

export function UniversityForm({ initialData, onSubmit, isLoading }: UniversityFormProps) {
  const form = useForm<UniversitySchemaType>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      name: initialData?.name ?? '',
      sso_entity_id: initialData?.sso_entity_id ?? '',
      contact_email: initialData?.contact_email ?? '',
      contact_name: initialData?.contact_name ?? '',
      notes: initialData?.notes ?? '',
    },
  });

  const handleSubmit = async (data: UniversitySchemaType) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., University of Maryland" {...field} />
              </FormControl>
              <FormDescription>
                The official name of the partner institution
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dr. Jane Smith" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g., contact@university.edu"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sso_entity_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSO Entity ID (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., https://idp.university.edu/shibboleth"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                For future SSO integration with the university
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about this partnership..."
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
            {initialData ? 'Update University' : 'Create University'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

