// author: Khoa Phan <https://www.pldkhoa.dev>

"use client";

import { useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import StackingCards, {
  StackingCardItem,
} from "@/components/ui/stacking-cards";

const cards = [
  {
    bgColor: "bg-[#071530]",
    title: "Strategic Importation & Distribution",
    description:
      "Product sourcing, importation coordination, inventory availability, and supply-chain support.",
    image: "/assets/img/pillars/p1_cleanroom_inspect.jpg",
  },
  {
    bgColor: "bg-[#081a3d]",
    title: "Product Marketing & Brand Development",
    description:
      "Brand positioning, launch campaigns, professional communication, and product awareness.",
    image: "/assets/img/pillars/p2_headquarters_brand.jpg",
  },
  {
    bgColor: "bg-[#091f47]",
    title: "Sales, Promotion & Commercialization",
    description:
      "Field sales, medical product presentations, institutional account development, and promotional programs.",
    Image: "/assets/img/pillars/p3_commercial_meeting.jpg",
  },
  {
    bgColor: "bg-[#082250]",
    title: "Market Development",
    description:
      "Customer insight, segment planning, channel expansion, new account growth, and principal collaboration.",
    image: "/assets/img/pillars/p4_customer_growth.jpg",
  },
  {
    bgColor: "bg-[#0a2354]",
    title: "Professional Education",
    description:
      "Product knowledge training, educational events, demonstrations where appropriate, and technical engagement.",
    image: "/assets/img/pillars/p5_microscope_education.jpg",
  },
  {
    bgColor: "bg-[#071738]",
    title: "Quality & Customer Support",
    description:
      "Regulatory coordination, traceability, responsible product handling, and responsive after-sales support.",
    image: "/assets/img/pillars/p6_quality_metrology.jpg",
  },
];

export default function StackingCardsDemo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      className="h-[640px] bg-[#050e1f] overflow-auto text-white rounded-2xl border border-sky/20"
      ref={container}
    >
      <StackingCards
        totalCards={cards.length}
        scrollOptions={{ container: container }}
      >
        <div className="relative font-sans h-[90px] w-full z-10 text-xs tracking-[0.25em] font-semibold uppercase flex justify-center items-center text-[#72c5f8] whitespace-pre">
          Scroll down ↓
        </div>
        {cards.map(({ bgColor, description, image, title }, index) => {
          return (
            <StackingCardItem key={index} index={index} className="h-[620px]">
              <div
                className={cn(
                  bgColor,
                  "h-[80%] sm:h-[75%] flex-col sm:flex-row aspect-video px-8 py-8 flex w-11/12 rounded-3xl mx-auto relative border border-sky/30 shadow-2xl backdrop-blur-xl",
                )}
              >
                <div className="flex-1 flex flex-col justify-center pr-6">
                  <span className="text-xs uppercase tracking-widest text-[#72c5f8] font-mono mb-2">Pillar 0{index + 1}</span>
                  <h3 className="font-bold text-2xl md:text-3xl mb-4 text-white">{title}</h3>
                  <p className="text-white/80 leading-relaxed text-sm md:text-base">{description}</p>
                </div>

                <div className="w-full sm:w-1/2 rounded-2xl aspect-video relative overflow-hidden border border-white/10 shadow-lg bg-black/40">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </StackingCardItem>
          );
        })}

        <div className="w-full h-40 relative overflow-hidden flex items-center justify-center">
          <h2 className="text-2xl md:text-4xl text-[#72c5f8]/30 font-bold uppercase tracking-widest">
            MEDIQ Healthcare Innovation
          </h2>
        </div>
      </StackingCards>
    </div>
  );
}
