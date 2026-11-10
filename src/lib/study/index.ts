import { comp4348 } from './comp4348';
import { infs1020 } from './infs1020';
import type { StudyGuide } from './types';

/** Every study guide on the site, in exam-date order. Add a new course by adding its guide here. */
export const studyGuides: StudyGuide[] = [comp4348, infs1020];

export function getStudyGuide(slug: string): StudyGuide | undefined {
  return studyGuides.find(guide => guide.slug === slug);
}
