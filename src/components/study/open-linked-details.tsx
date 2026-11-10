'use client';

import { useEffect } from 'react';

/**
 * Opens the <details> block that the URL hash points at: on load, when the
 * hash changes, and when an in-page link is clicked (a repeat click on the same
 * link changes no hash). Without it, a "Revise: Week 7" link scrolls to a week
 * that is still folded shut.
 */
export function OpenLinkedDetails() {
  useEffect(() => {
    const open = (hash: string) => {
      const target = document.getElementById(hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    const onHashChange = () => open(window.location.hash);
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (link instanceof HTMLAnchorElement) open(link.hash);
    };

    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
