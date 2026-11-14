/**
 * Cue Foundations · 3D Book Carousel Reading Mode
 * ────────────────────────────────────────────
 * A perspective-driven CSS 3D shelf of books that morphs spines into covers as you scroll, opening into a two-phase rise-and-swing reading spread.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/3d-book-carousel-reading-mode.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue074
 *
 * Original Cue ID: cue074
 * Category: 3D & WebGL
 * ────────────────────────────────────────────
 */

/**
 * 3D Book Carousel — Personal Curation with Reading Mode
 *
 * Zero deps. CSS 3D transforms + RAF loop.
 *
 * Usage:
 *   <BookCarousel3D books={books} initialIndex={7} onOpenBook={(i, b) => log(b)} />
 *
 * Font links (add to global head):
 *   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
 */

import React, { useEffect, useRef, useState } from 'react';

export interface Book {
  title: string;
  color: string;
  textColor: string;
  spineW: number;      // spine width in px
  h: number;           // book height in px
  rotZ?: number;
  img?: string;
  isMain?: boolean;
}

interface BookCarousel3DProps {
  books?: Book[];
  initialIndex?: number;
  onOpenBook?: (index: number, book: Book) => void;
}

const DEFAULT_BOOKS: Book[] = [
  { title: 'DESIGN & ILLUSTRATION', color: '#FFC82C', textColor: '#111', spineW: 50, h: 330, img: 'https://cdn.21st.dev/assets/mirror/13/1337c2df55b023426b593e0e6dc69cdd2a792a365a603c839bb031696f01c550.jpg' },
  { title: 'Made in North Korea',   color: '#D661A3', textColor: '#fff', spineW: 25, h: 300, img: 'https://cdn.21st.dev/assets/mirror/06/06defc3f0286eedbe5f21b980f2449eb5e18e877af5801721ec9f08db4f599a7.jpg' },
  { title: 'DESIGN BY ACCIDENT',    color: '#2E5296', textColor: '#fff', spineW: 70, h: 370, img: 'https://cdn.21st.dev/assets/mirror/ab/abefd6ae4f7b86fe7c2bfaed21a1862f03de9fdfda983ec2efe460cf472a3fa5.jpg' },
  { title: 'The creative act',      color: '#E03F35', textColor: '#fff', spineW: 20, h: 350, rotZ: -2.5, img: 'https://cdn.21st.dev/assets/mirror/11/11991281bc0fcea8f13b2cc7a2b552e23fbb07e14db66949638329c7da6d8729.jpg' },
  { title: 'S M L XL',              color: '#7C3AED', textColor: '#fff', spineW: 35, h: 360, img: 'https://cdn.21st.dev/assets/mirror/c3/c32758ce3b98179fca69bf1eeaa48389d3f385a01678e0ce2ceccf79b34b4ed2.jpg' },
  { title: 'OPTIC',                 color: '#D97706', textColor: '#fff', spineW: 50, h: 340, img: 'https://cdn.21st.dev/assets/mirror/c2/c25bd0d5231182a488a7ab2f178b787fed5d36c3544912075b94d4657e78d06c.jpg' },
  { title: 'DEAD THIRTEEN',         color: '#FFC82C', textColor: '#111', spineW: 25, h: 320, img: 'https://cdn.21st.dev/assets/mirror/2d/2df30dc60d23046c9aacf01637d546fb710061f4c3dce82387ff8f51033a887a.jpg' },
  { title: 'VISIBLE SIGNS',         color: '#192041', textColor: '#fff', spineW: 45, h: 360, isMain: true, img: 'https://cdn.21st.dev/assets/mirror/f2/f269f4df939bd42627fdfb9c2ed273ab8ca96a8ef1f67a3ddb633d7baac2ed76.jpg' },
  { title: 'THE IDEAL MANUAL OF STYLE', color: '#555555', textColor: '#b0b0b0', spineW: 60, h: 370, img: 'https://cdn.21st.dev/assets/mirror/82/824bf3414918c54790f63452ae5ba1d86329b40cb19a6f936594ebbcd5b05382.jpg' },
  { title: 'DESIGN & ILLUSTRATION', color: '#EE8EBD', textColor: '#111', spineW: 55, h: 380, img: 'https://cdn.21st.dev/assets/mirror/cd/cd6f4679f2d46dbce92233eb72a0cd6914aed7bdb3f188a6e9f3547f027a46dc.jpg' },
  { title: 'DESIGN EMERGENCY',      color: '#227B36', textColor: '#fff', spineW: 25, h: 300, img: 'https://cdn.21st.dev/assets/mirror/06/06defc3f0286eedbe5f21b980f2449eb5e18e877af5801721ec9f08db4f599a7.jpg' },
  { title: 'MINIMAL',               color: '#0D9488', textColor: '#fff', spineW: 15, h: 280, img: 'https://cdn.21st.dev/assets/mirror/13/1337c2df55b023426b593e0e6dc69cdd2a792a365a603c839bb031696f01c550.jpg' },
  { title: 'PRINTABLE',             color: '#95C6EF', textColor: '#174391', spineW: 45, h: 360, rotZ: -5, img: 'https://cdn.21st.dev/assets/mirror/c3/c32758ce3b98179fca69bf1eeaa48389d3f385a01678e0ce2ceccf79b34b4ed2.jpg' },
];

const OPEN_W = 240;
const GAP = 80;
const smoothstep = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function BookCarousel3D({
  books = DEFAULT_BOOKS,
  initialIndex = 7,
  onOpenBook,
}: BookCarousel3DProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const [activeTitle, setActiveTitle] = useState(books[initialIndex]?.title ?? '');
  const [reading, setReading] = useState(false);

  const state = useRef({
    target: initialIndex,
    current: initialIndex,
    dragging: false,
    startX: 0,
    scrollStart: 0,
    opened: -1,
    openness: new Array(books.length).fill(0),
  });

  useEffect(() => {
    const spineWidths = books.map(b => b.spineW || 40);
    const rotZs = books.map(b => b.rotZ || 0);

    function step() {
      const s = state.current;
      s.current += (s.target - s.current) * 0.08;

      // Compute widths + cumulative left positions
      const positions: number[] = [];
      let left = 0;
      for (let i = 0; i < books.length; i++) {
        positions[i] = left;
        const diff = i - s.current;
        const openness = Math.max(0, 1 - Math.abs(diff));
        const eo = smoothstep(openness);
        const w = spineWidths[i] + eo * (OPEN_W - spineWidths[i]);
        left += w + GAP;
      }

      const getCenter = (i: number, prog: number) => {
        const d = i - prog;
        const openness = Math.max(0, 1 - Math.abs(d));
        const eo = smoothstep(openness);
        const w = spineWidths[i] + eo * (OPEN_W - spineWidths[i]);
        return positions[i] + w / 2;
      };

      const prev = Math.floor(s.current);
      const next = prev + 1;
      const frac = s.current - prev;
      const c1 = getCenter(prev, s.current);
      const c2 = next < books.length ? getCenter(next, s.current) : c1;
      const cameraX = c1 * (1 - frac) + c2 * frac;

      const activeIndex = Math.max(0, Math.min(books.length - 1, Math.round(s.current)));
      setActiveTitle(books[activeIndex].title);

      wrapperRefs.current.forEach((el, i) => {
        if (!el) return;
        const diff = i - s.current;
        const openness = Math.max(0, 1 - Math.abs(diff));
        const eo = smoothstep(openness);

        let x = positions[i] - cameraX + (1 - eo) * (spineWidths[i] / 2);
        let z = eo * 60;
        let y = 0;
        const rotateY = (1 - eo) * 90;
        const zIndex = Math.round(100 - Math.abs(diff) * 10);
        const scale = 1 + eo * 0.05;
        const rotZ = rotZs[i] * (1 - eo);

        // Reading mode
        const target = s.opened === i ? 1 : 0;
        s.openness[i] += (target - s.openness[i]) * 0.06;
        const cOpen = s.openness[i];

        const riseP = Math.min(1, cOpen * 2);
        const swingP = Math.max(0, (cOpen - 0.5) * 2);
        const easeRise = smoothstep(riseP);
        const easeSwing = smoothstep(swingP);

        x += easeSwing * (OPEN_W / 2);
        z += easeRise * 150;
        y += easeRise * -120;

        el.style.zIndex = String(zIndex);
        el.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(${z}px) scale(${scale}) rotateZ(${rotZ}deg)`;

        const inner = el.querySelector<HTMLElement>('.bc-book');
        if (inner) inner.style.transform = `rotateY(${rotateY}deg)`;

        const hinge = el.querySelector<HTMLElement>('.bc-hinge');
        if (hinge) hinge.style.transform = `translateZ(${spineWidths[i] / 2}px) rotateY(${easeSwing * -140}deg)`;

        const spine = el.querySelector<HTMLElement>('.bc-spine');
        if (spine) spine.style.filter = `brightness(${0.6 + eo * 0.4})`;
      });

      if (progressRef.current) {
        progressRef.current.style.width = `${(s.current / (books.length - 1)) * 100}%`;
      }
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);

    // Input handlers
    const clamp = (v: number) => Math.max(0, Math.min(v, books.length - 1));
    const onWheel = (e: WheelEvent) => {
      if (state.current.opened !== -1) return;
      state.current.target = clamp(state.current.target + Math.sign(e.deltaY) * 0.3);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (state.current.opened !== -1) return;
      state.current.dragging = true;
      state.current.startX = e.clientX;
      state.current.scrollStart = state.current.target;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!state.current.dragging || state.current.opened !== -1) return;
      state.current.target = clamp(state.current.scrollStart + (e.clientX - state.current.startX) * -0.01);
    };
    const onMouseUp = () => (state.current.dragging = false);

    const onTouchStart = (e: TouchEvent) => {
      if (state.current.opened !== -1) return;
      state.current.dragging = true;
      state.current.startX = e.touches[0].clientX;
      state.current.scrollStart = state.current.target;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!state.current.dragging || state.current.opened !== -1) return;
      state.current.target = clamp(state.current.scrollStart + (e.touches[0].clientX - state.current.startX) * -0.01);
    };
    const onTouchEnd = () => (state.current.dragging = false);

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseleave', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [books]);

  function handleClick(i: number) {
    const s = state.current;
    if (Math.round(s.current) === i) {
      const nextOpen = s.opened === i ? -1 : i;
      s.opened = nextOpen;
      setReading(nextOpen !== -1);
      if (nextOpen !== -1) onOpenBook?.(i, books[i]);
    } else {
      s.target = i;
    }
  }

  function closeReading() {
    state.current.opened = -1;
    setReading(false);
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="bc-tl">JZA</div>
      <div className="bc-tr">ABOUT</div>

      <button
        className={`bc-close ${reading ? 'visible' : ''}`}
        onClick={closeReading}
        aria-label="Close book"
      >
        <div className="bc-close-wrap">
          <span className="bc-line bc-line-1" />
          <span className="bc-line bc-line-2" />
        </div>
      </button>

      <div className={`bc-header ${reading ? 'hidden' : ''}`}>
        <h1 className="bc-title">{activeTitle}</h1>
      </div>

      <div className="bc-scene">
        <div ref={trackRef} className="bc-track">
          {books.map((b, i) => {
            const sW = b.spineW || 40;
            return (
              <div
                key={i}
                ref={(el) => (wrapperRefs.current[i] = el)}
                className="bc-wrapper"
                onClick={() => handleClick(i)}
              >
                <div className="bc-book" style={{ height: `${b.h}px` }}>
                  {/* Front hinge (cover + inside) */}
                  <div className="bc-face bc-hinge" style={{ transform: `translateZ(${sW / 2}px)` }}>
                    <div className="bc-face bc-front" style={{ width: OPEN_W, background: b.color }}>
                      <div className="bc-overlay" />
                      {b.img ? (
                        <img src={b.img} alt={b.title} className="bc-cover-img" />
                      ) : (
                        <div className="bc-cover-text" style={{ color: b.textColor }}>
                          {b.title}
                        </div>
                      )}
                    </div>
                    <div className="bc-face bc-inside" style={{ width: OPEN_W }} />
                  </div>

                  {/* Reading page */}
                  <div className="bc-face bc-page" style={{ transform: `translateZ(${sW / 2 - 1}px)` }}>
                    <div className="bc-page-inner">
                      <div className="bc-page-eyebrow">Selected Work</div>
                      <h3 className="bc-page-title">{b.title}</h3>
                      <div className="bc-page-rule" />
                    </div>
                  </div>

                  <div className="bc-face bc-back" style={{ width: OPEN_W, background: b.color, transform: `rotateY(180deg) translateZ(${sW / 2}px)` }} />

                  <div className="bc-face bc-spine" style={{ width: sW, left: -sW / 2, background: b.isMain ? '#121830' : b.color }}>
                    <div className="bc-spine-text" style={{ color: b.textColor }}>{b.title}</div>
                  </div>

                  <div className="bc-face bc-pages bc-pages-right" style={{ width: sW, left: OPEN_W - sW / 2 }} />
                  <div className="bc-face bc-pages bc-pages-top"    style={{ height: sW, top: -sW / 2 }} />
                  <div className="bc-face bc-pages bc-pages-bottom" style={{ height: sW, bottom: -sW / 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bc-progress">
        <div ref={progressRef} className="bc-progress-bar" />
      </div>
    </>
  );
}

const CSS = `
:root { --bc-text: #1a1a1a; }
.bc-tl, .bc-tr { position: absolute; top: 40px; z-index: 10; opacity: 0.8; font-family: 'Inter', sans-serif; }
.bc-tl { left: 40px; font-family: 'Cormorant Garamond', serif; font-size: 20px; }
.bc-tr { right: 40px; font-size: 12px; font-weight: 500; }

.bc-header {
  position: absolute; bottom: calc(4% + 400px); left: 0; width: 100%;
  text-align: center; z-index: 10; pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.bc-header.hidden { opacity: 0; transform: translateY(-10px); }
.bc-title {
  font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400;
  text-transform: uppercase; letter-spacing: 3px; margin: 0; color: var(--bc-text);
}

.bc-close {
  position: fixed; top: 40px; right: 40px;
  width: 44px; height: 44px; border: 1px solid rgba(0,0,0,0.1);
  border-radius: 50%; background: transparent; cursor: pointer; z-index: 100;
  opacity: 0; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.4s ease;
}
.bc-close:hover { transform: scale(1.08); border-color: rgba(0,0,0,0.3); }
.bc-close.visible { opacity: 1; pointer-events: auto; }
.bc-close-wrap { position: relative; width: 14px; height: 14px; }
.bc-line {
  position: absolute; top: 50%; left: 0; width: 100%; height: 1px;
  background: #111; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.bc-close.visible .bc-line-1 { transform: translateY(-50%) rotate(45deg); }
.bc-close.visible .bc-line-2 { transform: translateY(-50%) rotate(-45deg); }
.bc-close:hover .bc-line-1  { transform: translateY(-50%) rotate(135deg); }
.bc-close:hover .bc-line-2  { transform: translateY(-50%) rotate(45deg); }

.bc-scene { position: absolute; inset: 0; perspective: 3000px; overflow: hidden; }
.bc-track {
  position: absolute; bottom: 4%; left: 50%;
  transform-style: preserve-3d; will-change: transform;
}

.bc-wrapper {
  position: absolute; bottom: 0;
  transform-style: preserve-3d; will-change: transform;
  cursor: pointer;
}
.bc-book {
  position: relative; width: 240px;
  transform-style: preserve-3d; transform-origin: left center;
}

.bc-face {
  position: absolute; backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.bc-hinge {
  position: absolute; width: 240px; height: 100%; top: 0; left: 0;
  transform-origin: left center; transform-style: preserve-3d; will-change: transform;
}
.bc-front { width: 100%; height: 100%; top: 0; left: 0; }
.bc-inside {
  width: 100%; height: 100%; top: 0; left: 0;
  background: #e0e0e0; transform: rotateY(180deg) translateZ(1px);
  background-image: linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 10%);
}
.bc-page {
  width: 236px; height: calc(100% - 4px); top: 2px; left: 2px;
  background: #fdfdfd; box-sizing: border-box;
  box-shadow: inset -5px 0 10px rgba(0,0,0,0.02); border-radius: 1px 3px 3px 1px;
}
.bc-page-inner { text-align: center; padding: 20px; }
.bc-page-eyebrow { font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #888; margin-bottom: 15px; }
.bc-page-title { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; color: #111; margin: 0; line-height: 1.4; }
.bc-page-rule { width: 20px; height: 1px; background: #111; margin: 20px auto 0; }

.bc-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 10%, rgba(0,0,0,0.1) 95%, rgba(0,0,0,0.2) 100%);
}
.bc-cover-img { width: 100%; height: 100%; object-fit: cover; }
.bc-cover-text {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; box-sizing: border-box;
  font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 1px; line-height: 1.4;
  text-align: center;
}

.bc-back { width: 240px; height: 100%; top: 0; left: 0; }

.bc-spine {
  width: 40px; height: 100%; top: 0; left: -20px;
  transform: rotateY(-90deg);
  box-shadow: inset 5px 0 10px rgba(255,255,255,0.2), inset -5px 0 10px rgba(0,0,0,0.3);
  border-right: 1px solid rgba(0,0,0,0.1);
}
.bc-spine-text {
  writing-mode: vertical-rl; text-orientation: mixed;
  transform: rotate(180deg);
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  white-space: nowrap; padding: 20px 0; width: 100%;
  text-align: center; display: flex; align-items: center; gap: 15px;
}

.bc-pages {
  background: #f4f4f4;
  background-image: repeating-linear-gradient(to right, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px);
}
.bc-pages-right  { width: 40px; height: 100%; top: 0; left: 220px; transform: rotateY(90deg); }
.bc-pages-top    { width: 240px; height: 40px; left: 0; top: -20px; transform: rotateX(90deg);
                   background-image: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px); }
.bc-pages-bottom { width: 240px; height: 40px; left: 0; bottom: -20px; transform: rotateX(-90deg);
                   background-image: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px);
                   box-shadow: 0 0 15px 5px rgba(0,0,0,0.2); }

.bc-progress {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
  width: 200px; height: 2px; background: rgba(0,0,0,0.1); z-index: 20;
}
.bc-progress-bar { height: 100%; width: 0%; background: var(--bc-text); will-change: width; }

@media (max-width: 900px) {
  .bc-progress { width: 140px; }
}
@media (max-width: 600px) {
  .bc-tl, .bc-tr, .bc-header { display: none; }
  .bc-scene { perspective: 2000px; }
}
@media (prefers-reduced-motion: reduce) {
  .bc-book, .bc-hinge, .bc-header, .bc-close, .bc-line { transition: none !important; }
}
`;
