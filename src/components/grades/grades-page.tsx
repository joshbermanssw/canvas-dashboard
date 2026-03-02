'use client';

import { useCourses, useAssignments } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, ExternalLink } from 'lucide-react';

export function GradesPage() {
  const { data: courses, loading: coursesLoading, error: coursesError } = useCourses();

  const getGradeColor = (score: number | undefined) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getGradeBg = (score: number | undefined) => {
    if (!score) return 'bg-muted';
    if (score >= 90) return 'bg-green-500/10 border-green-500/20';
    if (score >= 80) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 70) return 'bg-yellow-500/10 border-yellow-500/20';
    if (score >= 60) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  if (coursesLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Grades</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Grades</h1>
        <p className="text-muted-foreground">Failed to load grades</p>
      </div>
    );
  }

  const coursesWithGrades = courses?.filter(c => c.currentScore !== undefined) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <GraduationCap className="h-6 w-6" />
        Grades
      </h1>

      {/* Course grade cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coursesWithGrades.map(course => (
          <Card key={course.id} className={`border ${getGradeBg(course.currentScore)}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base truncate">{course.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{course.course_code}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${getGradeColor(course.currentScore)}`}>
                  {course.currentScore?.toFixed(1)}%
                </span>
                {course.currentGrade && (
                  <Badge variant="outline" className={getGradeColor(course.currentScore)}>
                    {course.currentGrade}
                  </Badge>
                )}
              </div>
              {course.finalScore !== course.currentScore && course.finalScore && (
                <p className="text-sm text-muted-foreground mt-2">
                  Final: {course.finalScore?.toFixed(1)}%
                  {course.finalGrade && ` (${course.finalGrade})`}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed view per course */}
      {coursesWithGrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={coursesWithGrades[0]?.id.toString()}>
              <TabsList className="flex-wrap h-auto">
                {coursesWithGrades.map(course => (
                  <TabsTrigger key={course.id} value={course.id.toString()}>
                    {course.course_code}
                  </TabsTrigger>
                ))}
              </TabsList>
              {coursesWithGrades.map(course => (
                <TabsContent key={course.id} value={course.id.toString()}>
                  <CourseAssignments courseId={course.id} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CourseAssignments({ courseId }: { courseId: number }) {
  const { data: assignments, loading, error } = useAssignments(courseId);

  if (loading) {
    return (
      <div className="space-y-2 mt-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-muted-foreground mt-4">Failed to load assignments</p>;
  }

  const gradedAssignments = assignments?.filter(
    a => a.submission?.score !== null && a.submission?.score !== undefined
  ) || [];

  return (
    <ScrollArea className="h-[400px] mt-4">
      {gradedAssignments.length === 0 ? (
        <p className="text-muted-foreground">No graded assignments yet</p>
      ) : (
        <div className="space-y-2">
          {gradedAssignments.map(assignment => {
            const score = assignment.submission?.score || 0;
            const maxPoints = assignment.points_possible || 0;
            const percentage = maxPoints > 0 ? (score / maxPoints) * 100 : 0;

            return (
              <a
                key={assignment.id}
                href={assignment.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{assignment.name}</p>
                  {assignment.submission?.late && (
                    <Badge variant="destructive" className="text-xs mt-1">Late</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">
                      {score} / {maxPoints}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </ScrollArea>
  );
}
