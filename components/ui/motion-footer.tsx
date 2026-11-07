"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES (MediQ Pharma Palette)
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', "Manrope", sans-serif;
  -webkit-font-smoothing: antialiased;
  
  --pill-bg-1: rgba(16, 38, 77, 0.70);
  --pill-bg-2: rgba(10, 29, 64, 0.90);
  --pill-shadow: rgba(2, 7, 17, 0.65);
  --pill-highlight: rgba(58, 160, 219, 0.28);
  --pill-inset-shadow: rgba(0, 0, 0, 0.85);
  --pill-border: rgba(58, 160, 219, 0.22);
  --pill-bg-1-hover: rgba(58, 160, 219, 0.22);
  --pill-bg-2-hover: rgba(27, 58, 107, 0.85);
  --pill-border-hover: rgba(58, 160, 219, 0.65);
  --pill-shadow-hover: rgba(58, 160, 219, 0.35);
  --pill-highlight-hover: rgba(246, 242, 234, 0.40);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
  100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 92, 168, 0.5)); }
  15%, 45% { transform: scale(1.25); filter: drop-shadow(0 0 12px rgba(196, 0, 107, 0.9)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 15s linear infinite;
  will-change: transform;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(58, 160, 219, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(58, 160, 219, 0.06) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

/* Aurora Glow (Rayner Sky Blue + RayOne Magenta) */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(58, 160, 219, 0.28) 0%, 
    rgba(196, 0, 107, 0.20) 42%, 
    transparent 72%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #ffffff;
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 28vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(58, 160, 219, 0.12);
  background: linear-gradient(180deg, rgba(58, 160, 219, 0.14) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #ffffff 0%, #f6f2ea 45%, #3aa0db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 30px rgba(58, 160, 219, 0.42));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.35,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.0,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center shrink-0 gap-10 pr-10">
    <span>RayOne® Galaxy Spiral Optic</span> <span className="text-[#3aa0db]">✦</span>
    <span>Barrett Aberration Profile</span> <span className="text-[#ff5ca8]">✦</span>
    <span>100% Monofocal Contrast</span> <span className="text-[#3aa0db]">✦</span>
    <span>Sulcoflex® Supplementary</span> <span class="text-[#ff5ca8]">✦</span>
    <span>MediQ Pharma Exclusive Distributor</span> <span className="text-[#3aa0db]">✦</span>
    <span>Pioneering Ophthalmology Since 1949</span> <span class="text-[#ff5ca8]">✦</span>
    <span>FDA Registered &amp; CE Marked</span> <span className="text-[#3aa0db]">✦</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "8vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 75%",
          },
        }
      );

      if (linksRef.current?.children) {
        gsap.fromTo(
          linksRef.current.children,
          { y: 20, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 70%",
            },
          }
        );
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      <div
        ref={wrapperRef}
        id="site-footer"
        className="page-snap-section page-transition-section relative isolate min-h-[calc(100vh-4.5rem)] lg:min-h-screen w-full overflow-hidden bg-[#0a1d40] text-[#f3efe7] cinematic-footer-wrapper border-t border-[#3aa0db]/20 flex flex-col justify-between py-8 sm:py-12 select-none"
      >
        <footer className="relative flex flex-1 flex-col justify-between overflow-hidden bg-[#0a1d40]">
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[2vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            MEDIQ
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div className="absolute top-12 sm:top-14 left-0 w-full overflow-hidden border-y border-[#3aa0db]/25 bg-[#0a1d40]/90 backdrop-blur-md py-3.5 z-10 -rotate-2 scale-110 shadow-2xl" style={{ transform: "rotate(-2deg) scale(1.1)", transformOrigin: "center center" }}>
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-[#f6f2ea]/80 uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content (Clean, uncrowded layout) */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-16 sm:mt-20 w-full max-w-5xl mx-auto text-center">
            <h2
              ref={headingRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black footer-text-glow tracking-tight mb-5 text-center leading-[1.1] max-w-3xl"
            >
              Connect to MediQ
            </h2>

            <p className="max-w-2xl text-sm md:text-base text-[#f6f2ea]/70 mb-10 leading-relaxed font-light">
              Partner with <strong className="text-[#f6f2ea] font-semibold">MediQ Pharma</strong> for exclusive surgeon access to <strong className="text-[#3aa0db] font-semibold">premium IOL solutions</strong>, clinical monographs, and dedicated ophthalmic support.
            </p>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-8 w-full">
              {/* Primary Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                
                <MagneticButton as="a" href="#contact" className="footer-glass-pill px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-[#f3efe7] font-bold text-xs sm:text-sm md:text-base flex items-center gap-3 group border-[#c4006b]/40">
                  <svg className="w-5 h-5 text-[#ff5ca8] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  Schedule Surgeon Consultation
                </MagneticButton>
              </div>

              {/* Chat Contacts */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 w-full">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[#f6f2ea]/60">Chat with MediQ</span>
                <MagneticButton as="a" href="viber://chat?number=%2B639000000000" target="_blank" rel="noopener" className="footer-glass-pill px-5 py-2.5 rounded-full text-[#f3efe7] font-semibold text-xs md:text-sm flex items-center gap-2.5" style={{ borderColor: "#7360f266" }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#7360f2"><path d="M12 2C6.9 2 3 4.7 3 10c0 3 1.3 5 3.3 6.3V21l3.4-2c.7.1 1.5.2 2.3.2 5.1 0 9-2.7 9-8.2S17.100 2 12 2zm3.700 12.500c-.3.8-1.500 1.400-2.200 1.400-1.600 0-5.700-2.100-6.800-5.200-.4-1.300.4-2.100 1.100-2.500.4-.2.700 0 .9.300l.8 1.300c.2.300.1.600-.1.800l-.5.500c.8 1.500 1.800 2.300 3.100 2.800l.5-.6c.2-.2.500-.3.800-.1l1.300.9c.3.200.4.500.1 1z"/></svg>
                  <span>Viber</span>
                </MagneticButton>
                <MagneticButton as="a" href="https://m.me/mediqpharma" target="_blank" rel="noopener" className="footer-glass-pill px-5 py-2.5 rounded-full text-[#f3efe7] font-semibold text-xs md:text-sm flex items-center gap-2.5" style={{ borderColor: "#3aa0db66" }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#3aa0db"><path d="M12 2C6.500 2 2 6.200 2 11.400c0 2.900 1.400 5.500 3.600 7.200V22l3.300-1.800c.9.200 2 .4 3.100.4 5.500 0 10-4.200 10-9.400S17.500 2 12 2zm1 12.600-2.500-2.700-4.900 2.700 5.400-5.700 2.600 2.700 4.800-2.700-5.400 5.700z"/></svg>
                  <span>Messenger</span>
                </MagneticButton>
                <MagneticButton as="a" href="https://t.me/mediqpharma" target="_blank" rel="noopener" className="footer-glass-pill px-5 py-2.5 rounded-full text-[#f3efe7] font-semibold text-xs md:text-sm flex items-center gap-2.5" style={{ borderColor: "#2aabee66" }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#2aabee"><path d="M21.500 3.500 2.800 10.700c-1.300.5-1.300 1.200-.2 1.500l4.800 1.500 1.800 5.600c.2.600.1.800.7.800.5 0 .7-.2 1-.5l2.300-2.300 4.800 3.500c.9.500 1.500.2 1.700-.8L22.900 5c.3-1.300-.5-1.900-1.400-1.500zM8.500 13.200l9.400-5.900c.4-.3.800-.1.500.2L10.700 14.400l-.3 3.300-1.900-4.500z"/></svg>
                  <span>Telegram</span>
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-4 sm:pb-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 border-t border-[#3aa0db]/15 pt-5 bg-[#050e1d]/80 backdrop-blur-sm">
            
            {/* Copyright */}
            <div className="text-[#f6f2ea]/60 text-[10px] md:text-xs font-medium tracking-wide text-center md:text-left order-2 md:order-1">
              &copy; 2026 MediQ Pharma &amp; Medical Supplies Distribution. Exclusive Distributor of Rayner. All rights reserved.
            </div>

            {/* "Made with Love" Badge */}
            <div className="footer-glass-pill px-5 py-2 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-[#3aa0db]/20 bg-[#0a1d40]/60">
              <span className="text-[#f6f2ea]/60 text-[10px] md:text-xs font-semibold uppercase tracking-widest">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-[#ff5ca8]">❤</span>
              <span className="text-[#f6f2ea]/60 text-[10px] md:text-xs font-semibold uppercase tracking-widest">by</span>
              <span className="text-[#f3efe7] font-black text-xs md:text-sm tracking-normal ml-0.5">Volvox</span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full footer-glass-pill flex items-center justify-center text-[#3aa0db] hover:text-white border-[#3aa0db]/35 group order-3 transition-colors"
              title="Scroll back to top"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}
export default CinematicFooter;
