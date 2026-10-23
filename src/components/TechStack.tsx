import type { CSSProperties } from 'react';
import { STACK_ROWS, type StackRowConfig } from '../data/skills';

function MarqueeRow({ items, copies, duration, reverse }: StackRowConfig) {
  const repeated = Array.from({ length: copies }, () => items).flat();
  const trackItems = [...repeated, ...repeated];

  const trackStyle = {
    '--marquee-duration': `${duration}s`,
    '--marquee-direction': reverse ? 'reverse' : 'normal',
  } as CSSProperties;

  return (
    <div className="marquee-row" aria-hidden="true">
      <div className="marquee-track" style={trackStyle}>
        {trackItems.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="mx-1 md:mx-1.5 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 md:px-5 md:py-2.5 text-[13px] md:text-[15px] font-medium tracking-wide text-gray-300 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-white/25" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  const allSkills = STACK_ROWS.flatMap((row) => row.items);

  return (
    <div className="relative mt-auto -mx-6 md:-mx-16 pt-10 pb-2 bg-[#030303]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center gap-4 px-6 md:px-16 mb-6">
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-gray-500 whitespace-nowrap">
          The stack
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      <ul className="sr-only">
        {allSkills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <div className="flex flex-col gap-2.5 md:gap-3">
        {STACK_ROWS.map((row) => (
          <MarqueeRow
            key={row.label}
            label={row.label}
            items={row.items}
            copies={row.copies}
            duration={row.duration}
            reverse={row.reverse}
          />
        ))}
      </div>
    </div>
  );
}
