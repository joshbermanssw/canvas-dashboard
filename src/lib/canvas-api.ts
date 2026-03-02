import type {
  Course,
  Assignment,
  CalendarEvent,
  Announcement,
  DiscussionTopic,
  TodoItem,
  CourseWithGrade,
} from './types';

class CanvasAPI {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_CANVAS_BASE_URL || '';
    this.token = process.env.NEXT_PUBLIC_CANVAS_API_TOKEN || '';
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return this.fetch<Course[]>('/courses?enrollment_state=active&include[]=total_scores&include[]=term&per_page=50');
  }

  async getCoursesWithGrades(): Promise<CourseWithGrade[]> {
    const courses = await this.fetch<Course[]>(
      '/courses?enrollment_state=active&include[]=total_scores&include[]=enrollments&per_page=50'
    );

    return courses.map(course => {
      const enrollment = course.enrollments?.find(e => e.type === 'student');
      return {
        ...course,
        currentGrade: enrollment?.computed_current_grade ?? undefined,
        currentScore: enrollment?.computed_current_score ?? undefined,
        finalGrade: enrollment?.computed_final_grade ?? undefined,
        finalScore: enrollment?.computed_final_score ?? undefined,
      };
    });
  }

  // Assignments
  async getAssignments(courseId: number): Promise<Assignment[]> {
    return this.fetch<Assignment[]>(
      `/courses/${courseId}/assignments?include[]=submission&include[]=rubric_assessment&order_by=due_at&per_page=100`
    );
  }

  async getAllAssignments(): Promise<Assignment[]> {
    const courses = await this.getCourses();
    const assignmentPromises = courses.map(course => this.getAssignments(course.id));
    const assignmentArrays = await Promise.all(assignmentPromises);
    return assignmentArrays.flat();
  }

  async getUpcomingAssignments(): Promise<Assignment[]> {
    const assignments = await this.getAllAssignments();
    const now = new Date();

    return assignments
      .filter(a => a.due_at && new Date(a.due_at) > now)
      .sort((a, b) => {
        if (!a.due_at) return 1;
        if (!b.due_at) return -1;
        return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      });
  }

  // Calendar
  async getCalendarEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    const courses = await this.getCourses();
    const contextCodes = courses.map(c => `course_${c.id}`).join('&context_codes[]=');

    return this.fetch<CalendarEvent[]>(
      `/calendar_events?type=event&start_date=${startDate}&end_date=${endDate}&context_codes[]=${contextCodes}&per_page=100`
    );
  }

  async getCalendarAssignments(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    const courses = await this.getCourses();
    const contextCodes = courses.map(c => `course_${c.id}`).join('&context_codes[]=');

    return this.fetch<CalendarEvent[]>(
      `/calendar_events?type=assignment&start_date=${startDate}&end_date=${endDate}&context_codes[]=${contextCodes}&per_page=100`
    );
  }

  async getAllCalendarItems(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    const [events, assignments] = await Promise.all([
      this.getCalendarEvents(startDate, endDate),
      this.getCalendarAssignments(startDate, endDate),
    ]);

    return [...events, ...assignments].sort((a, b) =>
      new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const courses = await this.getCourses();
    const contextCodes = courses.map(c => `course_${c.id}`).join('&context_codes[]=');

    return this.fetch<Announcement[]>(
      `/announcements?context_codes[]=${contextCodes}&per_page=50`
    );
  }

  // Discussions
  async getDiscussionTopics(courseId: number): Promise<DiscussionTopic[]> {
    const topics = await this.fetch<DiscussionTopic[]>(
      `/courses/${courseId}/discussion_topics?order_by=recent_activity&per_page=50`
    );
    return topics.map(topic => ({ ...topic, course_id: courseId }));
  }

  async getAllDiscussions(): Promise<DiscussionTopic[]> {
    const courses = await this.getCourses();
    const discussionPromises = courses.map(course => this.getDiscussionTopics(course.id));
    const discussionArrays = await Promise.all(discussionPromises);
    return discussionArrays.flat().sort((a, b) => {
      const dateA = a.last_reply_at || a.posted_at;
      const dateB = b.last_reply_at || b.posted_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }

  // To-Do
  async getTodoItems(): Promise<TodoItem[]> {
    return this.fetch<TodoItem[]>('/users/self/todo?per_page=50');
  }

  // Helper to check if API is configured
  isConfigured(): boolean {
    return Boolean(this.baseUrl && this.token);
  }
}

export const canvasApi = new CanvasAPI();
export default canvasApi;
