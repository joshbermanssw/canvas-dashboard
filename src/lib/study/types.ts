/**
 * One section or question type of the exam paper. Papers that publish a full
 * marks breakdown set `questions`, `points` and `recommendedMinutes` on every section and
 * render as a table; otherwise the sections render as a list with `detail`.
 */
export interface ExamSection {
  name: string;
  detail?: string;
  questions?: number;
  points?: number;
  recommendedMinutes?: number;
}

export interface Exam {
  /** ISO 8601 with offset, so the countdown is correct in any timezone. */
  startsAt: string;
  arriveBy?: string;
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

/** A law or equation a calculation question could need. `note` defines the symbols. */
export interface Formula {
  name: string;
  formula: string;
  note?: string;
}

export interface Reading {
  citation: string;
  kind: 'reading' | 'viewing';
  takeaways: string[];
}

/**
 * One teaching week. Every guide has concepts and frameworks; the optional
 * lists are filled in only where the course's exam calls for them.
 */
export interface Topic {
  week: number;
  title: string;
  summary: string;
  concepts: Concept[];
  frameworks: Framework[];
  formulas?: Formula[];
  challenges?: string[];
  strategies?: string[];
  /** Named cases or worked scenarios from the lecture. */
  examples?: string[];
  reading?: Reading;
}

export interface PracticeQuestion {
  title: string;
  scenario?: string;
  parts: string[];
  weeks: number[];
  /** Lecture material worth drawing on, for open questions with no set answer. */
  drawOn?: string[];
  /** Worked answer from the course's own solutions, one entry per part where possible. */
  answer?: string[];
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
  /** Heading for each topic's `frameworks` list, e.g. "Frameworks". */
  frameworksHeading: string;
  /** Heading for each topic's `examples` list. */
  examplesHeading: string;
  /** One line above the weekly topics saying how they are organised. */
  topicsNote: string;
  topics: Topic[];
  practiceQuestions: PracticeQuestion[];
  practiceNote: string;
  sources: string[];
}
