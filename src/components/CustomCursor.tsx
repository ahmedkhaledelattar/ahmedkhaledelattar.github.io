import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const fineMq = window.matchMedia('(pointer: fine)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(fineMq.matches && motionMq.matches);
    update();
    fineMq.addEventListener('change', update);
    motionMq.addEventListener('change', update);
    return () => {
      fineMq.removeEventListener('change', update);
      motionMq.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !cursorRef.current) return;
    const el = cursorRef.current;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' });

    const onPointerMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target || target.closest('[role="application"], [role="dialog"]')) {
        setVisible(false);
        return;
      }

      setVisible(true);
      setInteractive(
        Boolean(
          target.closest('a, button, [role="button"], [data-parallax-frame]'),
        ),
      );
    };

    const onPointerLeave = () => setVisible(false);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-[90] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full transition-[width,height,opacity,background-color,border-color] duration-200 ease-out ${
        !visible
          ? 'w-0 h-0 opacity-0'
          : interactive
            ? 'w-7 h-7 bg-[var(--accent)]/15 border border-[var(--accent)]/60 opacity-100'
            : 'w-2.5 h-2.5 bg-[var(--accent)]/70 border border-transparent opacity-70'
      }`}
    />
  );
}
