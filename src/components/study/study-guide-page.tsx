import Link from 'next/link';
import { ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { PracticeQuestion, StudyGuide, Topic } from '@/lib/study/types';

const SYDNEY = 'Australia/Sydney';

const examDateFormat = new Intl.DateTimeFormat('en-AU', {
  timeZone: SYDNEY,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const examTimeFormat = new Intl.DateTimeFormat('en-AU', {
  timeZone: SYDNEY,
  hour: 'numeric',
  minute: '2-digit',
});

// en-CA formats as YYYY-MM-DD, which Date.parse reads as midnight UTC.
const sydneyDayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: SYDNEY });

/** Whole calendar days between two instants, counted on the Sydney calendar. */
function sydneyDaysBetween(from: Date, to: Date): number {
  const day = (date: Date) => Date.parse(sydneyDayFormat.format(date));
  return Math.round((day(to) - day(from)) / 86_400_000);
}

function countdownLabel(days: number): string {
  if (days > 1) return `${days} days away`;
  if (days === 1) return 'Tomorrow';
  if (days === 0) return 'Today';
  return 'Finished';
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

const sectionHeading = 'text-lg font-semibold tracking-tight scroll-mt-20';
const subHeading = 'text-sm font-semibold';
const bulletList = 'list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-muted-foreground';

/**
 * Full exam guide for one course: exam logistics, what the markers want, the
 * content week by week, and the practice questions. `now` is passed in by the
 * route so the countdown is computed per request.
 */
export function StudyGuidePage({ guide, now }: { guide: StudyGuide; now: Date }) {
  const { exam } = guide;
  const examStart = new Date(exam.startsAt);
  const totalPoints = exam.sections.reduce((sum, section) => sum + section.points, 0);
  const canvasBaseUrl = process.env.NEXT_PUBLIC_CANVAS_BASE_URL;

  const facts = [
    { label: 'Date', value: examDateFormat.format(examStart) },
    { label: 'Start', value: `${examTimeFormat.format(examStart)}, arrive by ${exam.arriveBy}` },
    {
      label: 'Length',
      value: `${formatDuration(exam.durationMinutes)}, including ${exam.readingMinutes} min reading time`,
    },
    { label: 'Worth', value: `${exam.weight}% of the unit` },
    { label: 'Venue', value: exam.venue },
    { label: 'Format', value: exam.mode },
  ];

  return (
    <article className="mx-auto max-w-3xl space-y-12 pb-16">
      <header className="space-y-3">
        <Link
          href="/study"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Study
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{guide.courseCode} final exam</h1>
        <p className="text-muted-foreground">
          {guide.courseName} · {countdownLabel(sydneyDaysBetween(now, examStart))}
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
          {[
            ['#exam', 'The exam'],
            ['#marking', 'What markers want'],
            ['#topics', 'Topics by week'],
            ['#practice', 'Practice questions'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="underline underline-offset-4 hover:text-muted-foreground">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="space-y-6">
        <h2 id="exam" className={sectionHeading}>
          The exam
        </h2>

        <dl className="grid gap-x-8 border-y sm:grid-cols-2">
          {facts.map(fact => (
            <div key={fact.label} className="border-b py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
              <dt className="text-xs text-muted-foreground">{fact.label}</dt>
              <dd className="text-sm font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-2">
          <h3 className={subHeading}>Paper structure</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 font-normal">Section</th>
                <th className="py-2 text-right font-normal">Questions</th>
                <th className="py-2 text-right font-normal">Points</th>
                <th className="py-2 text-right font-normal">Suggested time</th>
              </tr>
            </thead>
            <tbody>
              {exam.sections.map(section => (
                <tr key={section.name} className="border-b">
                  <td className="py-2">{section.name}</td>
                  <td className="py-2 text-right tabular-nums">{section.questions}</td>
                  <td className="py-2 text-right tabular-nums">{section.points}</td>
                  <td className="py-2 text-right tabular-nums">{section.recommendedMinutes} min</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-medium">
                <td className="py-2">Total</td>
                <td className="py-2 text-right tabular-nums">
                  {exam.sections.reduce((sum, section) => sum + section.questions, 0)}
                </td>
                <td className="py-2 text-right tabular-nums">{totalPoints}</td>
                <td className="py-2 text-right tabular-nums">
                  {exam.sections.reduce((sum, section) => sum + section.recommendedMinutes, 0)} min
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-2">
          <h3 className={subHeading}>Conditions</h3>
          <ul className={bulletList}>
            {exam.conditions.map(condition => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 id="marking" className={sectionHeading}>
          What markers want
        </h2>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className={subHeading}>They are looking for</h3>
            <ul className={bulletList}>
              {guide.expectations.map(expectation => (
                <li key={expectation}>{expectation}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className={subHeading}>You will not be asked for</h3>
            <ul className={bulletList}>
              {guide.notAsked.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className={subHeading}>The lecturer&apos;s exam advice</h3>
          <ol className="space-y-3 text-sm leading-relaxed">
            {guide.advice.map((tip, index) => (
              <li key={tip.title} className="flex gap-3">
                <span className="w-4 shrink-0 tabular-nums text-muted-foreground">{index + 1}</span>
                <span>
                  <span className="font-medium">{tip.title}.</span> {tip.detail}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 id="topics" className={sectionHeading}>
            Topics by week
          </h2>
          <p className="text-sm text-muted-foreground">
            Each week is split the way the lecturer says to revise: concepts to explain, frameworks to apply,
            challenges to assess a situation with, and strategies to respond.
          </p>
        </div>
        <div className="border-t">
          {guide.topics.map(topic => (
            <TopicSection key={topic.week} topic={topic} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 id="practice" className={sectionHeading}>
            Practice questions
          </h2>
          <p className="text-sm text-muted-foreground">{guide.practiceNote}</p>
        </div>
        <div className="border-t">
          {guide.practiceQuestions.map(question => (
            <PracticeQuestionSection key={question.title} question={question} />
          ))}
        </div>
      </section>

      <footer className="space-y-2 border-t pt-4 text-xs text-muted-foreground">
        <p>Built from: {guide.sources.join('; ')}.</p>
        <p>
          If anything here conflicts with the exam paper, the exam timetable or an official University page, follow
          the official information.
        </p>
        {canvasBaseUrl && (
          <a
            href={`${canvasBaseUrl}/courses/${guide.canvasCourseId}/modules`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground"
          >
            Open {guide.courseCode} modules in Canvas
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </footer>
    </article>
  );
}

const disclosureSummary =
  'flex cursor-pointer list-none items-baseline gap-3 py-3 hover:text-muted-foreground [&::-webkit-details-marker]:hidden';

function TopicSection({ topic }: { topic: Topic }) {
  return (
    <details id={`week-${topic.week}`} className="group scroll-mt-20 border-b">
      <summary className={disclosureSummary}>
        <ChevronRight className="h-4 w-4 shrink-0 self-center transition-transform group-open:rotate-90" />
        <span className="w-16 shrink-0 text-sm tabular-nums text-muted-foreground">Week {topic.week}</span>
        <span className="font-medium">{topic.title}</span>
      </summary>

      <div className="space-y-6 pb-8 pl-7">
        <p className="text-sm leading-relaxed text-muted-foreground">{topic.summary}</p>

        <div className="space-y-2">
          <h3 className={subHeading}>Concepts</h3>
          <dl className="space-y-3 text-sm leading-relaxed">
            {topic.concepts.map(concept => (
              <div key={concept.term}>
                <dt className="font-medium">{concept.term}</dt>
                <dd className="text-muted-foreground">{concept.definition}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-4">
          <h3 className={subHeading}>Frameworks</h3>
          {topic.frameworks.map(framework => (
            <div key={framework.name} className="space-y-1.5">
              <p className="text-sm">
                <span className="font-medium">{framework.name}</span>
                {framework.source && <span className="text-muted-foreground"> · {framework.source}</span>}
              </p>
              <ul className={bulletList}>
                {framework.points.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <BulletBlock title="Challenges" items={topic.challenges} />
        <BulletBlock title="Strategies" items={topic.strategies} />
        <BulletBlock title="Examples to quote" items={topic.examples} />

        {topic.reading && (
          <div className="space-y-1.5">
            <h3 className={subHeading}>Mandatory {topic.reading.kind}</h3>
            <p className="text-sm text-muted-foreground">{topic.reading.citation}</p>
            <ul className={bulletList}>
              {topic.reading.takeaways.map(takeaway => (
                <li key={takeaway}>{takeaway}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}

function BulletBlock({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className={subHeading}>{title}</h3>
      <ul className={bulletList}>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function PracticeQuestionSection({ question }: { question: PracticeQuestion }) {
  return (
    <div className="space-y-3 border-b py-5">
      <h3 className="font-medium">{question.title}</h3>
      {question.scenario && <p className="text-sm leading-relaxed text-muted-foreground">{question.scenario}</p>}

      <ol className="space-y-2 text-sm leading-relaxed">
        {question.parts.map((part, index) => (
          <li key={part} className="flex gap-3">
            <span className="w-4 shrink-0 text-muted-foreground">{String.fromCharCode(97 + index)})</span>
            <span>{part}</span>
          </li>
        ))}
      </ol>

      <details className="group">
        <summary className={`${disclosureSummary} py-1 text-sm`}>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 self-center transition-transform group-open:rotate-90" />
          Material to draw on
        </summary>
        <div className="space-y-2 pl-6 pt-1">
          <ul className={bulletList}>
            {question.drawOn.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Revise:{' '}
            {question.weeks.map((week, index) => (
              <span key={week}>
                {index > 0 && ', '}
                <a href={`#week-${week}`} className="underline underline-offset-4 hover:text-foreground">
                  Week {week}
                </a>
              </span>
            ))}
          </p>
        </div>
      </details>
    </div>
  );
}
