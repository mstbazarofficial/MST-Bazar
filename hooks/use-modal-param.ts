"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function useModalParam(paramKey: string = "editId") {
  const searchParams = useSearchParams();
  const urlValue = searchParams.get(paramKey);

  // 1. Local state for immediate 0ms UI feedback
  const [value, setValue] = useState<string | null>(urlValue);

  // Track previous URL value to detect external changes (e.g. Next.js revalidation)
  const [prevUrlValue, setPrevUrlValue] = useState<string | null>(urlValue);

  // 2. Adjust state during render when searchParams changes (NO useEffect needed)
  if (urlValue !== prevUrlValue) {
    setPrevUrlValue(urlValue);
    setValue(urlValue);
  }

  // Track if history entry was pushed by this modal in current session
  const pushedRef = useRef(false);

  // 3. Open or Close handler
  const setParam = useCallback(
    (newValue: string | null) => {
      // Instant React state update
      setValue(newValue);

      if (newValue) {
        // OPENING: Push browser history state
        const url = new URL(window.location.href);
        url.searchParams.set(paramKey, newValue);

        window.history.pushState(
          { modalKey: paramKey, value: newValue },
          "",
          url.toString(),
        );
        pushedRef.current = true;
      } else {
        // CLOSING
        if (pushedRef.current) {
          pushedRef.current = false;
          // Step back in history to clean up pushed entry
          window.history.back();
        } else {
          // Direct URL entry or page reload fallback
          const url = new URL(window.location.href);
          url.searchParams.delete(paramKey);
          window.history.replaceState(null, "", url.toString());
        }
      }
    },
    [paramKey],
  );

  // 4. Handle Mobile Back Gesture & Browser Back/Forward Buttons
  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const val = currentParams.get(paramKey);

      setValue(val);
      if (!val) {
        pushedRef.current = false;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [paramKey]);

  return [value, setParam] as const;
}
