"use client";

import { useEffect, useState, type RefObject } from "react";

export function defaultMaxDpr(): number {
  return typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
}

export function sizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  maxDpr: number = 2
): number {
  const dpr = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    maxDpr
  );
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  return dpr;
}

export function useElementSize(ref: RefObject<HTMLElement | null>): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [ref]);

  return size;
}

