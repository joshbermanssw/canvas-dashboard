'use client';

import { useCourses } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap } from 'lucide-react';

export function GradesOverview() {
  const { data: courses, loading, error } = useCourses();

  const getGradeColor = (score: number | undefined) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number | undefined) => {
    if (!score) return 'bg-muted';
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Grades Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
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
            <GraduationCap className="h-5 w-5" />
            Grades Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load grades</p>
        </CardContent>
      </Card>
    );
  }

  const coursesWithGrades = courses?.filter(c => c.currentScore !== undefined) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Grades Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {coursesWithGrades.length === 0 ? (
            <p className="text-sm text-muted-foreground">No grades available</p>
          ) : (
            <div className="space-y-4">
              {coursesWithGrades.map(course => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {course.course_code || course.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getGradeColor(course.currentScore)}`}>
                        {course.currentScore?.toFixed(1)}%
                      </span>
                      {course.currentGrade && (
                        <span className={`text-xs font-medium ${getGradeColor(course.currentScore)}`}>
                          ({course.currentGrade})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`absolute h-full rounded-full transition-all ${getProgressColor(course.currentScore)}`}
                      style={{ width: `${Math.min(course.currentScore || 0, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
