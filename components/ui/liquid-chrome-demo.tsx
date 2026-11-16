"use client";

import LiquidChrome, {
  type LiquidChromePalette,
} from "@/components/ui/liquid-chrome";

const P: Record<string, LiquidChromePalette> = {
  blue: { glow: "#72c5f8", deep: "#0e2d61", ground: "#040c1d" },
  lilac: { glow: "#b9a6ff", deep: "#2b2f45", ground: "#0b0c10" },
  gold: { glow: "#ffcf7a", deep: "#4a3410", ground: "#0c0904" },
  mercury: { glow: "#dfe6ee", deep: "#3a3f46", ground: "#08090b" },
};

export default function Demo({ variant = "blue" }: { variant?: string }) {
  return (
    <div className="w-full h-screen">
      <LiquidChrome
        palette={P[variant] ?? P.blue}
        className="h-full min-h-full w-full"
      >
        <div className="pointer-events-none flex h-full flex-col items-start justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_50%)] p-6 sm:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
            Vitrine · Foundry
          </p>
          <h2 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            Poured, not painted.
          </h2>
        </div>
      </LiquidChrome>
    </div>
  );
}
