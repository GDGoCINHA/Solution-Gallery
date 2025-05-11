import { useEffect, useState } from 'react';

/**
 * useMediaQuery - React hook for media query matching
 * @param query - media query string
 * @returns boolean - whether the query matches
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
    // eslint-disable-next-line
  }, [query]);

  return matches;
} 