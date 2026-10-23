import { PROFILE } from '../data/profile';
import { FOOTER_NAV_LINKS, SOCIAL_LINKS, type SocialLink } from '../data/socials';
import { gsap, REVEAL_EASE, useSectionReveal } from '../animations/reveal';

const CONTACT_BG_VIDEO = '/assets/contact_bg.mp4';

function RowArrowIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0 text-gray-500 opacity-0 -translate-x-2 transition-[opacity,transform,color] duration-500 ease-out group-hover/row:opacity-100 group-hover/row:translate-x-0 group-hover/row:text-white group-focus-visible/row:opacity-100 group-focus-visible/row:translate-x-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17L17 7M8 7h9v9"
      />
    </svg>
  );
}

interface ContactRowProps {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  breakAll?: boolean;
}

function ContactRow({
  label,
  value,
  href,
  external,
  breakAll,
}: ContactRowProps) {
  const inner = (
    <>
      <span data-row-inner className="min-w-0">
        <span className="block text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-2">
          {label}
        </span>
        <span
          className={`block text-base md:text-lg tracking-wide text-white/85 transition-colors duration-500 group-hover/row:text-white ${
            breakAll ? 'break-all' : ''
          }`}
        >
          {value}
        </span>
      </span>
      {href && <RowArrowIcon />}
    </>
  );

  const rowClasses =
    'group/row flex items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 overflow-hidden transition-colors duration-500';

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={`${rowClasses} hover:bg-white/[0.05] focus-visible:bg-white/[0.05] outline-none`}
      >
        {inner}
      </a>
    );
  }

  return <div className={rowClasses}>{inner}</div>;
}

function SocialIcon({ type }: { type: SocialLink['icon'] }) {
  if (type === 'linkedin') {
    return (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    );
  }
  if (type === 'whatsapp') {
    return (
      <path
        fill="currentColor"
        stroke="none"
        d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29z"
      />
    );
  }
  if (type === 'qr') {
    return (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h2M19 14v2" />
      </>
    );
  }
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
    />
  );
}

export function Contact() {
  const sectionRef = useSectionReveal<HTMLDivElement>(({ scope, desktop }) => {
    const panel = scope.querySelector<HTMLElement>('[data-contact-panel]');
    const cleanups: (() => void)[] = [];

    if (panel) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            once: true,
          },
        })
        .from(panel, {
          y: 48,
          opacity: 0,
          duration: 1.1,
          ease: REVEAL_EASE,
        })
        .from(
          panel.querySelectorAll('[data-row-inner]'),
          {
            yPercent: 105,
            opacity: 0,
            duration: 0.85,
            ease: REVEAL_EASE,
            stagger: 0.08,
          },
          '-=0.75',
        );

      if (desktop) {
        gsap.fromTo(
          panel,
          { yPercent: 3.5 },
          {
            yPercent: -3.5,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        );
      }
    }

    if (window.matchMedia('(pointer: fine)').matches) {
      scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic || '0.3') || 0.3;
        const xTo = gsap.quickTo(el, 'x', {
          duration: 0.55,
          ease: 'power3.out',
        });
        const yTo = gsap.quickTo(el, 'y', {
          duration: 0.55,
          ease: 'power3.out',
        });

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onReset = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onReset);
        el.addEventListener('blur', onReset);
        cleanups.push(() => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onReset);
          el.removeEventListener('blur', onReset);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  const whatsappDirectHref = `${PROFILE.whatsappUrl}?text=${encodeURIComponent(
    "Hi Ahmed, I found your portfolio and I'd like to talk about a project.",
  )}`;

  return (
    <div
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen text-white font-sans flex flex-col overflow-hidden [clip-path:inset(0)]"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-[100vh] object-cover z-0"
      >
        <source src={CONTACT_BG_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0 bg-black/70 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pt-28 pb-16 md:pt-32 flex-1 flex items-center">
        <div className="w-full flex flex-col lg:flex-row gap-14 lg:gap-24">
          {/* Left Column: Status Pill + Monumental Heading + Magnetic CTAs */}
          <div className="w-full lg:w-6/12 flex flex-col">
            <div data-reveal className="mb-7">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.26em] text-gray-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-halo" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Available for work
              </span>
            </div>

            <h2
              data-reveal-lines
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter drop-shadow-2xl mb-7 leading-[0.95]"
            >
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="line block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
                  Get in touch
                </span>
              </span>
            </h2>

            <p
              data-reveal
              data-reveal-delay="0.15"
              className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-md"
            >
              Open for freelance projects, creative direction, AI-assisted
              workflows, web &amp; app builds, and medical or executive
              presentation design. WhatsApp gets the fastest reply.
            </p>

            <div
              data-reveal-group="0.12"
              className="flex flex-wrap gap-3 mt-10"
            >
              <a
                data-magnetic="0.28"
                href={whatsappDirectHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3.5 rounded-full bg-[var(--accent)] text-black text-sm font-medium inline-flex items-center gap-2.5 shadow-lg shadow-black/30 transition-[background-color,box-shadow] duration-300 ease-out hover:bg-[var(--accent-hover)] hover:shadow-xl hover:shadow-black/40"
              >
                <span>Message on WhatsApp</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </a>

              <a
                data-magnetic="0.28"
                href={`mailto:${PROFILE.email}`}
                className="group px-6 py-3.5 rounded-full border border-white/25 text-white text-sm inline-flex items-center gap-2.5 backdrop-blur-md transition-[background-color,color,border-color] duration-300 ease-out hover:bg-white hover:text-black hover:border-white"
              >
                <span>Send an email</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Glassmorphic Contact Card */}
          <div className="w-full lg:w-6/12 flex lg:items-center">
            <div
              data-contact-panel
              className="w-full rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)] overflow-hidden divide-y divide-white/[0.08]"
            >
              <ContactRow
                label="Email"
                value={PROFILE.email}
                href={`mailto:${PROFILE.email}`}
                breakAll
              />
              <ContactRow
                label="Phone"
                value={PROFILE.phone}
                href={`tel:${PROFILE.phoneRaw}`}
              />
              <ContactRow
                label="WhatsApp Direct"
                value="wa.me/201092205396"
                href={PROFILE.whatsappUrl}
                external
              />
              <ContactRow label="Based in" value={PROFILE.location} />

              <div className="px-6 md:px-8 py-6 md:py-7 overflow-hidden">
                <div data-row-inner>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-4">
                    Elsewhere
                  </p>
                  <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.label}
                        data-magnetic="0.35"
                        href={social.href}
                        target={
                          social.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          social.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        aria-label={social.label}
                        title={social.label}
                        className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.07] flex items-center justify-center transition-[background-color,color,border-color] duration-300 ease-out hover:bg-white hover:text-black hover:border-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <SocialIcon type={social.icon} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pb-9">
        <div className="border-t border-white/10 pt-6 flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
          </p>
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {FOOTER_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <span
              className="hidden md:inline h-3 w-px bg-white/15"
              aria-hidden="true"
            />
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href={PROFILE.whatsappQrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300"
            >
              WhatsApp QR
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
