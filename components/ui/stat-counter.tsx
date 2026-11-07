import React, { useEffect, useRef, useState } from "react";

export interface StatCounterRange {
  readonly startTarget: number;
  readonly endTarget: number;
  readonly separator: string;
}

export interface StatCounterProps {
  /** Primary numeric target (or first number when rangeTarget is provided) */
  readonly value: number;
  /** Optional second numeric target for ranges such as "24–48" or "24/7" */
  readonly secondaryValue?: number;
  /** Separator between primary and secondary values (e.g., "–" or "/") */
  readonly separator?: string;
  /** Optional prefix (e.g., "< ") */
  readonly prefix?: string;
  /** Optional suffix (e.g., "+", "%", " hours", " regions") */
  readonly suffix?: string;
  /** Label displayed alongside or beneath the counter */
  readonly label: string;
  /** Animation duration in milliseconds */
  readonly durationMs?: number;
  /** Optional className override for the root container */
  readonly className?: string;
}

const DEFAULT_DURATION_MS = 950;
const CUBIC_EASE_EXPONENT = 3;
const FRAME_NORMALIZER = 1;

function easeOutCubic(progress: number): number {
  const clamped = Math.max(0, Math.min(FRAME_NORMALIZER, progress));
  return FRAME_NORMALIZER - Math.pow(FRAME_NORMALIZER - clamped, CUBIC_EASE_EXPONENT);
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  secondaryValue,
  separator = "–",
  prefix = "",
  suffix = "",
  label,
  durationMs = DEFAULT_DURATION_MS,
  className = "",
}) => {
  const [displayPrimary, setDisplayPrimary] = useState<number>(value);
  const [displaySecondary, setDisplaySecondary] = useState<number | undefined>(secondaryValue);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || durationMs <= 0) {
      setDisplayPrimary(value);
      setDisplaySecondary(secondaryValue);
      return;
    }

    const startTime = performance.now();
    setDisplayPrimary(0);
    if (typeof secondaryValue === "number") {
      setDisplaySecondary(0);
    } else {
      setDisplaySecondary(undefined);
    }

    const step = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(FRAME_NORMALIZER, elapsed / durationMs);
      const eased = easeOutCubic(rawProgress);

      setDisplayPrimary(Math.round(value * eased));
      if (typeof secondaryValue === "number") {
        setDisplaySecondary(Math.round(secondaryValue * eased));
      }

      if (rawProgress < FRAME_NORMALIZER) {
        rafRef.current = window.requestAnimationFrame(step);
      }
    };

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, secondaryValue, durationMs]);

  const formattedNumber =
    typeof secondaryValue === "number" && typeof displaySecondary === "number"
      ? `${prefix}${displayPrimary}${separator}${displaySecondary}${suffix}`
      : `${prefix}${displayPrimary}${suffix}`;

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#72c5f8]/80">
        {label}
      </span>
      <span
        className="font-extrabold tracking-tight text-white tabular-nums leading-none mt-1"
        style={{ fontSize: "clamp(2.25rem, 4vw, 3.75rem)" }}
      >
        {formattedNumber}
      </span>
    </div>
  );
};

export default StatCounter;

