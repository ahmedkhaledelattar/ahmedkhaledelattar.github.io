import { Fragment, useRef } from 'react';
import { ABOUT_WORDS, PROFILE } from '../data/profile';
import {
  gsap,
  REVEAL_DURATION,
  REVEAL_EASE,
  useSectionReveal,
} from '../animations/reveal';
import { TechStack } from './TechStack';

const CORE_PILLARS = ['DESIGN', 'DEVELOPMENT', 'AI', 'RESEARCH'] as const;

export function About() {
  const bioRef = useRef<HTMLParagraphElement | null>(null);

  const sectionRef = useSectionReveal<HTMLElement>(({ scope, desktop }) => {
    gsap.from('[data-intro]', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: REVEAL_EASE,
      scrollTrigger: {
        trigger: scope,
        start: 'top 70%',
        once: true,
      },
    });

    if (!bioRef.current) return;

    if (desktop) {
      gsap.fromTo(
        bioRef.current.querySelectorAll('.word'),
        { color: '#52525b', opacity: 0.2 },
        {
          color: '#ffffff',
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 85%',
            end: 'bottom 50%',
            scrub: true,
          },
        },
      );
    } else {
      gsap.from(bioRef.current, {
        y: 24,
        opacity: 0,
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        scrollTrigger: {
          trigger: bioRef.current,
          start: 'top 90%',
          once: true,
        },
      });
    }
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#050505] text-white pt-24 pb-0 px-6 md:px-16 flex flex-col justify-center relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full z-10 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-12 lg:gap-24 items-center">
          {/* Left Column: Label + Monumental Intro + Digital Portrait & Experience Badge */}
          <div className="flex flex-col items-center lg:items-start">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-gray-500 mb-4 md:mb-6">
              About me
            </span>
            <h2
              data-intro
              className="text-[18vw] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800 drop-shadow-2xl leading-[0.85]"
            >
              Intro
            </h2>

            {/* Experience & Digital Portrait Dossier Strip */}
            <div
              data-reveal="up"
              data-reveal-delay="0.15"
              className="mt-8 w-full max-w-md flex items-center gap-4 p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md"
            >
              <div className="relative w-14 h-16 shrink-0 rounded-xl overflow-hidden border border-white/15 bg-[#0a0a0c]">
                <img
                  src="/assets/portrait_digital.webp"
                  alt="Ahmed Khaled digital scanline portrait"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-white">
                    {PROFILE.name}
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[var(--accent)] uppercase">
                    {PROFILE.experienceYears} YRS EXP
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-light truncate mt-0.5">
                  {PROFILE.role.full}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CORE_PILLARS.map((pillar) => (
                    <span
                      key={pillar}
                      className="px-2 py-0.5 text-[9px] font-mono tracking-[0.16em] uppercase rounded-sm bg-white/[0.05] text-gray-300 border border-white/[0.08]"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scroll-Scrubbed Bio Card */}
          <div className="relative bg-white/5 backdrop-blur-md px-5 py-7 md:p-10 lg:p-12 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/[0.07] transition-colors duration-300 text-left">
            <p
              ref={bioRef}
              lang="en"
              className="text-gray-300 text-[15px] sm:text-base md:text-lg lg:text-xl leading-[1.7] md:leading-relaxed font-light text-pretty hyphens-auto"
            >
              {ABOUT_WORDS.map((word, idx) => (
                <Fragment key={idx}>
                  <span className={`word ${word.className || ''}`}>
                    {word.text}
                  </span>
                  {idx < ABOUT_WORDS.length - 1 && ' '}
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* The Stack — 4-Row Horizontal Marquee */}
      <TechStack />
    </section>
  );
}
