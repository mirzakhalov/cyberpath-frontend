'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { SkillBitForm } from '@/components/forms/skillbit-form';
import { useCreateSkillBit } from '@/hooks/use-skillbits';
import { SkillbitSchemaType } from '@/lib/validations/skillbit';
import { toast } from 'sonner';

export default function NewSkillBitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultWeekId = searchParams.get('week_id') ?? undefined;
  const createMutation = useCreateSkillBit();

  const handleSubmit = async (data: SkillbitSchemaType) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('SkillBit challenge created successfully');
      router.push('/admin/skillbits');
    } catch (error) {
      toast.error('Failed to create SkillBit challenge');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New SkillBit Challenge"
        description="Create a new hands-on challenge"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'SkillBit Challenges', href: '/admin/skillbits' },
          { label: 'New' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
          <CardDescription>
            Enter the details for the new SkillBit challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SkillBitForm
            defaultWeekId={defaultWeekId}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

