"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type Place = { name: string; lon: number; lat: number; note?: string };

const MANILA: Place = {
  name: "Manila (MediQ HQ)",
  lon: 120.98,
  lat: 14.60,
  note: "Central Operations & Logistics Hub",
};

const PARTNERS: Place[] = [
  { name: "London, UK", lon: -0.13, lat: 51.50, note: "Rayner Global Headquarters" },
  { name: "Worthing, UK", lon: -0.37, lat: 50.81, note: "RayOne® Precision Manufacturing" },
  { name: "Zurich, Switzerland", lon: 8.54, lat: 47.37, note: "Advanced Optical R&D Center" },
  { name: "Tokyo, Japan", lon: 139.69, lat: 35.69, note: "Asia-Pacific Clinical Partners" },
  { name: "Singapore", lon: 103.82, lat: 1.35, note: "Southeast Asia Regional Network" },
  { name: "Munich, Germany", lon: 11.58, lat: 48.14, note: "European Quality Assurance" },
  { name: "San Francisco, USA", lon: -122.42, lat: 37.77, note: "AI Spiral Technology Collaborations" },
  { name: "Sydney, Australia", lon: 151.21, lat: -33.87, note: "Oceania Clinical Exchange" },
];

type Props = {
  hub?: Place;
  places?: Place[];
  className?: string;
  style?: CSSProperties;
};

export function RouteMap({
  hub = MANILA,
  places = PARTNERS,
  className = "",
  style,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ p: Place; x: number; y: number } | null>(null);

  useEffect(() => {
    const el = host.current,
      cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0, dpr = 1, raf = 0, alive = true;
    const t0 = performance.now();
    const mouse = { x: -999, y: -999, active: false };
    const pins: { p: Place; x: number; y: number }[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = el.clientWidth;
      H = el.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    };

    const project = (lon: number, lat: number) => {
      const mapW = W * 0.92;
      const mapH = H * 0.86;
      const startX = (W - mapW) / 2;
      const startY = (H - mapH) / 2 + 12;
      const nx = (lon + 180) / 360;
      const ny = (72 - lat) / 130;
      return { x: startX + nx * mapW, y: startY + ny * mapH };
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const t = (now - t0) / 1000;
      const hCoord = project(hub.lon, hub.lat);
      pins.length = 0;

      for (let j = 0; j < places.length; j++) {
        const dest = places[j];
        const dCoord = project(dest.lon, dest.lat);
        const dist = Math.hypot(dCoord.x - hCoord.x, dCoord.y - hCoord.y);
        const lift = Math.min(95, Math.max(30, dist * 0.28));
        const steps = 40;
        const pts: { x: number; y: number }[] = [];

        for (let k = 0; k <= steps; k++) {
          const u = k / steps;
          const arch = 4 * u * (1 - u);
          pts.push({
            x: hCoord.x + (dCoord.x - hCoord.x) * u,
            y: hCoord.y + (dCoord.y - hCoord.y) * u - arch * lift,
          });
        }

        ctx.strokeStyle = "rgba(114, 197, 248, 0.45)";
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let k = 1; k <= steps; k++) ctx.lineTo(pts[k].x, pts[k].y);
        ctx.stroke();

        const cycle = 2.6;
        const ph = (t / cycle + j / places.length) % 1;
        const head = Math.floor(Math.min(1, ph / 0.72) * steps);

        for (let k = Math.max(0, head - 8); k < head; k++) {
          ctx.globalAlpha = (1 - (head - k) / 8) * 0.95;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(pts[k].x, pts[k].y);
          ctx.lineTo(pts[k + 1].x, pts[k + 1].y);
          ctx.stroke();
        }

        pins.push({ p: dest, x: pts[steps].x, y: pts[steps].y });
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#72c5f8";
        ctx.beginPath();
        ctx.arc(pts[steps].x, pts[steps].y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      pins.push({ p: hub, x: hCoord.x, y: hCoord.y });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(hCoord.x, hCoord.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(el);

    resize();
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [hub, places]);

  return (
    <div ref={host} className={`relative w-full h-full select-none ${className}`} style={style}>
      <canvas ref={canvas} className="w-full h-full block" />
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full pb-2"
          style={{ left: hover.x, top: hover.y }}
        >
          <div className="rounded-md bg-[#0a1d40]/90 backdrop-blur px-2.5 py-1 text-xs text-white shadow-lg border border-sky/30">
            <div className="font-semibold">{hover.p.name}</div>
            {hover.p.note && <div className="text-[10px] text-sky-200">{hover.p.note}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteMap;

