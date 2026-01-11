'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { SkillBitForm } from '@/components/forms/skillbit-form';
import { useSkillBit, useUpdateSkillBit } from '@/hooks/use-skillbits';
import { SkillbitSchemaType } from '@/lib/validations/skillbit';
import { toast } from 'sonner';

export default function EditSkillBitPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: skillbit, isLoading } = useSkillBit(id);
  const updateMutation = useUpdateSkillBit();

  const handleSubmit = async (data: SkillbitSchemaType) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('SkillBit challenge updated successfully');
      router.push(`/admin/skillbits/${id}`);
    } catch (error) {
      toast.error('Failed to update SkillBit challenge');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!skillbit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Challenge not found</h2>
        <p className="text-muted-foreground mt-2">The requested SkillBit challenge could not be found.</p>
        <Link href="/admin/skillbits">
          <Button className="mt-4">Back to Challenges</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${skillbit.name}`}
        description="Update the challenge details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'SkillBit Challenges', href: '/admin/skillbits' },
          { label: skillbit.name, href: `/admin/skillbits/${id}` },
          { label: 'Edit' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
          <CardDescription>
            Update the details for this SkillBit challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SkillBitForm
            initialData={skillbit}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

