"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useVisibleLoop(
  ref: RefObject<HTMLElement | null>,
  callback: (dt: number) => void,
  options: { enabled?: boolean } = {}
): void {
  const { enabled = true } = options;
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    let animId: number;
    let last = performance.now();
    let isVisible = true;
    const el = ref.current;

    const io =
      el && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
          })
        : null;

    if (el && io) io.observe(el);

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (isVisible) {
        cbRef.current(dt);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      io?.disconnect();
    };
  }, [ref, enabled]);
}

