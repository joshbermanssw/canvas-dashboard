/** One marked section of the exam paper, as listed on the exam's Canvas site. */
export interface ExamSection {
  name: string;
  questions: number;
  points: number;
  recommendedMinutes: number;
}

export interface Exam {
  /** ISO 8601 with offset, so the countdown is correct in any timezone. */
  startsAt: string;
  arriveBy: string;
  durationMinutes: number;
  readingMinutes: number;
  /** Share of the final unit mark, in percent. */
  weight: number;
  mode: string;
  venue: string;
  sections: ExamSection[];
  conditions: string[];
}

export interface Concept {
  term: string;
  definition: string;
}

export interface Framework {
  name: string;
  source?: string;
  points: string[];
}

export interface Reading {
  citation: string;
  kind: 'reading' | 'viewing';
  takeaways: string[];
}

/**
 * One teaching week. The four lists mirror the "organising devices" the unit
 * coordinator says the exam is built on: concepts to explain, frameworks to
 * apply, challenges to assess a situation with, and strategies to respond.
 */
export interface Topic {
  week: number;
  title: string;
  summary: string;
  concepts: Concept[];
  frameworks: Framework[];
  challenges?: string[];
  strategies?: string[];
  /** Named cases from the lecture that can be quoted as evidence in an answer. */
  examples?: string[];
  reading?: Reading;
}

export interface PracticeQuestion {
  title: string;
  scenario?: string;
  parts: string[];
  weeks: number[];
  /** Lecture material worth drawing on. Not a model answer. */
  drawOn: string[];
}

export interface StudyGuide {
  slug: string;
  courseCode: string;
  courseName: string;
  canvasCourseId: number;
  exam: Exam;
  /** What the markers say they are looking for. */
  expectations: string[];
  notAsked: string[];
  advice: { title: string; detail: string }[];
  topics: Topic[];
  practiceQuestions: PracticeQuestion[];
  practiceNote: string;
  sources: string[];
}
