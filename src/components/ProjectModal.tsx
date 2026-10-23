import { useEffect } from 'react';
import type { ProjectItem } from '../data/projects';
import { PROFILE } from '../data/profile';

export interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const whatsappText = encodeURIComponent(
    `Hi Ahmed, I'm impressed by your "${project.name}" project (${project.categoryLabel}) and would love to discuss a similar project.`,
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0b0b0d] text-white shadow-[0_32px_90px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 bg-[#0b0b0d]/90 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--accent)]">
              {project.number}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 truncate">
              {project.categoryLabel} — {project.year}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project preview"
            className="cursor-pointer w-9 h-9 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white hover:text-black transition-colors flex items-center justify-center"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10 items-start">
          {/* Full Uncropped Artwork */}
          <div className="lg:col-span-7 flex items-center justify-center bg-[#050505] rounded-xl border border-white/10 overflow-hidden p-2 sm:p-4">
            <img
              src={project.fullImage}
              alt={project.name}
              className="w-full max-h-[72vh] object-contain rounded-lg"
            />
          </div>

          {/* Case Study Details */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--accent)] mb-4">
                {project.metrics.format} • {project.metrics.dimension}
              </span>
              <h3
                id="modal-project-title"
                className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[1.05] mb-3"
              >
                {project.name}
              </h3>
              <p className="text-sm font-serif italic text-gray-300 mb-6">
                {project.tagline}
              </p>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Deliverables */}
              <div className="mb-6">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.28em] text-gray-500 mb-3">
                  Key Deliverables
                </h4>
                <ul className="space-y-2 text-sm text-gray-300 font-light">
                  {project.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="text-[10px] text-[var(--accent)]">■</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.28em] text-gray-500 mb-3">
                  Tools & Craft
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/${PROFILE.whatsappNumber}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[var(--accent)] text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center gap-2"
              >
                <span>Commission Similar Work</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </a>
              <a
                href={project.fullImage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full border border-white/25 text-white text-xs font-medium uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-colors"
              >
                Open High-Res
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
