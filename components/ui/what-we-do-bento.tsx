import React, { useEffect, useMemo, useRef, useState } from "react";

const STYLE_ID = "mediq-bento-animations";

export interface BentoPillar {
  id: string;
  pillar: string;
  variant: "orbit" | "relay" | "wave" | "spark" | "loop" | "pulse";
  category: string;
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  badges: string[];
  image?: string;
  span?: string; // e.g. "lg:col-span-2"
}

const pillars: BentoPillar[] = [
  {
    id: "01",
    pillar: "PILLAR 01",
    variant: "orbit",
    category: "Supply Chain",
    title: "Strategic Importation & Distribution",
    description:
      "Direct global manufacturer partnerships, importation coordination, cleanroom inventory availability, and validated temperature-controlled logistics across the archipelago.",
    statLabel: "Cold-chain dispatch",
    statValue: "< 24-48 hrs",
    badges: ["Product Sourcing", "Importation Clearance", "Inventory Reserves", "GDP Logistics"],
    image: "assets/img/pillars/p1_cleanroom_inspect.jpg",
    span: "lg:col-span-2",
  },
  {
    id: "02",
    pillar: "PILLAR 02",
    variant: "relay",
    category: "Commercial",
    title: "Product Marketing & Brand Development",
    description:
      "Evidence-based brand positioning, peer-reviewed clinical symposia, and advisory board summits connecting international innovators with Philippine ophthalmic leaders.",
    statLabel: "Academic symposia",
    statValue: "25+ / yr",
    badges: ["Surgeon Summits", "Clinical Advisory", "Congress Exhibits"],
    image: "assets/img/pillars/p2_phaco_demo.jpg",
    span: "lg:col-span-1",
  },
  {
    id: "03",
    pillar: "PILLAR 03",
    variant: "wave",
    category: "Field Network",
    title: "Nationwide Clinical & Sales Coverage",
    description:
      "Direct surgical suite detailing and consignment management across Luzon, Visayas, and Mindanao — ensuring precision optics are ready in every operating room.",
    statLabel: "Archipelago reach",
    statValue: "17 Regions",
    badges: ["OR Standby Coverage", "Consignment Mgmt", "Tier-1 Hospitals"],
    image: "assets/img/pillars/p3_wetlab_session.jpg",
    span: "lg:col-span-1",
  },
  {
    id: "04",
    pillar: "PILLAR 04",
    variant: "spark",
    category: "Governance",
    title: "Regulatory Compliance & Quality Assurance",
    description:
      "Full Philippine FDA product licenses, Good Distribution Practice (GDP) protocols, real-time data loggers, and strict post-market pharmacovigilance oversight.",
    statLabel: "Regulatory compliance",
    statValue: "100% FDA CDRR",
    badges: ["FDA Certified", "GDP Audited", "Thermal Mapping"],
    image: "assets/img/pillars/p4_regulatory_file.jpg",
    span: "lg:col-span-1",
  },
  {
    id: "05",
    pillar: "PILLAR 05",
    variant: "loop",
    category: "Professional Dev",
    title: "Clinical & Surgical Education",
    description:
      "Accredited continuous medical education, hands-on phacoemulsification wet labs, and masterclasses elevating ophthalmic surgical outcomes nationwide.",
    statLabel: "Surgeons trained",
    statValue: "500+ Fellows",
    badges: ["Wet Lab Workshops", "CME Modules", "Video Surgery"],
    image: "assets/img/pillars/p5_symposium_hall.jpg",
    span: "lg:col-span-1",
  },
  {
    id: "06",
    pillar: "PILLAR 06",
    variant: "pulse",
    category: "Continuity",
    title: "Comprehensive Post-Market Support",
    description:
      "Rapid biometry calibration support, direct manufacturer warranty fulfillment, surgical feedback loops, and round-the-clock technical guidance for eye care institutes.",
    statLabel: "Hotline & service SLA",
    statValue: "24/7 Priority",
    badges: ["Biometry Support", "OR Calibration", "Rapid In-Service", "Surgeon Hotline"],
    image: "assets/img/pillars/p6_delivery_fleet.jpg",
    span: "lg:col-span-2",
  },
];

const bentoMetrics = [
  { label: "Nationwide Coverage", value: "17 Regions" },
  { label: "Cold-Chain Integrity", value: "99.8%" },
  { label: "Partner Eye Institutes", value: "120+ Centers" },
  { label: "Global Brand Exclusivity", value: "Rayner UK" },
];

export function WhatWeDoBentoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      @keyframes mediq-bento-in {
        0% { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.98); filter: blur(10px); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      .mediq-bento-card {
        opacity: 0;
        transform: translate3d(0, 28px, 0);
        filter: blur(10px);
        transition: border-color 300ms ease, box-shadow 300ms ease;
      }
      .mediq-bento-card[data-visible="true"] {
        animation: mediq-bento-in 700ms cubic-bezier(0.2, 0.7, 0, 1) forwards;
        animation-delay: var(--bento-delay, 0ms);
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full text-cream py-8 sm:py-12 px-4 sm:px-6 lg:px-10"
    >
      <!-- Header -->
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-[11px] font-mono font-bold text-sky uppercase tracking-widest mb-3">
          <span className="size-2 rounded-full bg-sky animate-ping"></span>
          <span>Core Capabilities &bull; Bento Edition</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2">
          What <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
        </h2>
        <p className="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto">
          Comprehensive commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
        </p>
      </div>

      <!-- Bento Grid -->
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {pillars.map((pillar, index) => (
          <BentoPillarCard key={pillar.id} pillar={pillar} index={index} visible={visible} />
        ))}
      </div>

      <!-- Metrics Bar -->
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-[#071530]/80 border border-sky/20 backdrop-blur-xl">
        {bentoMetrics.map((m) => (
          <div key={m.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-[10px] sm:text-xs font-mono text-sky/80 uppercase tracking-widest mb-1">{m.label}</span>
            <span className="text-base sm:text-xl font-extrabold text-white">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BentoPillarCard({
  pillar,
  index,
  visible,
}: {
  pillar: BentoPillar;
  index: number;
  visible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      data-visible={visible}
      style={{
        ["--bento-delay" as string]: `${index * 80}ms`,
      }}
      className={`mediq-bento-card group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-sky/20 hover:border-sky/50 bg-[#071530]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 ${pillar.span || ""}`}
    >
      <!-- Interactive Cursor Spotlight Glow -->
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(58, 160, 219, 0.18), transparent 70%)`,
        }}
      />

      <!-- Pillar Header -->
      <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase">
            {pillar.pillar}
          </span>
          <span className="text-[11px] font-medium text-cream/60 uppercase tracking-wider">
            {pillar.category}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-cream/40">{pillar.id}</span>
      </div>

      <!-- Content -->
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky transition-colors mb-2">
          {pillar.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-cream/75 leading-relaxed mb-4">
          {pillar.description}
        </p>

        <!-- Badges -->
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pillar.badges.map((b) => (
            <span
              key={b}
              className="text-[10.5px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/80"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <!-- Footer Micro Stat -->
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-cream/60">{pillar.statLabel}</span>
        <span className="font-mono font-bold text-sky">{pillar.statValue}</span>
      </div>
    </div>
  );
}

export default WhatWeDoBentoSection;

