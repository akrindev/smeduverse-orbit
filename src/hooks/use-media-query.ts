"use client";

import { useEffect, useState } from "react";

// Hook that returns true if the media query matches
export function useMediaQuery(query: string): boolean {
  // Default to false during SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create the media query list
    const media = window.matchMedia(query);

    // Set the initial value
    setMatches(media.matches);

    // Define our event listener
    const listener = () => {
      setMatches(media.matches);
    };

    // Add the event listener
    media.addEventListener("change", listener);

    // Clean up
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
