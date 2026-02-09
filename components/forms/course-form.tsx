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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { courseSchema, CourseSchemaType } from '@/lib/validations/course';
import { Course } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useUniversities } from '@/hooks/use-universities';

interface CourseFormProps {
  initialData?: Course;
  defaultUniversityId?: string;
  onSubmit: (data: CourseSchemaType) => Promise<void>;
  isLoading?: boolean;
}

export function CourseForm({ initialData, defaultUniversityId, onSubmit, isLoading }: CourseFormProps) {
  const { data: universitiesData, isLoading: universitiesLoading } = useUniversities({ page_size: 100 });

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      university_id: initialData?.university_id ?? defaultUniversityId ?? '',
      course_code: initialData?.course_code ?? '',
      course_name: initialData?.course_name ?? '',
      description: initialData?.description ?? '',
    },
  });

  const handleSubmit = async (data: CourseSchemaType) => {
    await onSubmit(data);
  };

  const universities = universitiesData?.data ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="university_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={universitiesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={universitiesLoading ? 'Loading...' : 'Select university'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The university that offers this course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="course_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CYB 101" {...field} />
                </FormControl>
                <FormDescription>
                  The official course code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="course_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Introduction to Cybersecurity" {...field} />
                </FormControl>
                <FormDescription>
                  The full course title
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
                  placeholder="Describe the course content and objectives..."
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
            {initialData ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Form>
  );
}




