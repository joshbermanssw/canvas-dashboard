import type { PracticeQuestion, StudyGuide } from '../types';
import { week01, week01Practice } from './week01';
import { week02, week02Practice } from './week02';
import { week03, week03Practice } from './week03';
import { week04, week04Practice } from './week04';
import { week05, week05Practice } from './week05';
import { week06, week06Practice } from './week06';
import { week07, week07Practice } from './week07';
import { week08, week08Practice } from './week08';
import { week09, week09Practice } from './week09';
import { week10, week10Practice } from './week10';
import { week11, week11Practice } from './week11';

/** The four sample questions the lecturer worked through in the Week 12 exam briefing. */
const sampleQuestions: PracticeQuestion[] = [
  {
    title: 'Sample 1: multiple choice (queues)',
    scenario:
      'Jobs arrive at a system at an irregular rate, and each job takes 2 seconds to run. Which statement is correct?',
    parts: [
      'The system sometimes has jobs waiting in a queue.',
      'The system will never have queuing jobs.',
      'The system will have jobs queuing after 1200 seconds.',
      'The system will always have jobs queuing.',
    ],
    weeks: [8],
    answer: [
      'The first option. Irregular arrivals mean some jobs arrive while another is still running, so a queue forms some of the time, but not always and not at a fixed moment.',
    ],
  },
  {
    title: 'Sample 2: fill in the blanks (REST)',
    scenario: 'List two of the commonly used HTTP verbs in RESTful services.',
    parts: [],
    weeks: [7],
    answer: ['Any two of GET, PUT, POST and DELETE.'],
  },
  {
    title: 'Sample 3: calculation (operational laws and bounds)',
    scenario:
      'An internal web application was monitored for 10 minutes. 40 users worked continuously, each thinking for 4 seconds on average between a response and the next request. The system completed 4,800 requests. Measured utilisations were CPU 50% and database server 80%.',
    parts: [
      'Calculate the throughput and the mean response time during the observation.',
      'Calculate the service demand at each resource and identify the bottleneck.',
      '80 users are expected. Use the performance bounds to estimate the throughput and response time, and say which resource you would improve first and why.',
    ],
    weeks: [8],
    answer: [
      'Throughput X = 4,800 requests ÷ 600 s = 8 requests/s. Interactive response-time law: R = N/X − Z = 40/8 − 4 = 1 s.',
      'Utilisation law U = X × D, so D = U/X. CPU: 0.50/8 = 0.0625 s (62.5 ms). Database: 0.80/8 = 0.100 s (100 ms). The database has the largest demand, so it is the bottleneck.',
      'X ≤ min(1/Dmax, N/(D + Z)) = min(1/0.1, 80/4.1625) = min(10, 19.2), so at most about 10 requests/s. R ≥ N × Dmax − Z = 80 × 0.1 − 4 = 4 s. Improve the database first: a faster CPU does not raise the 10 requests/s limit. These are bounds, not guarantees.',
    ],
  },
  {
    title: 'Sample 4: integrative (group project)',
    scenario:
      'In the group project you integrated subsystems into the store application. The lecturer says this one is for illustration only: if the group project appears on the exam, the specific scenario will be provided.',
    parts: [
      'Discuss, with concrete details, one failure scenario your design was intended to handle, showing what your group did or should have done. You may use notations such as UML diagrams.',
    ],
    weeks: [4, 6, 9],
    drawOn: [
      'Failures are normal: processes crash, messages are redelivered and calls time out.',
      'Retries are safe only if the operation is idempotent.',
      'Across services, the choice is a distributed transaction (two-phase commit) or a saga with compensating actions.',
      'With messaging and transactions together, say what is committed and when the message is acknowledged.',
      'Tie the choice back to the non-functional requirement it protects, such as availability or consistency.',
    ],
  },
];

/**
 * COMP4348/5348 final exam guide. The exam details and sample questions come
 * from the Week 12 lecture; each week's file is built from that week's lecture
 * slides, lecture notes and tutorial material.
 */
export const comp4348: StudyGuide = {
  slug: 'comp4348',
  courseCode: 'COMP4348',
  courseName: 'Enterprise Scale Software Architecture',
  canvasCourseId: 73762,

  exam: {
    startsAt: '2026-11-23T09:00:00+11:00',
    durationMinutes: 130,
    readingMinutes: 10,
    weight: 60,
    mode: 'Paper exam, restricted open book',
    venue: 'Check your exam timetable',
    sections: [
      {
        name: 'Multiple choice',
        questions: 10,
        detail: 'Various topics. Choose the one correct answer and mark it on the bubble sheet.',
      },
      { name: 'Fill in the blanks', detail: 'Various topics. Write one or more words or numbers.' },
      {
        name: 'Calculation questions',
        detail:
          'Multiple parts. Calculate, explain, and use the calculation to infer a design decision. Show intermediate steps for partial marks.',
      },
      {
        name: 'Scenario questions',
        detail:
          'Multiple parts. Decide, explain, discuss or justify by applying and linking what you know to the information provided.',
      },
      {
        name: 'Integrative questions',
        detail:
          'Multiple parts across several topics. Compare options and connect technologies with types of non-functional requirements.',
      },
    ],
    conditions: [
      'Restricted open book: you may bring one double-sided A4 sheet of handwritten and/or typed notes.',
      'A non-programmable calculator is allowed. It must be an approved calculator with its sticker on.',
      'A bilingual dictionary is allowed.',
      'Bring your physical student ID, plus pens, pencils and an eraser.',
      'Answer above the line or in the box given. If you run out of space, use the additional answer space at the end of the paper.',
      'Multiple choice answers go on the bubble sheet.',
      'The exam is marked out of 100. School of Computer Science policy: you need at least 40% on the exam and at least 50% overall to pass the unit.',
    ],
  },

  expectations: [
    'Intermediate steps in every calculation, because they earn partial marks.',
    'Succinct answers: quality, not quantity.',
    'Answers that use the scenario information provided, even when the question is open.',
    'Bullet points when you are asked to list features. They are quicker to write and easier to mark.',
    'Every design decision justified from the requirements.',
    'Emphasis similar to the lectures, labs and assignments. The lecturer says the exam will not be a surprise.',
  ],

  notAsked: [
    'The Week 13 industry guest lecture. Everything from Weeks 1 to 12 is examinable: lecture slides, labs and tutorials, with the assignments and group project there to help understanding.',
  ],

  advice: [
    {
      title: 'Use the reading time to plan',
      detail:
        'Check you understand each question, decide how much time each one gets, and plan the order. Starting with the easier questions is fine.',
    },
    {
      title: 'Answer everything',
      detail: 'Collect the easy marks first. A short, correct answer beats a long one.',
    },
    {
      title: 'Write clearly, in the space given',
      detail: 'Plan each answer on the rough-work pages, then write it in the specified space.',
    },
    {
      title: 'Ask the five architect questions of any scenario',
      detail:
        'What are the functional and non-functional requirements? Which components, and what is each responsible for? How do they communicate, and why that way? Where is the state, and how is it kept correct? What happens on failure, and how does it behave under load?',
    },
    {
      title: 'Sort out the logistics early',
      detail:
        'Find the room before exam day and arrive with plenty of time. Bring spare black or blue pens, water and your student ID, which goes on the desk.',
    },
    {
      title: 'If you are unwell',
      detail:
        'You can request special consideration through the usual University process. If you become sick during the exam, raise your hand and speak to the invigilator.',
    },
  ],

  frameworksHeading: 'Methods and patterns',
  examplesHeading: 'Examples',
  topicsNote:
    'Each week has the terms a multiple choice or fill-in-the-blank question could ask for, the methods and patterns to apply in a scenario, and the formulas a calculation question could need.',

  topics: [week01, week02, week03, week04, week05, week06, week07, week08, week09, week10, week11],

  practiceNote:
    'The first four are the sample questions from the Week 12 exam briefing. The rest are tutorial and lecture-note questions, restated, with answers from the course solutions.',

  practiceQuestions: [
    ...sampleQuestions,
    ...week01Practice,
    ...week02Practice,
    ...week03Practice,
    ...week04Practice,
    ...week05Practice,
    ...week06Practice,
    ...week07Practice,
    ...week08Practice,
    ...week09Practice,
    ...week10Practice,
    ...week11Practice,
  ],

  sources: [
    'COMP4348/5348 Lecture 12: Recap and exam information',
    'COMP4348/5348 lecture slides and lecture notes, Weeks 1–11',
    'COMP4348/5348 tutorial sheets, notes and answers',
  ],
};
