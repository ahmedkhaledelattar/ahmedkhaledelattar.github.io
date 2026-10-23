import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS, type ProjectItem } from '../data/projects';
import { PROFILE } from '../data/profile';
import { gsap, ScrollTrigger, useSectionReveal } from '../animations/reveal';

const RACK_CLASSES = [
  'scale-100 opacity-100',
  'scale-90 opacity-50',
  'scale-[0.81] opacity-25',
] as const;

interface ShelfCardProps {
  item: ProjectItem;
  isActive: boolean;
  rack: number;
  scrollDriven: boolean;
  wasDragged: () => boolean;
  onSelect: () => void;
  onInspect: (item: ProjectItem) => void;
}

function ShelfCard({
  item,
  isActive,
  rack,
  scrollDriven,
  wasDragged,
  onSelect,
  onInspect,
}: ShelfCardProps) {
  const whatsappText = encodeURIComponent(
    `Hi Ahmed, I'm interested in the "${item.name}" work from your portfolio archive. Could we discuss a similar project?`,
  );

  return (
    <div
      className={`relative shrink-0 snap-start flex flex-col origin-top transition-[scale,opacity] duration-[320ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        scrollDriven
          ? 'w-[min(360px,calc((100svh-390px)*0.5625))]'
          : 'w-[280px] sm:w-[320px] lg:w-[360px]'
      } ${RACK_CLASSES[rack] ?? RACK_CLASSES[2]}`}
    >
      {isActive && rack === 0 && (
        <span className="absolute -top-3 left-0 z-20 px-2 py-0.5 bg-[#ff5c3d] text-white text-[10px] font-bold tracking-widest uppercase">
          {item.number} • {item.category}
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          if (wasDragged()) {
            e.preventDefault();
            return;
          }
          if (!isActive) {
            e.preventDefault();
            onSelect();
          } else {
            onInspect(item);
          }
        }}
        aria-label={
          isActive
            ? `Inspect full artwork for ${item.name}`
            : `Bring ${item.name} to the front`
        }
        aria-current={isActive ? 'true' : undefined}
        className="group block w-full text-left cursor-pointer bg-[#0d0d0f] border-2 border-[var(--accent)]/55 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
      >
        <div className="relative w-full aspect-[9/16] bg-[#0a0a0c] overflow-hidden">
          <img
            src={item.cardImage}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-white/80 pointer-events-none">
            <span>{item.metrics.format}</span>
            <span>{item.year}</span>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h3 className="text-lg font-bold text-white truncate">
              {item.name}
            </h3>
            <span className="text-xs text-[var(--accent)] font-mono uppercase shrink-0">
              {item.number}
            </span>
          </div>
          <p className="text-gray-500 text-xs mb-3 truncate">{item.tagline}</p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 text-[9px] tracking-[0.15em] text-gray-500 font-mono uppercase">
              <span className="whitespace-nowrap">
                {item.metrics.dimension}
              </span>
              <span className="truncate">{item.metrics.craft}</span>
            </div>
            <span
              className={`flex items-center gap-1 text-[9px] tracking-[0.15em] font-mono uppercase whitespace-nowrap transition-colors ${
                isActive ? 'text-[var(--accent)]' : 'text-transparent'
              }`}
            >
              Inspect
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </span>
          </div>
        </div>
      </button>

      <a
        href={`https://wa.me/${PROFILE.whatsappNumber}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isActive ? 0 : -1}
        className={`mt-4 w-full px-5 py-2.5 rounded-full border border-white/25 text-white text-xs hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center gap-2 ${
          isActive ? '' : 'pointer-events-none'
        }`}
      >
        <span>Enquire on WhatsApp</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29z" />
        </svg>
      </a>
    </div>
  );
}

interface SummaryCardProps {
  isActive: boolean;
  rack: number;
  scrollDriven: boolean;
}

function SummaryCard({ isActive, rack, scrollDriven }: SummaryCardProps) {
  return (
    <div
      className={`relative shrink-0 snap-start flex flex-col origin-top transition-[scale,opacity] duration-[320ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        scrollDriven
          ? 'w-[min(360px,calc((100svh-390px)*0.5625))]'
          : 'w-[280px] sm:w-[320px] lg:w-[360px]'
      } ${RACK_CLASSES[rack] ?? RACK_CLASSES[2]}`}
    >
      <a
        href="#contact"
        className="group block w-full border-2 border-[var(--accent)]/55 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
      >
        <div className="relative w-full aspect-[9/16] overflow-hidden bg-[linear-gradient(160deg,#e8e4dc_0%,#cfc7b6_38%,#7b6f8f_72%,#2b2440_100%)]">
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'linear-gradient(#050505 1px, transparent 1px), linear-gradient(90deg, #050505 1px, transparent 1px)',
              backgroundSize: '34px 34px',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-black">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-70">
              Complete Archive
            </span>
            <div>
              <p className="text-[5.5rem] leading-[0.85] font-black tracking-tighter">
                All
              </p>
              <p className="text-lg font-bold tracking-tight mt-2">
                design, AI & research systems
              </p>
              <p className="text-sm font-light mt-3 opacity-75 leading-snug">
                Every commercial visual, brand mark, and research deck built by
                Ahmed Khaled.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase">
              Start a conversation
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-white/5 bg-[#0d0d0f]">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h3 className="text-lg font-bold text-white truncate">
              Custom Commissions
            </h3>
            <span className="text-sm text-gray-300 font-medium shrink-0">
              {PROFILE.experienceYears} yrs
            </span>
          </div>
          <p className="text-gray-500 text-xs mb-3 truncate">
            design, web engineering, AI workflows & medical research
          </p>
          <div className="flex items-center gap-4 text-[9px] tracking-[0.15em] text-gray-500 font-mono uppercase">
            <span>Direct collaboration</span>
            <span>Fast turnaround</span>
          </div>
        </div>
      </a>

      <a
        href="#contact"
        tabIndex={isActive ? 0 : -1}
        className={`mt-4 w-full px-5 py-2.5 rounded-full bg-[var(--accent)] text-black text-xs font-medium hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center justify-center gap-2 ${
          isActive ? '' : 'pointer-events-none'
        }`}
      >
        <span>Get in touch</span>
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </a>
    </div>
  );
}

export interface CreativeVaultProps {
  onSelectProject: (project: ProjectItem) => void;
}

export function CreativeVault({ onSelectProject }: CreativeVaultProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useSectionReveal<HTMLDivElement>();

  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const count = PROJECTS.length;
  const clampedActive = Math.min(activeIndex, count - 1);
  const scrollDriven = isLargeDesktop && !reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLargeDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const syncActiveToScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const sl = track.scrollLeft;
    let closestIdx = 0;
    let minDiff = Infinity;
    Array.from(track.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const diff = Math.abs(el.offsetLeft - track.offsetLeft - sl);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncActiveToScroll);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    syncActiveToScroll();
    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener('scroll', onScroll);
    };
  }, [syncActiveToScroll]);

  useEffect(() => {
    if (!scrollDriven) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getMaxScroll = () => track.scrollWidth - track.clientWidth;
    if (getMaxScroll() <= 0) return;

    const tween = gsap.to(track, {
      scrollLeft: getMaxScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getMaxScroll()}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => setScrollProgress(self.progress),
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 300);
    window.addEventListener('load', refresh);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: 'scrollLeft' });
    };
  }, [scrollDriven]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(track.children.length - 1, idx));
      const target = track.children[clamped] as HTMLElement | undefined;
      if (target) {
        track.scrollTo({
          left: target.offsetLeft - track.offsetLeft,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }
    },
    [reducedMotion],
  );

  const dragState = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: 0,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const track = trackRef.current;
    if (!track) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: 0,
    };
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !trackRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    dragState.current.moved = Math.abs(dx);
    trackRef.current.scrollLeft = dragState.current.startScroll - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current.active) {
      dragState.current.active = false;
      trackRef.current?.releasePointerCapture?.(e.pointerId);
      scrollToIndex(activeIndex);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className={`bg-[#050505] w-full text-white overflow-hidden ${
        scrollDriven
          ? 'h-screen flex flex-col justify-center py-0'
          : 'pt-10 md:pt-20 pb-24'
      }`}
    >
      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-5 px-6 md:px-16">
        {/* Left Editorial Panel */}
        <div
          ref={leftColRef}
          className="w-full lg:w-[300px] xl:w-[340px] shrink-0 flex flex-col"
        >
          <div
            data-reveal-group="0.12"
            className="bg-white/[0.05] p-[1.125rem] border-t-2 border-white/80"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-[0.95] mb-6">
              Visual systems built to command attention.
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
              {count} real portfolio artifacts spanning commercial key visuals,
              AI-augmented campaigns, scientific research decks, and bilingual
              brand identity.
            </p>
          </div>

          <div
            data-reveal
            data-reveal-delay="0.1"
            className="flex flex-wrap gap-3 mt-3 bg-white/[0.05] p-[1.125rem]"
          >
            <button
              type="button"
              onClick={() => onSelectProject(PROJECTS[clampedActive] ?? PROJECTS[0])}
              className="cursor-pointer group px-6 py-3.5 bg-[var(--accent)] text-black text-xs font-bold tracking-[0.15em] uppercase hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center gap-2 shadow-[0_0_28px_-6px_var(--accent)]"
            >
              <span>Inspect Active</span>
              <svg
                className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </button>
            <a
              href={`https://wa.me/${PROFILE.whatsappNumber}?text=Hi%20Ahmed%2C%20I'd%20like%20to%20discuss%20a%20creative%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 border border-white/25 text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors"
            >
              Message me
            </a>
          </div>
        </div>

        {/* Right Horizontal Rack Carousel */}
        <div className="flex-1 min-w-0 flex flex-col bg-white/[0.05] p-[1.125rem] gap-3">
          <div
            ref={trackRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Creative archive shelf"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={scrollDriven ? undefined : onPointerDown}
            onPointerMove={scrollDriven ? undefined : onPointerMove}
            onPointerUp={scrollDriven ? undefined : onPointerUp}
            onPointerCancel={scrollDriven ? undefined : onPointerUp}
            className={`flex items-stretch gap-3 py-3 -my-3 -mr-[1.125rem] pr-[1.125rem] ${
              scrollDriven
                ? 'overflow-x-hidden'
                : 'overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing'
            } [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30`}
          >
            {PROJECTS.map((item, idx) => (
              <ShelfCard
                key={item.slug}
                item={item}
                isActive={idx === activeIndex}
                rack={Math.min(2, Math.abs(idx - activeIndex))}
                scrollDriven={scrollDriven}
                wasDragged={() => dragState.current.moved > 6}
                onSelect={() => scrollToIndex(idx)}
                onInspect={onSelectProject}
              />
            ))}
            <SummaryCard
              rack={Math.min(2, Math.abs(count - activeIndex))}
              isActive={activeIndex === count}
              scrollDriven={scrollDriven}
            />
          </div>

          {/* Shelf Controls & Indicator */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex gap-[0.3rem]">
                {PROJECTS.map((item, idx) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    aria-label={`Go to ${item.name}`}
                    className={`cursor-pointer h-[3px] transition-all duration-[320ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                      idx === clampedActive
                        ? 'w-5 bg-white'
                        : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <span className="hidden sm:inline text-[10px] tracking-[0.2em] text-[#ff5c3d] font-mono uppercase">
                {scrollDriven
                  ? '↓ Scroll to spin the shelf'
                  : '→ Drag to spin the shelf'}
              </span>
            </div>

            <span className="text-[10px] tracking-[0.2em] text-gray-500 font-mono">
              0{clampedActive + 1} / 0{count}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll = shelf progress indicator on desktop */}
      {scrollDriven && (
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-16 mt-4 flex items-center gap-4">
          <span className="text-[10px] tracking-[0.2em] text-gray-500 font-mono uppercase whitespace-nowrap">
            Scroll = shelf
          </span>
          <div className="flex-1 h-px bg-white/10 relative">
            <div
              className="absolute inset-y-0 left-0 bg-[var(--accent)]"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] tracking-[0.2em] text-gray-500 font-mono tabular-nums whitespace-nowrap">
            P {scrollProgress.toFixed(2)}
          </span>
        </div>
      )}
    </section>
  );
}
