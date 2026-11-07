import React, { useCallback, useEffect, useRef, useState } from "react";
import { StatCounter } from "./stat-counter";
import {
  AUTO_ADVANCE_INTERVAL_MS,
  PillarProgressIndicator,
} from "./pillar-progress-indicator";

export type PillarVisualMode =
  | "cold-chain"
  | "symposia-bars"
  | "archipelago-routes"
  | "governance-ring"
  | "education-matrix"
  | "continuity-dial";

export interface CapabilityPillar {
  readonly id: string;
  readonly indexLabel: string;
  readonly tag: string;
  readonly title: string;
  readonly statLabel: string;
  readonly statDisplay: string;
  readonly statPrimaryValue: number;
  readonly statSecondaryValue?: number;
  readonly statSeparator?: string;
  readonly statPrefix?: string;
  readonly statSuffix?: string;
  readonly summary: string;
  readonly points: readonly string[];
  readonly imageSrc: string;
  readonly visualMode: PillarVisualMode;
}

export interface CapabilityStageCardProps {
  readonly pillar: CapabilityPillar;
  readonly onFindOutMore: (pillar: CapabilityPillar) => void;
  readonly className?: string;
}

export interface WhatWeDoStageProps {
  readonly pillars?: readonly CapabilityPillar[];
  readonly autoAdvanceMs?: number;
  readonly onOpenModal?: (pillar: CapabilityPillar) => void;
}

const PROGRESS_TICK_MS = 50;
const FIRST_INDEX = 0;
const INDEX_STEP = 1;
const FULL_PROGRESS = 1;

export const MEDIQ_CAPABILITY_PILLARS: readonly CapabilityPillar[] = [
  {
    id: "supply-chain",
    indexLabel: "01",
    tag: "Supply Chain",
    title: "Strategic Importation & Distribution",
    statLabel: "Cold-chain dispatch",
    statDisplay: "24–48 hours",
    statPrimaryValue: 24,
    statSecondaryValue: 48,
    statSeparator: "–",
    statSuffix: " hours",
    summary:
      "Direct manufacturer sourcing from Rayner UK and global partners with GDP-certified customs clearance and cleanroom-grade buffer reserves.",
    points: [
      "Direct manufacturer importation & customs clearance",
      "Cleanroom-grade sterile IOL & OVD inventory reserves",
      "2–8 °C validated cold-chain telemetry & dispatch",
      "End-to-end port-of-entry to operating-room tracking",
    ],
    imageSrc: "assets/img/pillars/p1_cleanroom_inspect.jpg",
    visualMode: "cold-chain",
  },
  {
    id: "commercial",
    indexLabel: "02",
    tag: "Commercial",
    title: "Product Marketing & Brand Development",
    statLabel: "Academic symposia",
    statDisplay: "25+ per year",
    statPrimaryValue: 25,
    statSuffix: "+ per year",
    summary:
      "Clinical-first brand architecture connecting global ophthalmic breakthroughs with Philippine surgeons through scientific congresses and peer roundtables.",
    points: [
      "Evidence-based clinical positioning & brand strategy",
      "Surgeon scientific symposia & key opinion leader boards",
      "PAO annual congress & regional society exhibitions",
      "National launch programs for next-generation IOLs",
    ],
    imageSrc: "assets/img/pillars/p2_headquarters_brand.jpg",
    visualMode: "symposia-bars",
  },
  {
    id: "field-network",
    indexLabel: "03",
    tag: "Field Network",
    title: "Nationwide Clinical & Sales Coverage",
    statLabel: "Archipelago reach",
    statDisplay: "17 regions",
    statPrimaryValue: 17,
    statSuffix: " regions",
    summary:
      "Dedicated ophthalmic specialists embedded across Luzon, Visayas, and Mindanao managing operating-room consignment and surgical suite detailing.",
    points: [
      "Direct operating-room & surgical-suite clinical detailing",
      "Hospital & ambulatory surgical center (ASC) consignment",
      "Dedicated regional hubs in Manila, Cebu, and Davao",
      "Complete coverage across all 17 Philippine regions",
    ],
    imageSrc: "assets/img/pillars/p3_specialist_discussion.jpg",
    visualMode: "archipelago-routes",
  },
  {
    id: "governance",
    indexLabel: "04",
    tag: "Governance",
    title: "Regulatory Compliance & QA",
    statLabel: "Regulatory audits",
    statDisplay: "100% pass",
    statPrimaryValue: 100,
    statSuffix: "% pass",
    summary:
      "Every medical device is Philippine FDA-registered, batch-traceable, and stored under audited Good Distribution Practice (GDP) protocols.",
    points: [
      "Philippine FDA CDRR product registration & lifecycle QA",
      "100% audit compliance across GDP & ISO quality gates",
      "24/7 automated thermal mapping & lot traceability",
      "Proactive post-market surveillance & pharmacovigilance",
    ],
    imageSrc: "assets/img/pillars/p6_quality_metrology.jpg",
    visualMode: "governance-ring",
  },
  {
    id: "professional-dev",
    indexLabel: "05",
    tag: "Professional Dev",
    title: "Clinical & Surgical Education",
    statLabel: "Surgeons trained",
    statDisplay: "500+ fellows",
    statPrimaryValue: 500,
    statSuffix: "+ fellows",
    summary:
      "Hands-on microsurgical wet labs, toric alignment workshops, and phacoemulsification masterclasses elevating outcomes for residents and fellows.",
    points: [
      "Hands-on dry & wet lab microsurgical training modules",
      "Toric & EDOF biometry calculation masterclasses",
      "Accredited continuing medical education (CME) workshops",
      "Live & recorded surgical case review fellowships",
    ],
    imageSrc: "assets/img/pillars/p5_theatre_wetlab.jpg",
    visualMode: "education-matrix",
  },
  {
    id: "continuity",
    indexLabel: "06",
    tag: "Continuity",
    title: "Comprehensive Post-Market Support",
    statLabel: "Service SLA",
    statDisplay: "24/7 priority",
    statPrimaryValue: 24,
    statSecondaryValue: 7,
    statSeparator: "/",
    statSuffix: " priority",
    summary:
      "Continuous post-implantation partnership featuring optical biometry optimization, equipment calibration, and a 24/7 surgical support hotline.",
    points: [
      "Preventive equipment calibration & theatre in-service",
      "Custom A-constant & optical biometry consultation",
      "Real-time RayPRO patient outcome feedback loops",
      "24/7 priority clinical & technical response SLA",
    ],
    imageSrc: "assets/img/pillars/p6_lot_traceability.jpg",
    visualMode: "continuity-dial",
  },
];

export const CapabilityStageCard: React.FC<CapabilityStageCardProps> = ({
  pillar,
  onFindOutMore,
  className = "",
}) => {
  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#3aa0db]/30 bg-[#081734]/85 p-5 sm:p-6 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,10,28,0.75)] ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3aa0db]/35 bg-[#3aa0db]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#72c5f8]">
            <span>Pillar {pillar.indexLabel}</span>
            <span aria-hidden="true">•</span>
            <span>{pillar.tag}</span>
          </span>
          <h3 className="mt-2.5 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {pillar.title}
          </h3>
        </div>

        <StatCounter
          value={pillar.statPrimaryValue}
          secondaryValue={pillar.statSecondaryValue}
          separator={pillar.statSeparator}
          prefix={pillar.statPrefix}
          suffix={pillar.statSuffix}
          label={pillar.statLabel}
          className="sm:items-end sm:text-right"
        />
      </div>

      <div className="my-4 flex-1 min-h-[180px] rounded-xl border border-[#3aa0db]/20 bg-[#051026]/90 p-4">
        <p className="text-sm leading-relaxed text-[#f6f2ea]/85">{pillar.summary}</p>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {pillar.points.map((pt, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-[#f6f2ea]/90"
            >
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#3aa0db]" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#f6f2ea]/60">
          {pillar.statLabel} • <strong className="text-[#72c5f8]">{pillar.statDisplay}</strong>
        </span>
        <button
          type="button"
          onClick={() => onFindOutMore(pillar)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#3aa0db]/45 bg-[#3aa0db]/15 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#3aa0db] hover:text-[#061229] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8]"
        >
          <span>Find out more</span>
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const WhatWeDoStage: React.FC<WhatWeDoStageProps> = ({
  pillars = MEDIQ_CAPABILITY_PILLARS,
  autoAdvanceMs = AUTO_ADVANCE_INTERVAL_MS,
  onOpenModal,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(FIRST_INDEX);
  const [cycleProgress, setCycleProgress] = useState<number>(FIRST_INDEX);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectPillar = useCallback(
    (nextIndex: number, focusTab = false) => {
      const normalized = (nextIndex + pillars.length) % pillars.length;
      setActiveIndex(normalized);
      setCycleProgress(FIRST_INDEX);
      if (focusTab && tabRefs.current[normalized]) {
        tabRefs.current[normalized]?.focus();
      }
    },
    [pillars.length]
  );

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || isPaused || autoAdvanceMs <= FIRST_INDEX) {
      return;
    }

    const timer = window.setInterval(() => {
      setCycleProgress((prev) => {
        const next = prev + PROGRESS_TICK_MS / autoAdvanceMs;
        if (next >= FULL_PROGRESS) {
          setActiveIndex((cur) => (cur + INDEX_STEP) % pillars.length);
          return FIRST_INDEX;
        }
        return next;
      });
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(timer);
  }, [autoAdvanceMs, isPaused, pillars.length]);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectPillar(activeIndex + INDEX_STEP, true);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectPillar(activeIndex - INDEX_STEP, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectPillar(FIRST_INDEX, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectPillar(pillars.length - INDEX_STEP, true);
    }
  };

  const activePillar = pillars[activeIndex] ?? pillars[FIRST_INDEX];

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-full min-h-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="lg:col-span-5 flex flex-col justify-between gap-2.5 min-h-0">
        <div
          role="tablist"
          aria-label="Core Capabilities & Clinical Network Pillars"
          onKeyDown={handleTabKeyDown}
          className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible flex-1 min-h-0"
        >
          {pillars.map((pillar, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={pillar.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                id={`wwd-tab-${pillar.id}`}
                aria-selected={isSelected}
                aria-controls="wwd-stage-tabpanel"
                tabIndex={isSelected ? FIRST_INDEX : -INDEX_STEP}
                onClick={() => selectPillar(idx)}
                className={`relative flex flex-col justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer shrink-0 w-[260px] lg:w-full lg:flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72c5f8] ${
                  isSelected
                    ? "border-[#3aa0db]/65 bg-[#0c224a]/90 text-white shadow-[0_0_24px_rgba(58,160,219,0.2)]"
                    : "border-white/10 bg-[#071530]/60 text-[#f6f2ea]/75 hover:border-[#3aa0db]/35"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#72c5f8]">
                    {pillar.indexLabel} • {pillar.tag}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-white/90">
                    {pillar.statDisplay}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                  {pillar.title}
                </div>
              </button>
            );
          })}
        </div>

        <PillarProgressIndicator
          totalPillars={pillars.length}
          activeIndex={activeIndex}
          cycleProgress={cycleProgress}
          isPaused={isPaused}
          onSelectPillar={(idx) => selectPillar(idx)}
        />
      </div>

      <div
        id="wwd-stage-tabpanel"
        role="tabpanel"
        aria-labelledby={`wwd-tab-${activePillar.id}`}
        aria-live="polite"
        className="lg:col-span-7 min-h-0 h-full"
      >
        <CapabilityStageCard
          pillar={activePillar}
          onFindOutMore={(p) => onOpenModal?.(p)}
        />
      </div>
    </div>
  );
};

export default WhatWeDoStage;

