"use client";

import React, { forwardRef, useRef, useId, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lightbulb, Award, Clock, Handshake, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                            ANIMATED BEAM CORE                              */
/* -------------------------------------------------------------------------- */

export interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 2.8,
  delay = 0,
  pathColor = "#72c5f8",
  pathWidth = 1.6,
  pathOpacity = 0.16,
  gradientStartColor = "#38bdf8",
  gradientStopColor = "#6366f1",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [gradientCoords, setGradientCoords] = useState({
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%",
  });

  const updatePath = useCallback(() => {
    if (containerRef.current && fromRef.current && toRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const rectA = fromRef.current.getBoundingClientRect();
      const rectB = toRef.current.getBoundingClientRect();

      setSvgDimensions({
        width: containerRect.width,
        height: containerRect.height,
      });

      const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
      const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
      const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
      const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

      const controlX = (startX + endX) / 2;
      const controlY = (startY + endY) / 2 - curvature;
      const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
      setPathD(d);

      setGradientCoords({
        x1: `${startX}px`,
        y1: `${startY}px`,
        x2: `${endX}px`,
        y2: `${endY}px`,
      });
    }
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  useEffect(() => {
    updatePath();
    const resizeObserver = new ResizeObserver(() => updatePath());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", updatePath);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [updatePath, containerRef]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={gradientCoords.x1}
          y1={gradientCoords.y1}
          x2={gradientCoords.x2}
          y2={gradientCoords.y2}
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="25%" stopColor={gradientStartColor} stopOpacity="0.85" />
          <stop offset="65%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>

        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Static Subdued Baseline Path */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />

      {/* Framer Motion Animated Beam Path */}
      {pathD && (
        <motion.path
          d={pathD}
          stroke={`url(#${id})`}
          strokeWidth={pathWidth * 1.8}
          strokeLinecap="round"
          strokeDasharray="55 245"
          filter={`url(#glow-${id})`}
          initial={{ strokeDashoffset: reverse ? -300 : 300 }}
          animate={{ strokeDashoffset: reverse ? 300 : -300 }}
          transition={{
            duration,
            delay,
            ease: [0.45, 0.05, 0.55, 0.95],
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                               CIRCLE ELEMENT                               */
/* -------------------------------------------------------------------------- */

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; "aria-label"?: string }
>(({ className, children, "aria-label": ariaLabel }, ref) => {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#72c5f8]/25 bg-[#081836]/95 p-3 shadow-[0_8px_24px_rgba(2,8,23,0.55)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#72c5f8]/65 hover:shadow-[0_0_24px_rgba(56,189,248,0.28)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

/* -------------------------------------------------------------------------- */
/*                       MEDIQ CORE VALUES BEAM STAGE                         */
/* -------------------------------------------------------------------------- */

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null); // 01 Integrity
  const div2Ref = useRef<HTMLDivElement>(null); // 02 Innovation
  const div3Ref = useRef<HTMLDivElement>(null); // 03 Excellence
  const div4Ref = useRef<HTMLDivElement>(null); // Center (MEDIQ Official Logo)
  const div5Ref = useRef<HTMLDivElement>(null); // 04 Reliability
  const div6Ref = useRef<HTMLDivElement>(null); // 05 Partnership
  const div7Ref = useRef<HTMLDivElement>(null); // 06 Patient Focus

  return (
    <div
      ref={containerRef}
      className="relative flex w-full max-w-6xl items-center justify-center overflow-visible py-6"
    >
      <div className="relative z-10 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-12">
        {/* Left Values Column (01, 02, 03) */}
        <div className="flex flex-col justify-between gap-12">
          <div className="flex items-center justify-end gap-4 text-right">
            <div>
              <span className="font-mono text-xs font-semibold tracking-widest text-[#5eb2f6]">01</span>
              <h3 className="text-lg font-semibold text-[#f4f7fb]">Integrity</h3>
              <p className="text-sm text-[#9cb8d8]">Ethical and transparent conduct.</p>
            </div>
            <Circle ref={div1Ref} aria-label="Integrity">
              <ShieldCheck className="size-6 text-[#72c5f8]" strokeWidth={1.8} />
            </Circle>
          </div>

          <div className="flex items-center justify-end gap-4 text-right">
            <div>
              <span className="font-mono text-xs font-semibold tracking-widest text-[#5eb2f6]">02</span>
              <h3 className="text-lg font-semibold text-[#f4f7fb]">Innovation</h3>
              <p className="text-sm text-[#9cb8d8]">Progress through better ideas.</p>
            </div>
            <Circle ref={div2Ref} aria-label="Innovation">
              <Lightbulb className="size-6 text-[#38bdf8]" strokeWidth={1.8} />
            </Circle>
          </div>

          <div className="flex items-center justify-end gap-4 text-right">
            <div>
              <span className="font-mono text-xs font-semibold tracking-widest text-[#5eb2f6]">03</span>
              <h3 className="text-lg font-semibold text-[#f4f7fb]">Excellence</h3>
              <p className="text-sm text-[#9cb8d8]">Quality in every interaction.</p>
            </div>
            <Circle ref={div3Ref} aria-label="Excellence">
              <Award className="size-6 text-[#5eead4]" strokeWidth={1.8} />
            </Circle>
          </div>
        </div>

        {/* Central MEDIQ Hub Node */}
        <div className="flex min-w-[260px] items-center justify-center px-6">
          <div className="rounded-[30px] border border-[#72c5f8]/12 bg-[#0c234c]/45 p-2.5 shadow-[0_0_70px_rgba(56,156,244,0.26)]">
            <Circle
              ref={div4Ref}
              className="h-28 w-44 rounded-[22px] border-[#72c5f8]/35 bg-gradient-to-b from-[#0b2149] to-[#061430] px-5 py-4"
              aria-label="MEDIQ Pharma and Medical Supplies Distribution"
            >
              <img
                src="assets/img/fnd-partner-mq.png"
                alt="MEDIQ"
                className="h-auto w-full max-w-[136px] object-contain"
              />
            </Circle>
          </div>
        </div>

        {/* Right Values Column (04, 05, 06) */}
        <div className="flex flex-col justify-between gap-12">
          <div className="flex items-center justify-start gap-4 text-left">
            <Circle ref={div5Ref} aria-label="Reliability">
              <Clock className="size-6 text-[#93c5fd]" strokeWidth={1.8} />
            </Circle>
            <div>
              <span className="font-mono text-xs font-semibold tracking-widest text-[#5eb2f6]">04</span>
              <h3 className="text-lg font-semibold text-[#f4f7fb]">Reliability</h3>
              <p className="text-sm text-[#9cb8d8]">Dependable commitments.</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 text-left">
            <Circle ref={div6Ref} aria-label="Partnership">
              <Handshake className="size-6 text-[#60a5fa]" strokeWidth={1.8} />
            </Circle>
            <div>
              <span className="font-mono text-xs font-semibold tracking-widest text-[#5eb2f6]">05</span>
              <h3 className="text-lg font-semibold text-[#f4f7fb]">Partnership</h3>
              <p className="text-sm text-[#9cb8d8]">Shared growth and respect.</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4 text-left">
            <Circle ref={div7Ref} aria-label="Patient Focus">
              <HeartPulse className="size-6 text-[#7dd3fc]" strokeWidth={1.8} />
            </Circle>
            <div>
              <span className="font-mono text-xs font-semibold tracking-widest text-[#5eb2f6]">06</span>
              <h3 className="text-lg font-semibold text-[#f4f7fb]">Patient Focus</h3>
              <p className="text-sm text-[#9cb8d8]">Care as our ultimate purpose.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- LEFT NODES (01, 02, 03 -> MEDIQ Hub) --- */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-60}
        endYOffset={-10}
        gradientStartColor="#38bdf8"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        delay={0.5}
        gradientStartColor="#06b6d4"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={60}
        endYOffset={10}
        delay={1.0}
        gradientStartColor="#2dd4bf"
        gradientStopColor="#06b6d4"
      />

      {/* --- RIGHT NODES (04, 05, 06 -> MEDIQ Hub) --- */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-60}
        endYOffset={-10}
        delay={0.3}
        gradientStartColor="#60a5fa"
        gradientStopColor="#818cf8"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        delay={0.8}
        gradientStartColor="#38bdf8"
        gradientStopColor="#2563eb"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={60}
        endYOffset={10}
        delay={1.3}
        gradientStartColor="#72c5f8"
        gradientStopColor="#6366f1"
      />
    </div>
  );
}

export { AnimatedBeamDemo as Component };
export default AnimatedBeamDemo;

