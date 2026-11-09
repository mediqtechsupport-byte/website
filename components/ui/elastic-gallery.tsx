"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ElasticItemProps {
  id: string;
  title: string;
  category: string;
  description?: string;
  bgSrc: string;
  packshotSrc: string;
  alt: string;
}

const DEFAULT_OPHTEIS_ITEMS: ElasticItemProps[] = [
  {
    id: "01",
    title: "Ophteis® FR Pro",
    category: "ADAPTIVE OVD · 2.0% NaHA + SORBITOL",
    description:
      "Infused with Sorbitol antioxidant to neutralize free radicals during phacoemulsification, reducing endothelial cell loss by up to 28%.",
    bgSrc: "/assets/img/pillars/p1_cleanroom_inspect.jpg",
    packshotSrc: "/assets/img/packshots/ophteis_adaptive_clean.png",
    alt: "Ophteis FR Pro Box",
  },
  {
    id: "02",
    title: "Ophteis® Cohesive",
    category: "COHESIVE OVD · 500,000 mPa.s",
    description:
      "High molecular weight sodium hyaluronate with superior cohesive rheology for deep anterior chamber stability and controlled capsulorhexis.",
    bgSrc: "/assets/img/pillars/p5_microscope_education.jpg",
    packshotSrc: "/assets/img/packshots/ophteis_cohesive_clean.png",
    alt: "Ophteis Cohesive Box",
  },
  {
    id: "03",
    title: "Ophteis® Dispersive",
    category: "DISPERSIVE OVD · ENDOTHELIAL SHIELD",
    description:
      "Adheres tenaciously to corneal endothelial cells throughout phacoemulsification, shielding delicate tissues from surgical trauma and turbulence.",
    bgSrc: "/assets/img/pillars/p6_quality_metrology.jpg",
    packshotSrc: "/assets/img/packshots/ophteis_dispersive_clean.png",
    alt: "Ophteis Dispersive Box",
  },
];

function ElasticGallery({ items = DEFAULT_OPHTEIS_ITEMS }: { items?: ElasticItemProps[] }) {
  const [activeId, setActiveId] = useState<string | null>("01");

  return (
    <div className="w-full py-4">
      <div className="mx-auto flex h-[460px] w-full max-w-[1680px] flex-col overflow-hidden rounded-2xl border border-white/15 md:h-[365px] md:flex-row">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
            className={cn(
              "relative cursor-pointer overflow-hidden border-b border-white/25 bg-[#07132b] last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0",
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              activeId === item.id ? "flex-[4.5]" : "flex-[1]",
              activeId === item.id
                ? "brightness-100"
                : "brightness-75 hover:brightness-90"
            )}
          >
            {/* Full-Bleed Atmospheric Background Layer */}
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={item.bgSrc}
                alt=""
                fill
                className={cn(
                  "object-cover transition-transform duration-1000",
                  activeId === item.id ? "scale-100 brightness-50" : "scale-110 brightness-60"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#040b18]/80 via-[#07132b]/25 to-[#040b18]/80" />
            </div>

            {/* Center Product Packshot (Shown Cleanly When Expanded) */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-[36%] bottom-[17%] flex items-center justify-center px-6 transition-all duration-500",
                activeId === item.id
                  ? "translate-y-0 scale-100 opacity-100 delay-150"
                  : "translate-y-3 scale-90 opacity-0"
              )}
            >
              <img
                src={item.packshotSrc}
                alt={item.alt}
                className="max-h-full max-w-[360px] object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.75)]"
              />
            </div>

            {/* Active Content: Top-Centered Minimalist Header + Bottom-Centered CTA */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-between px-5 py-6 text-center transition-all duration-500",
                activeId === item.id
                  ? "translate-y-0 opacity-100 delay-150"
                  : "pointer-events-none translate-y-3 opacity-0"
              )}
            >
              <div className="flex max-w-lg flex-col items-center">
                <span className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  {item.category}
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-white md:text-4xl">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-white/85">
                    {item.description}
                  </p>
                )}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-[#07132b] shadow-lg transition-all hover:bg-sky-400"
              >
                <span>Inquire / Order</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Inactive Content: Pure Minimalist Vertical Product Name (Bottom-to-Top, No Pill) */}
            <div
              className={cn(
                "absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300",
                activeId === item.id
                  ? "pointer-events-none translate-y-2 opacity-0"
                  : "opacity-100 delay-200"
              )}
            >
              <span className="hidden whitespace-nowrap text-lg font-medium tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] [writing-mode:vertical-rl] [transform:rotate(180deg)] md:block">
                {item.title}
              </span>
              <span className="block whitespace-nowrap text-sm font-medium text-white md:hidden">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ElasticGallery };
