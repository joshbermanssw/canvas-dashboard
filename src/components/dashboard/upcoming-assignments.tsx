'use client';

import { useUpcomingAssignments, useCourses } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ExternalLink } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export function UpcomingAssignments() {
  const { data: assignments, loading, error } = useUpcomingAssignments();
  const { data: courses } = useCourses();

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

  const getCourseName = (courseId: number) => {
    return courses?.find(c => c.id === courseId)?.course_code || 'Unknown';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load assignments</p>
        </CardContent>
      </Card>
    );
  }

  const upcomingItems = assignments?.slice(0, 10) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upcoming Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {upcomingItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming assignments</p>
          ) : (
            <div className="space-y-3">
              {upcomingItems.map(assignment => (
                <a
                  key={assignment.id}
                  href={assignment.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`h-2 w-2 rounded-full ${getCourseColor(assignment.course_id)}`} />
                        <span className="text-xs text-muted-foreground">
                          {getCourseName(assignment.course_id)}
                        </span>
                      </div>
                      <p className="font-medium text-sm truncate">{assignment.name}</p>
                      {assignment.due_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due {format(new Date(assignment.due_at), 'MMM d, h:mm a')}
                          <span className="ml-2 text-orange-500">
                            ({formatDistanceToNow(new Date(assignment.due_at), { addSuffix: true })})
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.points_possible && (
                        <Badge variant="secondary" className="text-xs">
                          {assignment.points_possible} pts
                        </Badge>
                      )}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
