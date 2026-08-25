import {
  differenceInCalendarWeeks,
  isSameWeek,
  parseISO,
  startOfWeek,
} from 'date-fns';

/** USYD teaching weeks run Monday to Sunday. */
export const WEEK_STARTS_ON = { weekStartsOn: 1 } as const;

interface Session {
  /** Display name, e.g. "Semester 2". */
  name: string;
  /** Monday of teaching week 1 (inclusive). */
  teachingStart: string;
  /** Last day of teaching, i.e. the Sunday of week 13 (inclusive). */
  teachingEnd: string;
  /**
   * First day of the mid-semester break. The whole week commencing this date is
   * skipped when numbering teaching weeks. (The published end date can spill
   * into the following Monday when it is a public holiday — teaching still
   * resumes that week, so only the start date is used here.)
   */
  breakStart: string;
  /** Study vacation week (inclusive). */
  stuvacStart: string;
  stuvacEnd: string;
  /** Formal exam period (inclusive). */
  examsStart: string;
  examsEnd: string;
}

/**
 * Transcribed from the University of Sydney key dates calendar:
 * https://www.sydney.edu.au/students/key-dates.html
 * Add new sessions here each year — dates beyond this list fall back to 'off'.
 */
const SESSIONS = [
  {
    name: 'Semester 1',
    teachingStart: '2026-02-23',
    teachingEnd: '2026-05-31',
    breakStart: '2026-04-06',
    stuvacStart: '2026-06-01',
    stuvacEnd: '2026-06-07',
    examsStart: '2026-06-09',
    examsEnd: '2026-06-20',
  },
  {
    name: 'Semester 2',
    teachingStart: '2026-08-03',
    teachingEnd: '2026-11-08',
    breakStart: '2026-09-28',
    stuvacStart: '2026-11-09',
    stuvacEnd: '2026-11-15',
    examsStart: '2026-11-16',
    examsEnd: '2026-11-28',
  },
] as const satisfies readonly Session[];

interface Labels {
  /** Compact label for a heatmap column, e.g. "W4". */
  short: string;
  /** Full label for tooltips, e.g. "Semester 2 Week 4". */
  long: string;
}

export type SemesterWeek =
  | ({ kind: 'teaching'; session: string; week: number } & Labels)
  | ({ kind: 'break' | 'stuvac' | 'exams'; session: string } & Labels)
  | ({ kind: 'off' } & Labels);

/**
 * Resolves a date to its position in the USYD academic calendar. Teaching weeks
 * are numbered 1-13 with the mid-semester break excluded, matching how the
 * university and unit outlines refer to them.
 */
export function getSemesterWeek(date: Date): SemesterWeek {
  const monday = startOfWeek(date, WEEK_STARTS_ON);

  for (const session of SESSIONS) {
    const teachingStart = parseISO(session.teachingStart);
    const breakStart = parseISO(session.breakStart);

    if (monday >= teachingStart && monday <= parseISO(session.teachingEnd)) {
      if (isSameWeek(monday, breakStart, WEEK_STARTS_ON)) {
        return {
          kind: 'break',
          session: session.name,
          short: 'Break',
          long: `${session.name} mid-semester break`,
        };
      }

      const elapsed = differenceInCalendarWeeks(monday, teachingStart, WEEK_STARTS_ON);
      const week = elapsed + 1 - (monday > breakStart ? 1 : 0);
      return {
        kind: 'teaching',
        session: session.name,
        week,
        short: `W${week}`,
        long: `${session.name} Week ${week}`,
      };
    }

    if (
      monday >= startOfWeek(parseISO(session.stuvacStart), WEEK_STARTS_ON) &&
      monday <= parseISO(session.stuvacEnd)
    ) {
      return {
        kind: 'stuvac',
        session: session.name,
        short: 'STUVAC',
        long: `${session.name} study vacation`,
      };
    }

    if (
      monday >= startOfWeek(parseISO(session.examsStart), WEEK_STARTS_ON) &&
      monday <= parseISO(session.examsEnd)
    ) {
      return {
        kind: 'exams',
        session: session.name,
        short: 'Exams',
        long: `${session.name} exam period`,
      };
    }
  }

  return { kind: 'off', short: '–', long: 'Outside semester' };
}
