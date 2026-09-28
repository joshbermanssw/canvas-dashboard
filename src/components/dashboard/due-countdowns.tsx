'use client';

import { useUpcomingAssignments, useCourses } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentRow } from '@/components/assignments/assignment-row';
import { Clock } from 'lucide-react';

export function DueCountdowns() {
  const { data: assignments, loading, error } = useUpcomingAssignments();
  const { data: courses } = useCourses();

  const getCourseName = (courseId: number) => {
    return courses?.find(c => c.id === courseId)?.course_code || 'Unknown';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Due Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
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
            <Clock className="h-5 w-5" />
            Due Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load countdowns</p>
        </CardContent>
      </Card>
    );
  }

  // Get the next 5 assignments with due dates
  const upcomingWithDates = assignments
    ?.filter(a => a.due_at)
    .slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Due Soon
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingWithDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
        ) : (
          <div className="space-y-3">
            {upcomingWithDates.map(assignment => (
              <AssignmentRow
                key={assignment.id}
                assignment={assignment}
                courseName={getCourseName(assignment.course_id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
