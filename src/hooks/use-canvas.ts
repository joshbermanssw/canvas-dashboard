'use client';

import { useState, useEffect, useCallback } from 'react';
import canvasApi from '@/lib/canvas-api';
import type {
  User,
  CourseWithGrade,
  Assignment,
  CalendarEvent,
  Announcement,
  DiscussionTopic,
  TodoItem,
} from '@/lib/types';

// Generic hook for data fetching
function useCanvasData<T>(
  fetcher: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Courses with grades
export function useCourses() {
  return useCanvasData<CourseWithGrade[]>(() => canvasApi.getCoursesWithGrades());
}

// Assignments
export function useAssignments(courseId?: number) {
  return useCanvasData<Assignment[]>(
    () => courseId ? canvasApi.getAssignments(courseId) : canvasApi.getAllAssignments(),
    [courseId]
  );
}

export function useUpcomingAssignments() {
  return useCanvasData<Assignment[]>(() => canvasApi.getUpcomingAssignments());
}

// Calendar
export function useCalendar(startDate: string, endDate: string) {
  return useCanvasData<CalendarEvent[]>(
    () => canvasApi.getAllCalendarItems(startDate, endDate),
    [startDate, endDate]
  );
}

// Announcements
export function useAnnouncements() {
  return useCanvasData<Announcement[]>(() => canvasApi.getAnnouncements());
}

// Discussions
export function useDiscussions() {
  return useCanvasData<DiscussionTopic[]>(() => canvasApi.getAllDiscussions());
}

// To-Do
export function useTodoItems() {
  return useCanvasData<TodoItem[]>(() => canvasApi.getTodoItems());
}

// User
export function useUser() {
  return useCanvasData<User>(() => canvasApi.getCurrentUser());
}

// Check if API is configured
export function useCanvasConfig() {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    setIsConfigured(canvasApi.isConfigured());
  }, []);

  return isConfigured;
}
