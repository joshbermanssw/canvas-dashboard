'use client';

import { useMemo } from 'react';
import { useUpcomingAssignments } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Flame } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks } from 'date-fns';
import { getSemesterWeek, WEEK_STARTS_ON } from '@/lib/semester';

const WEEKS_SHOWN = 8;

export function WorkloadHeatmap() {
  const { data: assignments, loading, error } = useUpcomingAssignments();

  const heatmapData = useMemo(() => {
    if (!assignments) return [];

    const start = startOfWeek(new Date(), WEEK_STARTS_ON);
    const days: { date: Date; count: number; assignments: string[] }[] = [];

    for (let week = 0; week < WEEKS_SHOWN; week++) {
      for (let day = 0; day < 7; day++) {
        const date = addDays(addWeeks(start, week), day);
        const dayAssignments = assignments.filter(
          a => a.due_at && isSameDay(new Date(a.due_at), date)
        );
        days.push({
          date,
          count: dayAssignments.length,
          assignments: dayAssignments.map(a => a.name),
        });
      }
    }

    return days;
  }, [assignments]);

  /** Column headings, resolved once per render from the USYD academic calendar. */
  const semesterWeeks = useMemo(() => {
    const start = startOfWeek(new Date(), WEEK_STARTS_ON);
    return Array.from({ length: WEEKS_SHOWN }, (_, weekIndex) =>
      getSemesterWeek(addWeeks(start, weekIndex))
    );
  }, []);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count === 1) return 'bg-green-300 dark:bg-green-700';
    if (count === 2) return 'bg-yellow-300 dark:bg-yellow-700';
    if (count === 3) return 'bg-orange-400 dark:bg-orange-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Workload Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Workload Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load workload data</p>
        </CardContent>
      </Card>
    );
  }

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5" />
          Workload Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 mt-5">
            {dayLabels.map((day, i) => (
              <div key={day} className="h-4 text-xs text-muted-foreground flex items-center">
                {i % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {semesterWeeks.map((semesterWeek, weekIndex) => {
              return (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {/* Week label */}
                  <div className="h-4 text-xs text-muted-foreground text-center font-medium">
                    {semesterWeek.short}
                  </div>
                  {/* Days */}
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const data = heatmapData[weekIndex * 7 + dayIndex];
                    if (!data) return null;

                    return (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-4 w-4 rounded-sm cursor-pointer transition-colors ${getIntensityClass(data.count)}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">
                              {format(data.date, 'MMM d, yyyy')} · {semesterWeek.long}
                            </p>
                            {data.count === 0 ? (
                              <p className="text-muted-foreground">No assignments</p>
                            ) : (
                              <>
                                <p>{data.count} assignment{data.count > 1 ? 's' : ''}</p>
                                <ul className="mt-1">
                                  {data.assignments.slice(0, 3).map((name, i) => (
                                    <li key={i} className="truncate max-w-[200px]">• {name}</li>
                                  ))}
                                  {data.assignments.length > 3 && (
                                    <li>• +{data.assignments.length - 3} more</li>
                                  )}
                                </ul>
                              </>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted" />
            <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-700" />
            <div className="h-3 w-3 rounded-sm bg-yellow-300 dark:bg-yellow-700" />
            <div className="h-3 w-3 rounded-sm bg-orange-400 dark:bg-orange-600" />
            <div className="h-3 w-3 rounded-sm bg-red-500 dark:bg-red-600" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
