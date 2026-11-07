"use client";

import LiquidText from "@/components/ui/liquid-text";

export default function LiquidTextDemo() {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center bg-[#0a1d40] px-8 py-12">
      <LiquidText
        text="Advanced Intraocular"
        tone="dark"
        color="#ffffff"
        highlight="#ffffff"
        accentColor="#3aa0db"
        fontSize={64}
        fontWeight={600}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        className="w-full max-w-4xl"
      />
      <LiquidText
        text="Lens for a Clearer Tomorrow"
        tone="dark"
        color="#ffffff"
        highlight="#ffffff"
        accentColor="#3aa0db"
        fontSize={64}
        fontWeight={600}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        className="w-full max-w-4xl"
      />
    </div>
  );
}

