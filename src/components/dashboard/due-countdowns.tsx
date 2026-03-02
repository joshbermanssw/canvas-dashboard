'use client';

import { useUpcomingAssignments, useCourses } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, AlertTriangle } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export function DueCountdowns() {
  const { data: assignments, loading, error } = useUpcomingAssignments();
  const { data: courses } = useCourses();

  const getCourseName = (courseId: number) => {
    return courses?.find(c => c.id === courseId)?.course_code || 'Unknown';
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);

    const days = differenceInDays(due, now);
    const hours = differenceInHours(due, now) % 24;
    const minutes = differenceInMinutes(due, now) % 60;

    if (days > 0) {
      return { text: `${days}d ${hours}h`, urgent: days <= 1 };
    } else if (hours > 0) {
      return { text: `${hours}h ${minutes}m`, urgent: true };
    } else if (minutes > 0) {
      return { text: `${minutes}m`, urgent: true };
    }
    return { text: 'Due now!', urgent: true };
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
            {upcomingWithDates.map(assignment => {
              const timeInfo = getTimeRemaining(assignment.due_at!);

              return (
                <a
                  key={assignment.id}
                  href={assignment.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {getCourseName(assignment.course_id)}
                      </p>
                      <p className="font-medium text-sm truncate">{assignment.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {timeInfo.urgent && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      <Badge
                        variant={timeInfo.urgent ? 'destructive' : 'secondary'}
                        className="font-mono text-sm"
                      >
                        {timeInfo.text}
                      </Badge>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
