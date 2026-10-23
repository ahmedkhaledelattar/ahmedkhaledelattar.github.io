import { useMemo, useState } from 'react';
import {
  PROJECTS,
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type ProjectItem,
} from '../data/projects';
import { PROFILE } from '../data/profile';
import { ScrollTrigger, useSectionReveal } from '../animations/reveal';

export interface SelectedWorkProps {
  onSelectProject: (project: ProjectItem) => void;
}

export function SelectedWork({ onSelectProject }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [showAllInList, setShowAllInList] = useState(false);

  const displayedProjects = useMemo(() => {
    if (activeCategory !== 'All') {
      return PROJECTS.filter((p) => p.category === activeCategory);
    }
    return showAllInList ? PROJECTS : PROJECTS.filter((p) => p.featured);
  }, [activeCategory, showAllInList]);

  const sectionRef = useSectionReveal<HTMLDivElement>(undefined, [
    activeCategory,
    showAllInList,
  ]);

  const handleCategoryChange = (cat: ProjectCategory) => {
    setActiveCategory(cat);
    setTimeout(() => ScrollTrigger.refresh(), 60);
  };

  const handleToggleAll = () => {
    setActiveCategory('All');
    setShowAllInList((prev) => !prev);
    setTimeout(() => ScrollTrigger.refresh(), 60);
  };

  return (
    <div
      ref={sectionRef}
      id="project"
      className="bg-[#050505] w-full text-white pt-10 md:pt-20 pb-24 px-6 md:px-16"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start w-full z-10 gap-10 lg:gap-0 mb-12 lg:mb-16">
        <div className="w-full lg:w-7/12 overflow-visible">
          <h2
            data-reveal-lines
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter drop-shadow-2xl leading-[0.9] uppercase whitespace-nowrap"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="line flex items-center gap-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
                  Selected
                </span>
                <span className="font-light italic text-gray-300 lowercase font-serif pr-4 pt-2 md:pt-4">
                  work
                </span>
              </span>
            </span>
          </h2>
        </div>

        <div
          data-reveal-group
          className="w-full lg:w-4/12 flex flex-col items-start lg:mt-4"
        >
          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-8">
            A curated selection of commercial key visuals, AI-augmented campaign
            systems, scientific medical presentations, and bilingual brand
            identities crafted with precision.
          </p>
          <button
            type="button"
            onClick={handleToggleAll}
            className="cursor-pointer px-6 py-2.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] text-black font-medium text-xs md:text-sm hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-colors flex items-center gap-2"
          >
            <span>
              {showAllInList && activeCategory === 'All'
                ? 'Show Featured (4)'
                : `Explore All Works (${PROJECTS.length})`}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Multidisciplinary Category Filter Bar */}
      <div className="flex items-center gap-2.5 flex-wrap mb-16 lg:mb-24 pb-6 border-b border-white/10">
        {PROJECT_CATEGORIES.map((category) => {
          const isSelected = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`cursor-pointer px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.18em] transition-all duration-300 border ${
                isSelected
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)] font-bold'
                  : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Alternating Zigzag Case Study Rows */}
      <div className="flex flex-col gap-24 lg:gap-40 w-full">
        {displayedProjects.map((project, idx) => {
          const isEven = idx % 2 === 0;
          const whatsappMsg = encodeURIComponent(
            `Hi Ahmed, I saw "${project.name}" in your portfolio and would like to discuss a project.`,
          );

          return (
            <div
              key={project.id}
              className={`flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center justify-between gap-12 lg:gap-16 w-full group`}
            >
              {/* Parallax Artwork Container */}
              <div
                data-reveal={isEven ? 'left' : 'right'}
                data-parallax-frame
                onClick={() => onSelectProject(project)}
                role="button"
                tabIndex={0}
                aria-label={`Inspect full artwork for ${project.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProject(project);
                  }
                }}
                className="w-full lg:w-6/12 overflow-hidden relative aspect-[16/10] bg-[#111] rounded-sm cursor-pointer border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <img
                  src={project.coverImage}
                  alt={project.name}
                  loading="lazy"
                  decoding="async"
                  data-parallax="60"
                  className="w-full h-[112%] -mt-[6%] object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-5 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent)]">
                    Click to inspect full resolution
                  </span>
                </div>
              </div>

              {/* Editorial Case Study Details */}
              <div
                data-reveal-group="0.1"
                className="w-full lg:w-5/12 flex flex-col items-start"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[var(--accent)] text-xs md:text-sm font-bold tracking-widest uppercase">
                    0{idx + 1}
                  </span>
                  <span className="h-px w-6 bg-white/20" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-gray-400">
                    {project.categoryLabel} • {project.year}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.1] uppercase mb-5">
                  {project.titleMain}{' '}
                  <span className="font-light italic text-gray-300 lowercase font-serif">
                    {project.titleItalic}
                  </span>
                  <br />
                  {project.titleSub}
                </h3>

                <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Discipline Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-gray-300 tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="cursor-pointer px-6 py-2.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] text-black text-xs md:text-sm font-medium hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-colors inline-flex items-center gap-2"
                  >
                    <span>Inspect Artwork</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </button>

                  <a
                    href={`https://wa.me/${PROFILE.whatsappNumber}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer px-6 py-2.5 rounded-full border border-white/30 text-white text-xs md:text-sm hover:bg-white hover:text-black transition-colors inline-flex items-center gap-2"
                  >
                    <span>Enquire</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
