import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { PROFILE } from '../data/profile';
import { HERO_ATLAS_THUMBS } from '../data/projects';
import { PageLoader } from './PageLoader';
import { HeroMosaicCanvas } from './HeroMosaicCanvas';

const HERO_PORTRAIT_SRC = '/assets/hero_center.png';

const HERO_TITLE_CLASSES =
  'flex items-baseline text-[11vw] sm:text-[10.5vw] md:text-[5.5rem] lg:text-[8.5rem] xl:text-[11.5rem] font-black tracking-tighter drop-shadow-2xl leading-none uppercase';
const HERO_GRADIENT_TEXT =
  'text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800';

export interface HeroProps {
  onPreloadComplete?: () => void;
}

export function Hero({ onPreloadComplete }: HeroProps) {
  const TARGET_WORD = 'AHMEDKHALED'; // Splits cleanly into AHMED (0..5) and KHALED (5..11)
  const INITIAL_WORD = PROFILE.wordmark; // DOCTRINO (8 chars, pivot on 'I' at index 5)

  const [displayWord, setDisplayWord] = useState(INITIAL_WORD);
  const [loaderDone, setLoaderDone] = useState(false);
  const [showLoaderNode, setShowLoaderNode] = useState(true);
  const [playMosaic, setPlayMosaic] = useState(false);

  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const leftWordRef = useRef<HTMLSpanElement | null>(null);
  const rightWordRef = useRef<HTMLSpanElement | null>(null);
  const roleRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const expRef = useRef<HTMLDivElement | null>(null);
  const anchorImgRef = useRef<HTMLImageElement | null>(null);
  const onCompleteRef = useRef(onPreloadComplete);

  useEffect(() => {
    onCompleteRef.current = onPreloadComplete;
  }, [onPreloadComplete]);

  const portraitReady = useMemo(
    () =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = HERO_PORTRAIT_SRC;
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      }),
    [],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    const safetyTimer = setTimeout(() => {
      document.body.style.overflow = 'auto';
      onCompleteRef.current?.();
    }, 5500);
    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!loaderDone) return;

    let step = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let active = true;
    let ctx: gsap.Context | undefined;

    portraitReady.then(() => {
      if (!active) return;

      setPlayMosaic(true);

      intervalId = setInterval(() => {
        step += 1.25;
        if (step >= TARGET_WORD.length) {
          setDisplayWord(TARGET_WORD);
          clearInterval(intervalId);
          ctx = gsap.context(() => {
            const tl = gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = 'auto';
                onCompleteRef.current?.();
              },
            });

            const isMobile = window.innerWidth < 768;

            tl.to(
              titleWrapRef.current,
              {
                top: isMobile ? '70%' : '73%',
                duration: 1.15,
                ease: 'power3.inOut',
              },
              '+=0.05',
            );

            tl.fromTo(
              [roleRef.current, ctaRef.current, expRef.current].filter(Boolean),
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.95,
                stagger: 0.12,
                ease: 'power3.out',
              },
              '-=0.8',
            );

            const splitGap = isMobile
              ? window.innerWidth * 0.08
              : Math.min(220, window.innerWidth * 0.12);

            tl.to(
              leftWordRef.current,
              {
                x: -splitGap / 2,
                duration: 1.15,
                ease: 'power3.out',
              },
              '<',
            );

            tl.to(
              rightWordRef.current,
              {
                x: splitGap / 2,
                duration: 1.15,
                ease: 'power3.out',
              },
              '<',
            );
          });
          return;
        }

        setDisplayWord(
          TARGET_WORD.split('')
            .map((ch, idx) =>
              idx < Math.floor(step)
                ? ch
                : idx < INITIAL_WORD.length
                  ? INITIAL_WORD[idx]
                  : '',
            )
            .join(''),
        );
      }, 28);
    });

    return () => {
      active = false;
      if (intervalId) clearInterval(intervalId);
      ctx?.revert();
    };
  }, [loaderDone, portraitReady]);

  const leftHalf = displayWord.slice(0, 5);
  const rightHalf = displayWord.slice(5);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        background: 'radial-gradient(circle, #222222 0%, #000000 80%)',
      }}
    >
      {/* Subtle dark backdrop blur layer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Prominent Experience & Positioning Indicator (Top-Left / Editorial Meta) */}
      <div
        ref={expRef}
        className="absolute top-18 left-6 md:top-24 md:left-12 z-20 flex items-center gap-4 md:gap-5 opacity-0 pointer-events-none select-none"
      >
        <div className="flex items-baseline gap-2.5 border-l-2 border-[var(--accent)] pl-3.5 py-0.5">
          <span className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter text-white leading-none">
            {PROFILE.experienceYears}
          </span>
          <div className="flex flex-col text-[8px] md:text-[10px] font-mono uppercase tracking-[0.26em] text-gray-400 leading-tight">
            <span>YEARS</span>
            <span>EXPERIENCE</span>
          </div>
        </div>
        <span className="hidden lg:inline-block h-6 w-px bg-white/15" />
        <p className="hidden lg:block max-w-xs text-[11px] text-gray-400 font-light leading-snug tracking-wide">
          {PROFILE.heroStatement}
        </p>
      </div>

      {/* Main Split Display Wordmark + Role + Contact CTA */}
      <div
        ref={titleWrapRef}
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none flex flex-col items-start w-max"
      >
        <h1
          ref={headingRef}
          className={`${HERO_TITLE_CLASSES} transition-opacity duration-300 ${
            loaderDone ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            ref={leftWordRef}
            className={`inline-block will-change-transform ${HERO_GRADIENT_TEXT}`}
          >
            {leftHalf}
          </span>
          <span
            ref={rightWordRef}
            className={`inline-block will-change-transform ${HERO_GRADIENT_TEXT}`}
          >
            {rightHalf}
          </span>
        </h1>

        {showLoaderNode && (
          <div
            className={`absolute top-0 left-0 transition-opacity duration-300 ${
              loaderDone ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <PageLoader
              word={INITIAL_WORD}
              className={HERO_TITLE_CLASSES}
              letterClassName={HERO_GRADIENT_TEXT}
              dotClassName="bg-gray-200"
              speed={1.85}
              onComplete={() => {
                setLoaderDone(true);
                setTimeout(() => setShowLoaderNode(false), 320);
              }}
            />
          </div>
        )}

        {/* Role Positioning Line */}
        <div
          ref={roleRef}
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:-bottom-12 lg:left-4 text-white text-xs sm:text-base md:text-xl lg:text-2xl xl:text-3xl drop-shadow-md z-10 opacity-0 w-max"
        >
          <span className="font-bold tracking-tight">{PROFILE.role.bold}</span>{' '}
          <span className="font-light italic text-gray-300 font-serif">
            {PROFILE.role.light}
          </span>
        </div>

        {/* Contact Pill & Arrow Action */}
        <div
          ref={ctaRef}
          className="absolute -bottom-22 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:-bottom-12 lg:left-auto lg:right-4 flex items-center gap-2 md:gap-4 pointer-events-auto z-10 opacity-0 w-max"
        >
          <a
            href="#contact"
            aria-label="Scroll to contact section"
            className="group w-8 h-8 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border border-gray-400/30 flex items-center justify-center backdrop-blur-md bg-black/20 hover:bg-white/10 hover:border-gray-400/50 transition-all duration-300 cursor-pointer"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-gray-300 transition-transform duration-300 group-hover:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 7L7 17M7 17H16M7 17V8"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="px-4 py-1.5 md:px-6 md:py-2.5 rounded-full border border-gray-400/30 flex items-center justify-center backdrop-blur-md bg-black/20 hover:bg-white/10 hover:border-gray-400/50 transition-all cursor-pointer"
          >
            <span className="text-gray-300 text-xs md:text-base italic font-light tracking-wider font-serif">
              Contact
            </span>
          </a>
        </div>
      </div>

      {/* Anchor Image for Portrait Mosaic Geometry */}
      <div className="absolute inset-x-0 top-[6vh] md:top-[2vh] z-10 text-center text-white flex flex-col items-center w-full pointer-events-none">
        <img
          ref={anchorImgRef}
          src={HERO_PORTRAIT_SRC}
          alt=""
          aria-hidden="true"
          className="invisible w-auto max-w-none h-[96vh] md:h-[138vh] object-contain"
        />
      </div>

      {/* WebGL2 Interactive Tile Mosaic Portrait */}
      <HeroMosaicCanvas
        src={HERO_PORTRAIT_SRC}
        thumbs={HERO_ATLAS_THUMBS}
        anchorRef={anchorImgRef}
        play={playMosaic}
        label="Portrait of Ahmed Khaled composed of interactive tiles from his creative projects"
        className="z-10"
      />
    </section>
  );
}
