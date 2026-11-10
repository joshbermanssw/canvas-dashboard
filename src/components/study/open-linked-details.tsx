'use client';

import { useEffect } from 'react';

/**
 * Opens the <details> block that the URL hash points at, on load and whenever
 * the hash changes. Without it, a "Revise: Week 7" link scrolls to a week that
 * is still folded shut.
 */
export function OpenLinkedDetails() {
  useEffect(() => {
    const openTarget = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };

    openTarget();
    window.addEventListener('hashchange', openTarget);
    return () => window.removeEventListener('hashchange', openTarget);
  }, []);

  return null;
}
