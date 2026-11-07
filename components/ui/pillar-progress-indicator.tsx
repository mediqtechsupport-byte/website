import React from "react";

export interface PillarProgressIndicatorProps {
  /** Total number of capability pillars */
  readonly totalPillars: number;
  /** Zero-based index of the currently active pillar */
  readonly activeIndex: number;
  /** Normalized progress (0 to 1) of the current auto-advance cycle */
  readonly cycleProgress: number;
  /** Whether auto-advance is currently paused (hover, focus, or reduced-motion) */
  readonly isPaused: boolean;
  /** Callback fired when a user selects a specific pillar index */
  readonly onSelectPillar?: (index: number) => void;
  /** Optional className override */
  readonly className?: string;
}

export const AUTO_ADVANCE_INTERVAL_MS = 7000;
const MIN_PROGRESS_RATIO = 0;
const MAX_PROGRESS_RATIO = 1;
const PERCENTAGE_MULTIPLIER = 100;
const INDEX_PAD_LENGTH = 2;
const DISPLAY_INDEX_OFFSET = 1;

function clampRatio(value: number): number {
  return Math.max(MIN_PROGRESS_RATIO, Math.min(MAX_PROGRESS_RATIO, value));
}

export const PillarProgressIndicator: React.FC<PillarProgressIndicatorProps> = ({
  totalPillars,
  activeIndex,
  cycleProgress,
  isPaused,
  onSelectPillar,
  className = "",
}) => {
  const clampedProgress = clampRatio(cycleProgress);
  const progressPercentage = (clampedProgress * PERCENTAGE_MULTIPLIER).toFixed(1);
  const currentNumberLabel = String(activeIndex + DISPLAY_INDEX_OFFSET).padStart(
    INDEX_PAD_LENGTH,
    "0"
  );
  const totalNumberLabel = String(totalPillars).padStart(INDEX_PAD_LENGTH, "0");

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border border-[#3aa0db]/25 bg-[#071530]/75 px-3.5 py-2 backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`size-2 rounded-full transition-colors ${
            isPaused ? "bg-amber-400/80" : "bg-[#3aa0db] shadow-[0_0_8px_#3aa0db]"
          }`}
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#f6f2ea]/75">
          {isPaused ? "Paused" : "Auto-Cycle"}
        </span>
      </div>

      <div className="flex flex-1 items-center gap-1.5" role="group" aria-label="Pillar sequence progress">
        {Array.from({ length: totalPillars }, (_, idx) => {
          const isCurrent = idx === activeIndex;
          const isCompleted = idx < activeIndex;
          const fillScale = isCurrent
            ? clampedProgress
            : isCompleted
            ? MAX_PROGRESS_RATIO
            : MIN_PROGRESS_RATIO;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPillar?.(idx)}
              aria-label={`Jump to pillar ${idx + DISPLAY_INDEX_OFFSET}`}
              className="group relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]"
            >
              <span
                className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#3aa0db] to-[#72c5f8] transition-transform duration-100 ease-linear"
                style={{ transform: `scaleX(${fillScale})` }}
              />
            </button>
          );
        })}
      </div>

      <span
        className="font-mono text-[11px] font-bold tracking-widest text-[#72c5f8] tabular-nums"
        aria-label={`Pillar ${currentNumberLabel} of ${totalNumberLabel}, ${progressPercentage}% cycle`}
      >
        {currentNumberLabel} / {totalNumberLabel}
      </span>
    </div>
  );
};

export default PillarProgressIndicator;

