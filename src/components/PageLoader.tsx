import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

const PIVOT_TILT_DEG = 63;

let measureCanvas: HTMLCanvasElement | null = null;

function measureGlyphMetrics(
  char: string,
  el: HTMLElement,
  boxHeight: number,
): { cx: number; bottom: number; height: number } | null {
  try {
    measureCanvas ||= document.createElement('canvas');
    const ctx = measureCanvas.getContext('2d');
    if (!ctx) return null;
    const style = getComputedStyle(el);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const m = ctx.measureText(char);
    if (!Number.isFinite(m.actualBoundingBoxLeft)) return null;
    const baseline =
      (boxHeight - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 +
      m.fontBoundingBoxAscent;
    return {
      cx: (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2,
      bottom: baseline + m.fontBoundingBoxDescent,
      height: m.fontBoundingBoxAscent + m.fontBoundingBoxDescent,
    };
  } catch {
    return null;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export interface PageLoaderProps {
  word: string;
  pivotIndex?: number;
  className?: string;
  letterClassName?: string;
  dotClassName?: string;
  loop?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export function PageLoader({
  word,
  pivotIndex,
  className = '',
  letterClassName = '',
  dotClassName = 'bg-white',
  loop = false,
  speed = 1.25,
  onComplete,
}: PageLoaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const flashRef = useRef<HTMLSpanElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const [resizeTick, setResizeTick] = useState(0);
  const chars = useMemo(() => Array.from(word), [word]);

  const resolvedPivot = useMemo(() => {
    if (
      typeof pivotIndex === 'number' &&
      Number.isInteger(pivotIndex) &&
      chars[pivotIndex]?.trim()
    ) {
      return pivotIndex;
    }
    const found = chars.findIndex((c) => 'Iil1'.includes(c));
    return found === -1 ? Math.floor(chars.length / 2) : found;
  }, [chars, pivotIndex]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const heading = headingRef.current;
    const dot = dotRef.current;
    const flash = flashRef.current;
    const spans = letterRefs.current.slice(0, chars.length);
    const pivotSpan = spans[resolvedPivot];

    if (!root || !heading || !dot || !flash || !pivotSpan) return;

    const otherIndices = spans
      .map((el, idx) => (el && idx !== resolvedPivot && chars[idx].trim() ? idx : -1))
      .filter((idx) => idx !== -1);

    let ctx: gsap.Context | undefined;
    let cancelled = false;
    let cleanupResize = () => {};

    if (prefersReducedMotion()) {
      gsap.set(spans.filter(Boolean), { opacity: 1 });
      gsap.set(dot, { opacity: 0 });
      const timer = setTimeout(() => onCompleteRef.current?.(), 200);
      return () => clearTimeout(timer);
    }

    gsap.set(spans.filter(Boolean), { opacity: 0 });
    gsap.set(dot, { opacity: 0 });

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set([...spans.filter(Boolean), dot], { clearProps: 'transform' });

        const rootBox = root.getBoundingClientRect();
        const fontSize = parseFloat(getComputedStyle(heading).fontSize) || 16;

        const boxes = spans.map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            left: r.left - rootBox.left,
            top: r.top - rootBox.top,
            w: r.width,
            h: r.height,
            cx: r.left - rootBox.left + r.width / 2,
            cy: r.top - rootBox.top + r.height / 2,
          };
        });

        const pivotBox = boxes[resolvedPivot];
        if (!pivotBox) return;

        const glyph = measureGlyphMetrics(
          chars[resolvedPivot],
          pivotSpan,
          pivotBox.h,
        ) ?? {
          cx: pivotBox.w / 2,
          bottom: pivotBox.h,
          height: pivotBox.h * 0.78,
        };

        const anchor = {
          x: pivotBox.left + glyph.cx,
          y: pivotBox.top + glyph.bottom,
        };
        const glyphH = glyph.height;
        const dotSize = fontSize * 0.24;

        gsap.set(pivotSpan, {
          transformOrigin: `${(glyph.cx / pivotBox.w) * 100}% ${(glyph.bottom / pivotBox.h) * 100}%`,
        });
        gsap.set(dot, {
          width: dotSize,
          height: dotSize,
          left: anchor.x - dotSize / 2,
          top: anchor.y + fontSize * 0.1,
        });

        const tipPoint = (deg: number) => {
          const rad = (deg * Math.PI) / 180;
          return {
            x: anchor.x + Math.sin(rad) * glyphH,
            y: anchor.y - Math.cos(rad) * glyphH,
          };
        };

        const dropStartY = -(rootBox.top + anchor.y) - fontSize;
        const flashSize = fontSize * 2.6;

        const pulseFlash = (
          tl: gsap.core.Timeline,
          pt: { x: number; y: number },
          peakOpacity: number,
          at: number,
        ) => {
          tl.set(
            flash,
            {
              width: flashSize,
              height: flashSize,
              left: pt.x - flashSize / 2,
              top: pt.y - flashSize / 2,
            },
            at,
          )
            .to(flash, { opacity: peakOpacity, duration: 0.05, ease: 'none' }, at)
            .to(flash, { opacity: 0, duration: 0.34, ease: 'power2.out' }, at + 0.05);
        };

        const launchLetter = (
          tl: gsap.core.Timeline,
          idx: number,
          originPt: { x: number; y: number },
          at: number,
        ) => {
          const el = spans[idx];
          const box = boxes[idx];
          if (!el || !box) return at;
          const dx = originPt.x - box.cx;
          const dy = originPt.y - box.cy;
          const dur = 0.5 + Math.min(Math.abs(dx) / 900, 0.32);
          const arcY = -(Math.abs(dx) * 0.3 + fontSize * 0.25);
          const spin = (dx > 0 ? -1 : 1) * gsap.utils.random(170, 300);

          tl.set(
            el,
            {
              x: dx,
              y: dy,
              rotation: spin,
              scale: 0.3,
              opacity: 0,
              transformOrigin: '50% 50%',
            },
            at,
          )
            .to(el, { opacity: 1, scale: 1, duration: dur * 0.45 }, at)
            .to(el, { x: 0, duration: dur, ease: 'power1.out' }, at)
            .to(el, { y: Math.min(dy, 0) + arcY, duration: dur * 0.45, ease: 'power2.out' }, at)
            .to(el, { y: 0, duration: dur * 0.55, ease: 'power2.in' }, at + dur * 0.45)
            .to(el, { rotation: 0, duration: dur, ease: 'power2.out' }, at)
            .to(el, { y: -fontSize * 0.05, duration: 0.09, ease: 'power2.out' }, at + dur)
            .to(el, { y: 0, duration: 0.16, ease: 'power2.in' }, at + dur + 0.09);

          return at + dur;
        };

        const catapultSide = (
          tl: gsap.core.Timeline,
          angle: number,
          indices: number[],
          at: number,
        ) => {
          if (!indices.length) return at;
          const pt = tipPoint(angle);
          tl.to(pivotSpan, { rotation: angle, duration: 0.4, ease: 'back.out(1.4)' }, at);
          tl.to(
            pivotSpan,
            { rotation: angle + (angle < 0 ? 6 : -6), duration: 0.08 },
            at + 0.34,
          ).to(
            pivotSpan,
            { rotation: angle, duration: 0.3, ease: 'elastic.out(1, 0.5)' },
            at + 0.42,
          );

          let endAt = at;
          indices.forEach((charIdx, i) => {
            const fireAt = at + 0.34 + i * 0.1;
            pulseFlash(tl, pt, Math.max(0.15, 0.5 - i * 0.1), fireAt);
            endAt = Math.max(endAt, launchLetter(tl, charIdx, pt, fireAt));
          });
          return endAt;
        };

        const master = gsap.timeline({
          defaults: { ease: 'power2.out' },
          repeat: loop ? -1 : 0,
          repeatDelay: loop ? 1.1 : 0,
          onComplete: () => {
            if (!loop) onCompleteRef.current?.();
          },
        });

        master.timeScale(speed);
        master
          .set(root, { opacity: 1 })
          .set(spans.filter(Boolean), { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 })
          .set(pivotSpan, { opacity: 0, y: dropStartY, rotation: 0 })
          .set(dot, { opacity: 0, y: dropStartY, scale: 1 });

        const introScale = 0.95;
        const introTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        const dotBounceH = fontSize * 0.4;

        introTl
          .set(dot, { opacity: 1 }, 0)
          .to(dot, { y: 0, duration: 0.42, ease: 'power2.in' }, 0)
          .to(dot, { scaleX: 0.82, scaleY: 1.22, duration: 0.28, ease: 'power1.in' }, 0.14)
          .to(dot, { scaleX: 1.4, scaleY: 0.52, duration: 0.06 }, 0.42)
          .to(dot, { y: -dotBounceH, duration: 0.2 }, 0.48)
          .to(dot, { scaleX: 1, scaleY: 1, duration: 0.18 }, 0.48)
          .to(dot, { y: 0, duration: 0.18, ease: 'power2.in' }, 0.68)
          .to(dot, { scaleX: 0.92, scaleY: 1.08, duration: 0.14, ease: 'power1.in' }, 0.72)
          .to(dot, { scaleX: 1.2, scaleY: 0.74, duration: 0.05 }, 0.86)
          .to(dot, { scaleX: 1, scaleY: 1, duration: 0.36, ease: 'elastic.out(1, 0.42)' }, 0.91);

        pulseFlash(introTl, anchor, 0.4, 0.42);
        pulseFlash(introTl, anchor, 0.24, 0.86);

        const pivotBounceH = fontSize * 0.13;
        introTl
          .set(pivotSpan, { opacity: 1 }, 0.8)
          .to(pivotSpan, { y: 0, duration: 0.34, ease: 'power2.in' }, 0.8)
          .to(pivotSpan, { scaleX: 0.86, scaleY: 1.16, duration: 0.24, ease: 'power1.in' }, 0.88)
          .to(pivotSpan, { scaleX: 1.32, scaleY: 0.64, duration: 0.06 }, 1.14)
          .to(pivotSpan, { y: -pivotBounceH, duration: 0.1 }, 1.2)
          .to(pivotSpan, { scaleX: 1, scaleY: 1, duration: 0.12 }, 1.2)
          .to(pivotSpan, { y: 0, duration: 0.1, ease: 'power2.in' }, 1.3)
          .to(pivotSpan, { scaleX: 1.12, scaleY: 0.88, duration: 0.05 }, 1.4)
          .to(pivotSpan, { scaleX: 1, scaleY: 1, duration: 0.38, ease: 'elastic.out(1, 0.4)' }, 1.45)
          .fromTo(
            pivotSpan,
            { rotation: -9 },
            { rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.36)' },
            1.19,
          );

        pulseFlash(introTl, anchor, 0.6, 1.14);
        pulseFlash(introTl, anchor, 0.26, 1.4);

        master.add(introTl.timeScale(introScale), 0);

        const leftIndices = otherIndices.filter((i) => i < resolvedPivot).reverse();
        const rightIndices = otherIndices.filter((i) => i > resolvedPivot);
        let cursor = 1.4 / introScale;

        cursor = catapultSide(master, -PIVOT_TILT_DEG, leftIndices, cursor);
        cursor = catapultSide(
          master,
          PIVOT_TILT_DEG,
          rightIndices,
          leftIndices.length ? cursor - 0.3 : cursor,
        );

        master
          .to(
            pivotSpan,
            { rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.55)' },
            cursor - 0.16,
          )
          .to(
            dot,
            { opacity: 0, scale: 0, duration: 0.3, ease: 'power2.in' },
            cursor - 0.12,
          );

        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (loop) {
              setResizeTick((t) => t + 1);
            } else if (master.progress() < 1) {
              master.progress(1);
            }
          }, 150);
        };
        window.addEventListener('resize', onResize);
        cleanupResize = () => {
          clearTimeout(resizeTimer);
          window.removeEventListener('resize', onResize);
        };
      }, root);
    });

    return () => {
      cancelled = true;
      cleanupResize();
      ctx?.revert();
    };
  }, [chars, resolvedPivot, loop, speed, resizeTick]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="absolute top-0 left-0 opacity-0"
    >
      <h1 ref={headingRef} className={className}>
        {chars.map((char, idx) => (
          <span
            key={`${char}-${idx}`}
            ref={(el) => {
              letterRefs.current[idx] = el;
            }}
            className={`inline-block will-change-transform ${letterClassName}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <span
        ref={dotRef}
        className={`absolute rounded-full pointer-events-none ${dotClassName}`}
      />
      <span
        ref={flashRef}
        className="absolute rounded-full opacity-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
    </div>
  );
}
