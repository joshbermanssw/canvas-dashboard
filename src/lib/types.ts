// Canvas API Types

export interface Course {
  id: number;
  name: string;
  course_code: string;
  enrollment_term_id: number;
  start_at: string | null;
  end_at: string | null;
  workflow_state: string;
  default_view: string;
  enrollments?: Enrollment[];
}

export interface Enrollment {
  type: string;
  role: string;
  enrollment_state: string;
  computed_current_score: number | null;
  computed_final_score: number | null;
  computed_current_grade: string | null;
  computed_final_grade: string | null;
}

export interface Assignment {
  id: number;
  name: string;
  description: string | null;
  due_at: string | null;
  lock_at: string | null;
  unlock_at: string | null;
  course_id: number;
  html_url: string;
  points_possible: number;
  submission_types: string[];
  has_submitted_submissions: boolean;
  rubric?: RubricCriterion[];
  submission?: Submission;
}

export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  submitted_at: string | null;
  score: number | null;
  grade: string | null;
  workflow_state: string;
  late: boolean;
  missing: boolean;
  attachments?: Attachment[];
}

export interface RubricCriterion {
  id: string;
  description: string;
  long_description?: string;
  points: number;
  ratings: RubricRating[];
}

export interface RubricRating {
  id: string;
  description: string;
  points: number;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start_at: string;
  end_at: string;
  description: string | null;
  context_code: string;
  context_name: string;
  workflow_state: string;
  type: 'event' | 'assignment';
  html_url: string;
  assignment?: Assignment;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  context_code: string;
  author: {
    id: number;
    display_name: string;
    avatar_image_url: string;
  };
  read_state: 'read' | 'unread';
  html_url: string;
}

export interface DiscussionTopic {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  last_reply_at: string | null;
  discussion_subentry_count: number;
  read_state: 'read' | 'unread';
  unread_count: number;
  html_url: string;
  author: {
    id: number;
    display_name: string;
    avatar_image_url: string;
  };
  course_id: number;
}

export interface TodoItem {
  type: string;
  assignment?: Assignment;
  context_type: string;
  context_name: string;
  html_url: string;
}

export interface Attachment {
  id: number;
  display_name: string;
  filename: string;
  url: string;
  size: number;
  content_type: string;
  created_at: string;
}

// App-specific types

export interface PersonalTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  courseId?: number;
  createdAt: string;
}

export interface CourseWithGrade extends Course {
  currentGrade?: string;
  currentScore?: number;
  finalGrade?: string;
  finalScore?: number;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  assignments: Assignment[];
}

export interface WorkloadData {
  date: string;
  count: number;
  assignments: Assignment[];
}
