import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StudyGuidePage } from '@/components/study/study-guide-page';
import { getStudyGuide } from '@/lib/study';

// Rendered per request so the "days away" countdown is never stale.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getStudyGuide((await params).slug);
  return { title: guide ? `${guide.courseCode} study guide` : 'Study guide' };
}

export default async function StudyGuide({ params }: Props) {
  const guide = getStudyGuide((await params).slug);
  if (!guide) notFound();

  return <StudyGuidePage guide={guide} now={new Date()} />;
}
