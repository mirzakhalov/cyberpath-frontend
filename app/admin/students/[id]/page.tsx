'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader, PageLoader } from '@/components/shared';
import { useStudent } from '@/hooks/use-dashboard';
import { 
  Calendar, 
  Mail, 
  FileText, 
  Route, 
  Brain, 
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  ExternalLink,
  Bot
} from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
};

const documentTypeIcons: Record<string, string> = {
  transcript: '📄',
  resume: '📋',
  certificate: '🎓',
};

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: student, isLoading } = useStudent(id);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Student not found</h2>
        <p className="text-muted-foreground mt-2">The requested student could not be found.</p>
        <Link href="/admin/students">
          <Button className="mt-4">Back to Students</Button>
        </Link>
      </div>
    );
  }

  const { user, pathways, documents, competencies, agent_sessions } = student;

  return (
    <div>
      <PageHeader
        title={user.name || 'Unnamed Student'}
        description={user.email}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Students', href: '/admin/students' },
          { label: user.name || user.email },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Student Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Age Verified</span>
              {user.age_verified_at ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <XCircle className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Consent Given</span>
              {user.consent_given_at ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <XCircle className="mr-1 h-3 w-3" />
                  No
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Demographics</span>
              {user.demographics ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                  Not Provided
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{documents.length}</div>
            <p className="text-sm text-muted-foreground">Uploaded files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Competencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{competencies.length}</div>
            <p className="text-sm text-muted-foreground">Identified skills</p>
          </CardContent>
        </Card>
      </div>

      {/* Pathways Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Learning Pathways
          </CardTitle>
          <CardDescription>
            {pathways.length} pathway{pathways.length !== 1 ? 's' : ''} generated
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pathways.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pathways generated yet
            </div>
          ) : (
            <div className="space-y-4">
              {pathways.map((pathway) => (
                <div
                  key={pathway.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{pathway.selected_job.title}</span>
                      <Badge variant="secondary">
                        {(pathway.match_score * 100).toFixed(0)}% match
                      </Badge>
                    </div>
                    <Link href={`/admin/pathways/${pathway.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-medium">{pathway.completion_percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={pathway.completion_percentage} className="h-2" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {pathway.courses.map((course) => (
                      <div key={course.id} className="bg-muted/50 rounded px-2 py-1 text-xs">
                        <div className="font-medium truncate">{course.title}</div>
                        <div className="text-muted-foreground">
                          {course.completion_percentage.toFixed(0)}% complete
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
          <CardDescription>
            Uploaded transcripts, resumes, and certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <span className="mr-2">{documentTypeIcons[doc.document_type] || '📎'}</span>
                      {doc.filename}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {doc.document_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusColors[doc.analysis_status] || statusColors.pending}
                      >
                        {doc.analysis_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(doc.uploaded_at), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Competencies Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Identified Competencies
          </CardTitle>
          <CardDescription>
            Skills and knowledge extracted from documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {competencies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No competencies identified yet
            </div>
          ) : (
            <div className="space-y-2">
              {competencies.map((comp, index) => (
                <div
                  key={`${comp.tks_id}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm">{comp.tks_statement}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: <span className="capitalize">{comp.source}</span>
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {(comp.confidence_score * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Sessions Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Sessions
          </CardTitle>
          <CardDescription>
            LLM processing sessions for this student
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agent_sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No AI sessions recorded
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Decisions</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agent_sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium capitalize">
                      {session.workflow_type.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusColors[session.status] || statusColors.pending}
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{session.decision_count}</TableCell>
                    <TableCell>
                      <Link href={`/admin/audit/${session.id}`}>
                        <Button variant="ghost" size="sm">
                          Inspect
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Registered:</span>
            <span>{format(new Date(user.created_at), 'MMMM d, yyyy')}</span>
          </div>
          {user.age_verified_at && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Age verified:</span>
              <span>{format(new Date(user.age_verified_at), 'MMMM d, yyyy')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

