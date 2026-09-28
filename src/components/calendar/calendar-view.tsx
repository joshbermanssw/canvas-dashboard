'use client';

import { useState } from 'react';
import { useAssignments, useCourses, usePersonalEvents } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AssignmentRow } from '@/components/assignments/assignment-row';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { WEEK_STARTS_ON } from '@/lib/semester';

const COURSE_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500',
];

/**
 * Month grid of assignment due dates plus personal Canvas calendar events.
 * Assignments use the same data as the workload heatmap and "Due Soon" list
 * (all assignments, not just upcoming, so past months still render). Personal
 * events (e.g. presentation slots) are added in Canvas under your own calendar.
 */
export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { data: assignments, loading, error } = useAssignments();
  const { data: courses } = useCourses();

  const getCourseName = (courseId: number) =>
    courses?.find(c => c.id === courseId)?.course_code || 'Unknown';

  const calStart = startOfWeek(startOfMonth(currentMonth), WEEK_STARTS_ON);
  const calEnd = endOfWeek(endOfMonth(currentMonth), WEEK_STARTS_ON);
  const { data: events } = usePersonalEvents(
    format(calStart, 'yyyy-MM-dd'),
    format(addDays(calEnd, 1), 'yyyy-MM-dd')
  );

  const calendarDays: Date[] = [];
  for (let day = calStart; day <= calEnd; day = addDays(day, 1)) {
    calendarDays.push(day);
  }

  const getAssignmentsForDate = (date: Date) =>
    (assignments ?? [])
      .filter(a => a.due_at && isSameDay(new Date(a.due_at), date))
      .sort((a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime());

  const getEventsForDate = (date: Date) =>
    (events ?? []).filter(e => isSameDay(new Date(e.start_at), date));

  const selectedAssignments = selectedDate ? getAssignmentsForDate(selectedDate) : [];
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar Grid */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentMonth(new Date());
                setSelectedDate(new Date());
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : error ? (
            <p className="text-sm text-muted-foreground">Failed to load assignments</p>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
              {/* Day headers */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div
                  key={day}
                  className="bg-background p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map(day => {
                const dayAssignments = getAssignmentsForDate(day);
                const dayEvents = getEventsForDate(day);
                const hiddenCount = dayEvents.length + dayAssignments.length - 3;
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      bg-background p-2 min-h-24 text-left transition-colors hover:bg-muted
                      ${!isCurrentMonth ? 'opacity-40' : ''}
                      ${isSelected ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <span
                      className={`
                        inline-flex h-6 w-6 items-center justify-center rounded-full text-sm
                        ${isToday(day) ? 'bg-primary text-primary-foreground' : ''}
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className="flex items-center gap-1 rounded bg-primary px-1 text-xs font-medium text-primary-foreground"
                        >
                          <Star className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {dayAssignments.slice(0, Math.max(0, 3 - dayEvents.length)).map(assignment => (
                        <div
                          key={assignment.id}
                          className="flex items-center gap-1 rounded border px-1 text-xs"
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${COURSE_COLORS[assignment.course_id % COURSE_COLORS.length]}`}
                          />
                          <span className="truncate">{assignment.name}</span>
                        </div>
                      ))}
                      {hiddenCount > 0 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{hiddenCount} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a day'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {selectedAssignments.length + selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing due on this day</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map(event => (
                  <a
                    key={event.id}
                    href={event.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-primary/40 bg-primary/10 p-3 transition-colors hover:bg-primary/15"
                  >
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Personal event
                    </p>
                    <p className="font-medium text-sm">{event.title}</p>
                  </a>
                ))}
                {selectedAssignments.map(assignment => (
                  <AssignmentRow
                    key={assignment.id}
                    assignment={assignment}
                    courseName={getCourseName(assignment.course_id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
