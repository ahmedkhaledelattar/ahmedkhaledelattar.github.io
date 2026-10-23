import { useEffect, useRef, useState } from 'react';
import { SERVICES } from '../data/services';
import { gsap, REVEAL_EASE, useSectionReveal } from '../animations/reveal';

export function Services() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sectionRef = useSectionReveal<HTMLElement>(({ scope }) => {
    const rows = gsap.utils.toArray<HTMLElement>('[data-service-row]', scope);
    if (rows.length) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rows[0],
            start: 'top 88%',
            once: true,
          },
        })
        .from(rows, {
          yPercent: 12,
          opacity: 0,
          duration: 0.7,
          ease: REVEAL_EASE,
          stagger: 0.08,
        })
        .from(
          rows,
          {
            '--rule-scale': 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
          },
          0,
        );
    }
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="service"
      className="bg-[#050505] text-white pt-12 pb-0 px-6 md:px-16 flex flex-col relative overflow-hidden"
    >
      {/* Right-aligned Monumental Heading */}
      <div className="flex flex-col md:flex-row items-end md:items-start justify-end w-full mt-0 z-0 pb-12">
        <div className="flex flex-col md:flex-row items-start justify-end gap-2 md:gap-4 lg:gap-8 pr-2 md:pr-0 text-right">
          <h2
            data-reveal-lines
            className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-2xl leading-[1.1] md:leading-[0.9] text-right"
          >
            {['WHAT I', 'CAN DO'].map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="line block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* 6 Numbered Service Rows */}
      <div className="z-10 relative mt-0 -mx-6 md:-mx-16 border-t border-white/20">
        {SERVICES.map((service, idx) => {
          const isLit =
            expandedIdx === idx || (!isMobile && hoveredIdx === idx);
          const isExpanded = expandedIdx === idx;

          return (
            <div
              key={service.id}
              ref={(el) => {
                rowRefs.current[idx] = el;
              }}
              data-index={idx}
              data-service-row
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpandedIdx(isExpanded ? null : idx);
                }
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`service-row relative py-5 md:py-7 px-6 md:px-16 cursor-pointer transition-colors duration-500 ease-out outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] ${
                isLit ? 'bg-[var(--surface-lit)]' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start">
                {/* Left Half: Number + Title + Capabilities */}
                <div className="flex items-start justify-between w-full lg:w-1/2 gap-2">
                  <div className="flex items-start gap-3 md:gap-16 w-full min-w-0">
                    <div className="h-7 flex items-center md:h-10 flex-shrink-0">
                      <span
                        className={`text-lg md:text-3xl font-medium transition-colors duration-300 ease-in-out leading-none ${
                          isLit ? 'text-[var(--surface-lit-ink)]' : 'text-white'
                        }`}
                      >
                        {service.id}
                      </span>
                    </div>

                    <div className="flex flex-col w-full min-w-0">
                      <div className="h-7 flex items-center md:h-10">
                        <h3
                          className={`text-[11px] sm:text-sm md:text-xl lg:text-2xl font-black uppercase tracking-wide leading-none transition-colors duration-300 ease-in-out whitespace-nowrap overflow-hidden text-ellipsis ${
                            isLit
                              ? 'text-[var(--surface-lit-ink)]'
                              : 'text-white'
                          }`}
                        >
                          {service.title}
                        </h3>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
                          isExpanded
                            ? 'max-h-[800px] opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="pt-6 lg:pt-8 flex flex-col gap-3">
                          <ul
                            className={`transition-colors duration-300 ease-in-out text-sm md:text-base font-light space-y-2 flex flex-col ${
                              isLit
                                ? 'text-[var(--surface-lit-ink-soft)]'
                                : 'text-gray-300'
                            }`}
                          >
                            {service.capabilities.map((cap, capIdx) => (
                              <li
                                key={capIdx}
                                className="flex items-start gap-3"
                              >
                                <span
                                  className={`transition-colors duration-300 ease-in-out mt-1.5 opacity-70 text-[10px] ${
                                    isLit
                                      ? 'text-[var(--surface-lit-ink)]'
                                      : 'text-[var(--accent)]'
                                  }`}
                                >
                                  ■
                                </span>
                                <span>{cap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Arrow */}
                  <div className="h-7 flex items-center flex-shrink-0 lg:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-6 h-6 transition-all duration-300 ${
                        isLit
                          ? 'text-[var(--surface-lit-ink)]'
                          : 'text-[var(--accent)]'
                      } ${isExpanded ? '-rotate-45' : 'rotate-45'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Right Half: Description + Button + Desktop Arrow */}
                <div className="flex flex-row gap-6 w-full lg:w-1/2 justify-between lg:justify-end relative items-start">
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out flex flex-col items-start w-full ${
                      isExpanded
                        ? 'max-h-[800px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pt-4 md:pt-6 lg:pt-[72px] flex flex-col gap-6 w-full pr-0 lg:pr-12">
                      <p
                        className={`transition-colors duration-300 ease-in-out text-base md:text-lg leading-relaxed max-w-lg font-light ${
                          isLit
                            ? 'text-[var(--surface-lit-ink-soft)]'
                            : 'text-gray-300'
                        }`}
                      >
                        {service.description}
                      </p>

                      {service.buttonText && (
                        <a
                          href="#project"
                          onClick={(e) => e.stopPropagation()}
                          className={`w-fit font-bold uppercase tracking-wider text-xs md:text-sm px-6 py-3 border transition-colors duration-300 ease-in-out flex items-center gap-2 mt-2 ${
                            isLit
                              ? 'bg-[var(--surface-lit-ink)] text-[var(--surface-lit)] border-[var(--surface-lit-ink)]'
                              : 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)]'
                          }`}
                        >
                          <span className="w-2 h-2 border-t border-l border-current" />
                          {service.buttonText}
                          <span className="w-2 h-2 border-b border-r border-current" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Desktop Arrow */}
                  <div className="hidden lg:flex flex-shrink-0 h-10 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-10 h-10 transition-all duration-300 ${
                        isLit
                          ? 'text-[var(--surface-lit-ink)]'
                          : 'text-[var(--accent)]'
                      } ${isExpanded ? '-rotate-45' : 'rotate-45'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
