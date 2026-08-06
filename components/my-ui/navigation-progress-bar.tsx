"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const navigationStateRef = useRef({
    isNavigating: false,
    delayTimeout: null as NodeJS.Timeout | null,
    animationIntervals: [] as NodeJS.Timeout[],
  });

  // --- Effect 1: Handle starting navigation on link clicks ---
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 1. FIX: Ignore clicks with modifier keys (open in new tab/window)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a");

      // 2. FIX: Ignore links that explicitly open in a new tab
      if (link && link.target === "_blank") return;

      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);

          if (
            url.origin === currentUrl.origin &&
            (url.pathname !== currentUrl.pathname ||
              url.search !== currentUrl.search) &&
            !url.hash
          ) {
            navigationStateRef.current.isNavigating = true;

            navigationStateRef.current.delayTimeout = setTimeout(() => {
              setIsVisible(true);
              setProgress(10);

              const intervals: NodeJS.Timeout[] = [];
              intervals.push(setTimeout(() => setProgress(50), 100));
              intervals.push(setTimeout(() => setProgress(80), 300));
              intervals.push(setTimeout(() => setProgress(90), 600));
              navigationStateRef.current.animationIntervals = intervals;
            }, 200);
          }
        } catch {}
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // --- Effect 2: Handle completing navigation on URL change ---
  useEffect(() => {
    const state = navigationStateRef.current;

    if (state.delayTimeout) clearTimeout(state.delayTimeout);
    state.animationIntervals.forEach(clearTimeout);

    if (state.isNavigating) {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setProgress(0), 300);
      }, 300);
    }

    state.isNavigating = false;
  }, [pathname, searchParams]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-100 transition-all duration-300 ease-out pointer-events-none"
      style={{
        width: `${progress}%`,
        opacity: isVisible ? 1 : 0,
        background: "linear-gradient(90deg, #059669, #10b981)",
      }}
    >
      <div className="absolute right-0 top-0 h-full w-32 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse" />
    </div>
  );
}
