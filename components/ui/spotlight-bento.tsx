/// <reference path="./types.d.ts" />
"use client";

import React, { useRef, useState } from "react";
import { cn } from "../../lib/utils";

export interface SpotlightBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  spotlightColor?: string;
  accentColor?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
}

/**
 * 21st.dev Spotlight Card + Bento Grid Component
 * Integrated with MediQ × Rayner Ophthalmic Color Palette (#0b1a33 Ink, #3aa0db Sky, #c4006b Magenta, #e8562a Ray Orange)
 */
export const SpotlightBentoCard: React.FC<SpotlightBentoCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(58, 160, 219, 0.18)",
  accentColor = "#3aa0db",
  badge,
  title,
  subtitle,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2);
    divRef.current.style.setProperty("--rotation", `${angle}rad`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      style={{
        "--card-accent": accentColor,
      } as React.CSSProperties}
      className={cn(
        "info-card-shell relative overflow-hidden rounded-2xl bg-[#0b1a33] p-6 text-[#f6f2ea] shadow-2xl transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* 21st.dev Cursor-Tracking Radial Spotlight Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(520px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 45%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        {(badge || title || subtitle) && (
          <div className="mb-4">
            {badge && (
              <span
                className="inline-block rounded-md px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em]"
                style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
              >
                {badge}
              </span>
            )}
            {title && (
              <h4 className="mt-2 font-serif text-2xl text-[#f3efe7] sm:text-3xl">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="mt-1 text-xs leading-relaxed text-[#f6f2ea]/70">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default SpotlightBentoCard;

