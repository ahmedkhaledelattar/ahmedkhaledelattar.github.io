import { useLayoutEffect, useRef, type DependencyList } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const REVEAL_EASE = 'power3.out';
export const REVEAL_DURATION = 0.9;
export const REVEAL_START = 'top 88%';

const REVEAL_VARIANTS: Record<string, gsap.TweenVars> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -48 },
  right: { x: 48 },
  scale: { scale: 0.94 },
  fade: {},
};

if (typeof window !== 'undefined') {
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') {
    refresh();
  } else {
    window.addEventListener('load', refresh, { once: true });
  }
  document.fonts?.ready.then(refresh);
}

export function applyDataReveal(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-reveal]', scope).forEach((el) => {
    const variantKey = el.dataset.reveal || 'up';
    const variant = REVEAL_VARIANTS[variantKey] ?? REVEAL_VARIANTS.up;
    gsap.from(el, {
      ...variant,
      opacity: 0,
      duration: REVEAL_DURATION,
      delay: parseFloat(el.dataset.revealDelay || '0') || 0,
      ease: REVEAL_EASE,
      scrollTrigger: {
        trigger: el,
        start: REVEAL_START,
        once: true,
      },
    });
  });
}

export function applyDataRevealGroup(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]', scope).forEach((group) => {
    const children = gsap.utils.toArray<HTMLElement>(':scope > *', group);
    if (children.length) {
      gsap.from(children, {
        y: 32,
        opacity: 0,
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        stagger: parseFloat(group.dataset.revealGroup || '0.08') || 0.08,
        scrollTrigger: {
          trigger: group,
          start: REVEAL_START,
          once: true,
        },
      });
    }
  });
}

export function applyDataRevealLines(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-reveal-lines]', scope).forEach((container) => {
    const lines = gsap.utils.toArray<HTMLElement>('.line', container);
    if (lines.length) {
      gsap.from(lines, {
        yPercent: 110,
        duration: 1.1,
        ease: REVEAL_EASE,
        stagger: 0.12,
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          once: true,
        },
      });
    }
  });
}

export function applyDataParallax(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-parallax]', scope).forEach((el) => {
    const distance = parseFloat(el.dataset.parallax || '40') || 40;
    const triggerEl = el.closest<HTMLElement>('[data-parallax-frame]') || el;
    gsap.fromTo(
      el,
      { yPercent: -distance / 10 },
      {
        yPercent: distance / 10,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

export interface SectionRevealContext {
  scope: HTMLElement;
  desktop: boolean;
  mobile: boolean;
}

export function useSectionReveal<T extends HTMLElement = HTMLDivElement>(
  customCallback?: (ctx: SectionRevealContext) => void | (() => void),
  deps: DependencyList = [],
) {
  const scopeRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 768px)',
      },
      (context) => {
        const { motion, desktop } = context.conditions as {
          motion: boolean;
          desktop: boolean;
        };
        if (motion) {
          applyDataReveal(scope);
          applyDataRevealGroup(scope);
          applyDataRevealLines(scope);
          applyDataParallax(scope);
          return customCallback?.({
            scope,
            desktop: Boolean(desktop),
            mobile: !desktop,
          });
        }
      },
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}

export { gsap, ScrollTrigger };
