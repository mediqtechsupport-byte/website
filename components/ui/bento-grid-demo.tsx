"use client"

import {
  BentoGridWithFeatures,
  type BentoFeature,
} from "@/components/ui/bento-grid"

/* MediQ "What We Do" – same divided-cell bento structure, MediQ navy/sky palette.
   Uses a plain <img> (this project is not Next.js, so next/image is not needed). */

const Photo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mt-4 h-28 w-full overflow-hidden rounded-xl border border-sky/30 bg-black/40 lg:h-32">
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      loading="lazy"
    />
  </div>
)

const cell = "border-sky/20 bg-[#071530]/70 backdrop-blur-xl"

export default function WhatWeDoBentoGrid() {
  const features: BentoFeature[] = [
    {
      id: "p1",
      title: "Strategic Importation & Distribution",
      description:
        "Product sourcing, importation coordination, cleanroom inventory availability and validated cold-chain support.",
      content: <Photo src="assets/img/pillars/p1_cleanroom_inspect.jpg" alt="Cleanroom inspection" />,
      className: `col-span-1 md:col-span-3 lg:col-span-2 border-b md:border-r ${cell}`,
    },
    {
      id: "p2",
      title: "Product Marketing & Brand Development",
      description:
        "Evidence-based brand positioning, clinical symposia and advisory summits with Philippine ophthalmic leaders.",
      content: <Photo src="assets/img/pillars/p2_headquarters_brand.jpg" alt="Brand development" />,
      className: `col-span-1 md:col-span-3 lg:col-span-2 border-b lg:border-r ${cell}`,
    },
    {
      id: "p3",
      title: "Nationwide Clinical & Sales Coverage",
      description:
        "Direct surgical suite detailing, hospital relations and consignment management across Luzon, Visayas and Mindanao.",
      content: <Photo src="assets/img/pillars/p3_specialist_discussion.jpg" alt="Specialist detailing" />,
      className: `col-span-1 md:col-span-6 md:border-b lg:border-r-0 lg:col-span-2 border-b ${cell}`,
    },
    {
      id: "stats",
      content: (
        <div className="grid h-full w-full grid-cols-2 gap-4 text-center lg:grid-cols-4">
          {[
            ["17 Regions", "Archipelago coverage"],
            ["99.8%", "Cold-chain reliability"],
            ["120+", "Partner eye centers"],
            ["Rayner UK", "Exclusive partner"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl font-extrabold text-white">{v}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sky">{l}</div>
            </div>
          ))}
        </div>
      ),
      className: `col-span-1 md:col-span-6 lg:col-span-6 border-b lg:border-r-0 ${cell}`,
    },
    {
      id: "p4",
      title: "Regulatory Compliance & QA",
      description:
        "FDA product registration, GDP/CDRR certification, temperature monitoring and pharmacovigilance.",
      content: <Photo src="assets/img/pillars/p6_quality_metrology.jpg" alt="Quality metrology" />,
      className: `col-span-1 md:col-span-3 lg:col-span-2 md:border-r ${cell}`,
    },
    {
      id: "p5",
      title: "Clinical & Surgical Education",
      description:
        "Wet labs, phacoemulsification masterclasses and CME-accredited workshops for residents and fellows.",
      content: <Photo src="assets/img/pillars/p5_theatre_wetlab.jpg" alt="Wet lab theatre" />,
      className: `col-span-1 md:col-span-3 lg:col-span-2 lg:border-r ${cell}`,
    },
    {
      id: "p6",
      title: "Comprehensive Post-Market Support",
      description:
        "Calibration, biometry assistance, surgical feedback loops and a 24/7 technical hotline nationwide.",
      content: <Photo src="assets/img/pillars/p6_lot_traceability.jpg" alt="Lot traceability" />,
      className: `col-span-1 md:col-span-6 lg:border-r-0 lg:col-span-2 ${cell}`,
    },
  ]

  return <BentoGridWithFeatures features={features} className="border-sky/25" />
}

