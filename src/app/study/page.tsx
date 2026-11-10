import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { studyGuides } from '@/lib/study';

export const metadata: Metadata = { title: 'Study' };

/** Index of exam study guides, one per course. */
export default function Study() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <BookOpen className="h-6 w-6" />
        Study
      </h1>

      <ul className="border-t">
        {studyGuides.map(guide => (
          <li key={guide.slug} className="border-b">
            <Link
              href={`/study/${guide.slug}`}
              className="flex items-center justify-between gap-4 py-4 hover:text-muted-foreground"
            >
              <span>
                <span className="font-medium">{guide.courseCode}</span>
                <span className="text-muted-foreground"> · {guide.courseName}</span>
                <span className="block text-sm text-muted-foreground">
                  Final exam guide · {guide.topics.length} topics · {guide.practiceQuestions.length} practice
                  questions
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
