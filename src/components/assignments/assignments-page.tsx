'use client';

import { useState } from 'react';
import { useAssignments, useCourses } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  ExternalLink,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import type { Assignment } from '@/lib/types';

export function AssignmentsPage() {
  const { data: assignments, loading, error } = useAssignments();
  const { data: courses } = useCourses();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'submitted'>('upcoming');

  const getCourseName = (courseId: number) => {
    return courses?.find(c => c.id === courseId)?.course_code || 'Unknown';
  };

  const getCourseColor = (courseId: number) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    return colors[courseId % colors.length];
  };

  const getSubmissionStatus = (assignment: Assignment) => {
    if (assignment.submission?.workflow_state === 'submitted' ||
        assignment.submission?.workflow_state === 'graded') {
      return 'submitted';
    }
    if (assignment.due_at && isPast(new Date(assignment.due_at))) {
      return 'past';
    }
    return 'upcoming';
  };

  const filteredAssignments = assignments?.filter(a => {
    if (filter === 'all') return true;
    const status = getSubmissionStatus(a);
    if (filter === 'submitted') return status === 'submitted';
    if (filter === 'past') return status === 'past';
    if (filter === 'upcoming') return status === 'upcoming';
    return true;
  }).sort((a, b) => {
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  }) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">Failed to load assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Assignments
        </h1>
        <div className="flex gap-2">
          {(['upcoming', 'past', 'submitted', 'all'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[calc(100vh-220px)]">
            {filteredAssignments.length === 0 ? (
              <p className="text-muted-foreground">No assignments found</p>
            ) : (
              <div className="space-y-3">
                {filteredAssignments.map(assignment => {
                  const status = getSubmissionStatus(assignment);

                  return (
                    <button
                      key={assignment.id}
                      onClick={() => setSelectedAssignment(assignment)}
                      className="w-full text-left rounded-lg border p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`h-2 w-2 rounded-full ${getCourseColor(assignment.course_id)}`} />
                            <span className="text-xs text-muted-foreground">
                              {getCourseName(assignment.course_id)}
                            </span>
                          </div>
                          <p className="font-medium">{assignment.name}</p>
                          {assignment.due_at && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Due {format(new Date(assignment.due_at), 'MMM d, h:mm a')}
                              </span>
                              <span className="text-orange-500">
                                ({formatDistanceToNow(new Date(assignment.due_at), { addSuffix: true })})
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {assignment.points_possible && (
                            <Badge variant="secondary">
                              {assignment.points_possible} pts
                            </Badge>
                          )}
                          {status === 'submitted' && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Submitted
                            </Badge>
                          )}
                          {status === 'past' && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Past Due
                            </Badge>
                          )}
                          {status === 'upcoming' && (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Upcoming
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Assignment Detail Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-2 w-2 rounded-full ${getCourseColor(selectedAssignment.course_id)}`} />
                  <span className="text-sm text-muted-foreground">
                    {getCourseName(selectedAssignment.course_id)}
                  </span>
                </div>
                <DialogTitle>{selectedAssignment.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Due date */}
                {selectedAssignment.due_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Due: {format(new Date(selectedAssignment.due_at), 'EEEE, MMMM d, yyyy h:mm a')}
                    </span>
                  </div>
                )}

                {/* Points */}
                {selectedAssignment.points_possible && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedAssignment.points_possible} points possible
                    </Badge>
                    {selectedAssignment.submission?.score !== null &&
                     selectedAssignment.submission?.score !== undefined && (
                      <Badge variant="default">
                        Score: {selectedAssignment.submission.score} / {selectedAssignment.points_possible}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Description */}
                {selectedAssignment.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: selectedAssignment.description }}
                    />
                  </div>
                )}

                {/* Rubric */}
                {selectedAssignment.rubric && selectedAssignment.rubric.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Rubric</h4>
                    <div className="space-y-2">
                      {selectedAssignment.rubric.map(criterion => (
                        <div key={criterion.id} className="rounded-lg border p-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{criterion.description}</span>
                            <Badge variant="outline">{criterion.points} pts</Badge>
                          </div>
                          {criterion.long_description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {criterion.long_description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submission types */}
                {selectedAssignment.submission_types && (
                  <div>
                    <h4 className="font-medium mb-2">Submission Types</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssignment.submission_types.map(type => (
                        <Badge key={type} variant="outline">
                          {type.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Open in Canvas button */}
                <div className="pt-4">
                  <Button asChild>
                    <a
                      href={selectedAssignment.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Canvas
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
