export const PROJECT_CATEGORIES = [
  'All',
  'Graphic Design',
  'AI & Campaign',
  'Medical & Research',
  'Brand Identity',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectItem {
  id: string;
  index: string;
  number: string;
  slug: string;
  name: string;
  titleMain: string;
  titleItalic: string;
  titleSub: string;
  category: Exclude<ProjectCategory, 'All'>;
  categoryLabel: string;
  year: string;
  tagline: string;
  description: string;
  deliverables: string[];
  tags: string[];
  tools: string[];
  coverImage: string;
  cardImage: string;
  fullImage: string;
  coverWebp: string;
  coverJpg: string;
  cardWebp: string;
  cardJpg: string;
  fullWebp: string;
  fullJpg: string;
  featured: boolean;
  dimensions: string;
  aspectLabel: string;
  metrics: {
    dimension: string;
    format: string;
    craft: string;
  };
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'baleno-caffe',
    index: '01',
    number: '01',
    slug: 'baleno-caffe',
    name: 'Baleno Caffe — Commercial Key Visual',
    titleMain: 'BALENO',
    titleItalic: 'caffe',
    titleSub: 'COMMERCIAL KEY VISUAL',
    category: 'Graphic Design',
    categoryLabel: 'Advertising & Graphic Design',
    year: '2025',
    tagline: 'Arabic calligraffiti & espresso splash product manipulation',
    description:
      "A high-resolution commercial poster and product manipulation for Baleno Caffe ('روقان طول اليوم'). Combines custom Arabic calligraffiti lettering with dynamic espresso splash compositing, tactile paper-cup lighting, and matte-black audio hardware integration.",
    deliverables: [
      '4608 × 8256 px Master Print & Digital Key Visual',
      'Custom Arabic Calligraffiti Headline Lockup',
      'Multi-Layer Espresso Splash & Rim Lighting Composite',
    ],
    tags: [
      'Adobe Photoshop',
      'Product Manipulation',
      'Arabic Calligraffiti',
      'Color Grading',
    ],
    tools: [
      'Adobe Photoshop',
      'Product Manipulation',
      'Arabic Calligraffiti',
      'Color Grading',
    ],
    coverImage: '/assets/projects/baleno-caffe-cover.webp',
    cardImage: '/assets/projects/baleno-caffe-card.webp',
    fullImage: '/assets/projects/baleno-caffe-full.webp',
    coverWebp: '/assets/projects/baleno-caffe-cover.webp',
    coverJpg: '/assets/projects/baleno-caffe-cover.jpg',
    cardWebp: '/assets/projects/baleno-caffe-card.webp',
    cardJpg: '/assets/projects/baleno-caffe-card.jpg',
    fullWebp: '/assets/projects/baleno-caffe-full.webp',
    fullJpg: '/assets/projects/baleno-caffe-full.jpg',
    featured: true,
    dimensions: '4608 × 8256 px',
    aspectLabel: 'Key Visual',
    metrics: {
      dimension: '4608 × 8256',
      format: 'Key Visual',
      craft: 'Photoshop',
    },
  },
  {
    id: 'world-cup-2026',
    index: '02',
    number: '02',
    slug: 'world-cup-2026',
    name: 'FIFA World Cup 2026 — Spain vs Argentina',
    titleMain: 'FUTURE',
    titleItalic: 'faces',
    titleSub: 'THE LEGEND — 2026',
    category: 'Graphic Design',
    categoryLabel: 'Sports Editorial & Digital Compositing',
    year: '2026',
    tagline: 'Dual-tone editorial sports poster under the DOCTRINO mark',
    description:
      "An editorial sports poster conceptualized for the 2026 FIFA World Cup ('The Future Faces the Legend — Spain vs Argentina'). Built with dual crimson-fire and electric-cyan colour grading, atmospheric particle brushwork, and high-detail portrait retouching under the DOCTRINO creative mark.",
    deliverables: [
      'High-Resolution Sports Editorial Poster',
      'Crimson & Electric-Cyan Dual-Tone Atmospheric Grading',
      'Custom DOCTRINO Signature Branding & Typography',
    ],
    tags: [
      'Adobe Photoshop',
      'Digital Compositing',
      'Dual-Tone Grading',
      'Editorial Typography',
    ],
    tools: [
      'Adobe Photoshop',
      'Digital Compositing',
      'Dual-Tone Grading',
      'Editorial Typography',
    ],
    coverImage: '/assets/projects/world-cup-2026-cover.webp',
    cardImage: '/assets/projects/world-cup-2026-card.webp',
    fullImage: '/assets/projects/world-cup-2026-full.webp',
    coverWebp: '/assets/projects/world-cup-2026-cover.webp',
    coverJpg: '/assets/projects/world-cup-2026-cover.jpg',
    cardWebp: '/assets/projects/world-cup-2026-card.webp',
    cardJpg: '/assets/projects/world-cup-2026-card.jpg',
    fullWebp: '/assets/projects/world-cup-2026-full.webp',
    fullJpg: '/assets/projects/world-cup-2026-full.jpg',
    featured: true,
    dimensions: '1792 × 2400 px',
    aspectLabel: 'Sports Poster',
    metrics: {
      dimension: '1792 × 2400',
      format: 'Editorial Poster',
      craft: 'Compositing',
    },
  },
  {
    id: 'la-wildfires-research',
    index: '03',
    number: '03',
    slug: 'la-wildfires-research',
    name: 'Los Angeles Wildfires 2025: Research Brief',
    titleMain: 'WILDFIRE',
    titleItalic: 'research',
    titleSub: 'HAZARDS & RISK BRIEF',
    category: 'Medical & Research',
    categoryLabel: 'Research Synthesis & Presentation Design',
    year: '2025',
    tagline: '16:9 environmental hazard synthesis & executive presentation',
    description:
      'An executive research presentation brief examining the 2025 Los Angeles Wildfires across hazards, geographic risk corridors, structural impacts, and aggravating meteorological factors. Designed with cinematic full-bleed photography, warm editorial rules, and clear typographic hierarchy.',
    deliverables: [
      '5333 × 3000 px (16:9) Widescreen Executive Presentation',
      'Structured Hazard, Risk & Impact Analytical Framework',
      'High-Contrast Editorial Slide Grid & Visual Hierarchy',
    ],
    tags: [
      'Research Synthesis',
      'Presentation Design',
      'Information Architecture',
      'Visual Storytelling',
    ],
    tools: [
      'Research Synthesis',
      'Presentation Design',
      'Information Architecture',
      'Visual Storytelling',
    ],
    coverImage: '/assets/projects/la-wildfires-research-cover.webp',
    cardImage: '/assets/projects/la-wildfires-research-card.webp',
    fullImage: '/assets/projects/la-wildfires-research-full.webp',
    coverWebp: '/assets/projects/la-wildfires-research-cover.webp',
    coverJpg: '/assets/projects/la-wildfires-research-cover.jpg',
    cardWebp: '/assets/projects/la-wildfires-research-card.webp',
    cardJpg: '/assets/projects/la-wildfires-research-card.jpg',
    fullWebp: '/assets/projects/la-wildfires-research-full.webp',
    fullJpg: '/assets/projects/la-wildfires-research-full.jpg',
    featured: true,
    dimensions: '5333 × 3000 px',
    aspectLabel: '16:9 Research Deck',
    metrics: {
      dimension: '5333 × 3000',
      format: '16:9 Research Deck',
      craft: 'Data Synthesis',
    },
  },
  {
    id: 'pizza-grid-campaign',
    index: '04',
    number: '04',
    slug: 'pizza-grid-campaign',
    name: 'Artisanal Pizza — 9-Post Social Media Grid',
    titleMain: 'SOCIAL',
    titleItalic: 'grid',
    titleSub: '9-POST CAMPAIGN SYSTEM',
    category: 'AI & Campaign',
    categoryLabel: 'Social Media Art Direction & Campaign',
    year: '2025',
    tagline: 'Continuous 3×3 Instagram puzzle grid & UI-metaphor ads',
    description:
      "A unified 3×3 Instagram campaign grid engineered as a single continuous visual canvas ('بيتزا مصنوعة باحترافية'). Integrates cross-tile food photography, interactive UI metaphors (ON toggle and fuel-gauge dials), promotional badges, and bold Arabic advertising typography.",
    deliverables: [
      '6000 × 6000 px Seamless 9-Tile Social Media Canvas',
      'Interactive UI Metaphor Graphics (Toggle & Gauge)',
      'Bilingual Promotional & Delivery Ad System',
    ],
    tags: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Social Grid System',
      'Arabic Ad Typography',
    ],
    tools: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Social Grid System',
      'Arabic Ad Typography',
    ],
    coverImage: '/assets/projects/pizza-grid-campaign-cover.webp',
    cardImage: '/assets/projects/pizza-grid-campaign-card.webp',
    fullImage: '/assets/projects/pizza-grid-campaign-full.webp',
    coverWebp: '/assets/projects/pizza-grid-campaign-cover.webp',
    coverJpg: '/assets/projects/pizza-grid-campaign-cover.jpg',
    cardWebp: '/assets/projects/pizza-grid-campaign-card.webp',
    cardJpg: '/assets/projects/pizza-grid-campaign-card.jpg',
    fullWebp: '/assets/projects/pizza-grid-campaign-full.webp',
    fullJpg: '/assets/projects/pizza-grid-campaign-full.jpg',
    featured: true,
    dimensions: '6000 × 6000 px',
    aspectLabel: '3×3 Campaign Grid',
    metrics: {
      dimension: '6000 × 6000',
      format: '3×3 Social Grid',
      craft: 'Campaign Art',
    },
  },
  {
    id: 'microsoft-365-ai',
    index: '05',
    number: '05',
    slug: 'microsoft-365-ai',
    name: 'Microsoft 365 + AI — Course Key Visual',
    titleMain: 'M365 + AI',
    titleItalic: 'course',
    titleSub: 'CAMPAIGN ART DIRECTION',
    category: 'AI & Campaign',
    categoryLabel: 'AI Education & Creative Compositing',
    year: '2025',
    tagline: '5-lecture Microsoft 365 + AI curriculum campaign poster',
    description:
      'A custom character-composited campaign poster for an intensive 5-lecture Microsoft 365 + Artificial Intelligence course under DOCTRINO. Blends custom portrait integration, halftone comic-ink illustration elements, architectural grid perspective, and bilingual title lockups.',
    deliverables: [
      '2160 × 2700 px Course Launch Key Visual',
      'Mixed-Media Portrait & Halftone Illustration Composite',
      'DOCTRINO Educational Brand Lockup',
    ],
    tags: [
      'Adobe Photoshop',
      'Portrait Compositing',
      'AI Course Direction',
      'Halftone & Vector Ink',
    ],
    tools: [
      'Adobe Photoshop',
      'Portrait Compositing',
      'AI Course Direction',
      'Halftone & Vector Ink',
    ],
    coverImage: '/assets/projects/microsoft-365-ai-cover.webp',
    cardImage: '/assets/projects/microsoft-365-ai-card.webp',
    fullImage: '/assets/projects/microsoft-365-ai-full.webp',
    coverWebp: '/assets/projects/microsoft-365-ai-cover.webp',
    coverJpg: '/assets/projects/microsoft-365-ai-cover.jpg',
    cardWebp: '/assets/projects/microsoft-365-ai-card.webp',
    cardJpg: '/assets/projects/microsoft-365-ai-card.jpg',
    fullWebp: '/assets/projects/microsoft-365-ai-full.webp',
    fullJpg: '/assets/projects/microsoft-365-ai-full.jpg',
    featured: false,
    dimensions: '2160 × 2700 px',
    aspectLabel: 'Campaign Poster',
    metrics: {
      dimension: '2160 × 2700',
      format: 'Course Poster',
      craft: 'AI & Design',
    },
  },
  {
    id: 'dna-replication-medical',
    index: '06',
    number: '06',
    slug: 'dna-replication-medical',
    name: 'DNA Replication in Eukaryotes — Medical Deck',
    titleMain: 'EUKARYOTIC',
    titleItalic: 'dna',
    titleSub: 'MEDICAL PRESENTATION',
    category: 'Medical & Research',
    categoryLabel: 'Medical Research & Academic Presentation',
    year: '2025',
    tagline: 'Molecular biology presentation for Faculty of Medicine (BUC)',
    description:
      'An academic medical presentation created for the Faculty of Medicine at Badr University in Cairo (BUC) exploring DNA replication mechanisms in eukaryotes. Uses staggered vertical pill masks to frame 3D molecular microscopy alongside structured clinical typography.',
    deliverables: [
      '1920 × 1080 px Academic Medical Slide Architecture',
      'Masked 3D Chromatin & Double-Helix Visual Framing',
      'Scientific Synthesis of Eukaryotic Replication Enzymes',
    ],
    tags: [
      'Medical Research',
      'Presentation Design',
      'Scientific Visualization',
      'Masked Slide Layout',
    ],
    tools: [
      'Medical Research',
      'Presentation Design',
      'Scientific Visualization',
      'Masked Slide Layout',
    ],
    coverImage: '/assets/projects/dna-replication-medical-cover.webp',
    cardImage: '/assets/projects/dna-replication-medical-card.webp',
    fullImage: '/assets/projects/dna-replication-medical-full.webp',
    coverWebp: '/assets/projects/dna-replication-medical-cover.webp',
    coverJpg: '/assets/projects/dna-replication-medical-cover.jpg',
    cardWebp: '/assets/projects/dna-replication-medical-card.webp',
    cardJpg: '/assets/projects/dna-replication-medical-card.jpg',
    fullWebp: '/assets/projects/dna-replication-medical-full.webp',
    fullJpg: '/assets/projects/dna-replication-medical-full.jpg',
    featured: false,
    dimensions: '1920 × 1080 px',
    aspectLabel: '16:9 Medical Slide',
    metrics: {
      dimension: '1920 × 1080',
      format: 'Medical Deck',
      craft: 'Biomedical',
    },
  },
  {
    id: 'glow-with-confidence',
    index: '07',
    number: '07',
    slug: 'glow-with-confidence',
    name: 'Glow With Confidence — Beauty & App Campaign',
    titleMain: 'GLOW WITH',
    titleItalic: 'confidence',
    titleSub: 'APP & BEAUTY CAMPAIGN',
    category: 'AI & Campaign',
    categoryLabel: 'Commercial Advertising & App Promo',
    year: '2025',
    tagline: 'Luxury skincare & mobile app acquisition visual',
    description:
      "A luxury skincare and mobile application promotional visual ('Glow With Confidence') set in a stylized violet-and-amber architectural interior. Balances product staging, specular floor reflections, and bilingual conversion CTAs for iOS App Store and Google Play.",
    deliverables: [
      '1080 × 1350 px Social & Mobile App Acquisition Visual',
      'Architectural Lighting & Specular Reflection Staging',
      'App Store & Google Play Conversion Footer',
    ],
    tags: [
      'Adobe Photoshop',
      'Lighting & Reflections',
      'App Marketing Design',
      'Bilingual Layout',
    ],
    tools: [
      'Adobe Photoshop',
      'Lighting & Reflections',
      'App Marketing Design',
      'Bilingual Layout',
    ],
    coverImage: '/assets/projects/glow-with-confidence-cover.webp',
    cardImage: '/assets/projects/glow-with-confidence-card.webp',
    fullImage: '/assets/projects/glow-with-confidence-full.webp',
    coverWebp: '/assets/projects/glow-with-confidence-cover.webp',
    coverJpg: '/assets/projects/glow-with-confidence-cover.jpg',
    cardWebp: '/assets/projects/glow-with-confidence-card.webp',
    cardJpg: '/assets/projects/glow-with-confidence-card.jpg',
    fullWebp: '/assets/projects/glow-with-confidence-full.webp',
    fullJpg: '/assets/projects/glow-with-confidence-full.jpg',
    featured: false,
    dimensions: '1080 × 1350 px',
    aspectLabel: '4:5 Social Ad',
    metrics: {
      dimension: '1080 × 1350',
      format: 'App Campaign',
      craft: 'Ad Direction',
    },
  },
  {
    id: 'novie-brand',
    index: '08',
    number: '08',
    slug: 'novie-brand',
    name: 'Novie — Ready-to-Wear Brand Identity',
    titleMain: 'NOVIE',
    titleItalic: 'apparel',
    titleSub: 'BRAND IDENTITY SYSTEM',
    category: 'Brand Identity',
    categoryLabel: 'Brand Identity & Logo Design',
    year: '2025',
    tagline: 'Bilingual ready-to-wear fashion monogram & seal system',
    description:
      "A bilingual brand identity and emblem system for Novie Ready-to-Wear ('ملابس جاهزة'). Features a custom ribbon-folded 'N' monogram housed inside a dual-ring teal and charcoal seal, paired with high-contrast serif Latin and traditional Arabic typography.",
    deliverables: [
      'Scalable Vector Master Monogram & Emblem (PDF/SVG)',
      'Bilingual Latin + Arabic Logotype Lockup',
      'Teal, Charcoal & Warm Cream Brand Palette Specification',
    ],
    tags: [
      'Adobe Illustrator',
      'Vector Monogram',
      'Brand Identity',
      'Bilingual Typography',
    ],
    tools: [
      'Adobe Illustrator',
      'Vector Monogram',
      'Brand Identity',
      'Bilingual Typography',
    ],
    coverImage: '/assets/projects/novie-brand-cover.webp',
    cardImage: '/assets/projects/novie-brand-card.webp',
    fullImage: '/assets/projects/novie-brand-full.webp',
    coverWebp: '/assets/projects/novie-brand-cover.webp',
    coverJpg: '/assets/projects/novie-brand-cover.jpg',
    cardWebp: '/assets/projects/novie-brand-card.webp',
    cardJpg: '/assets/projects/novie-brand-card.jpg',
    fullWebp: '/assets/projects/novie-brand-full.webp',
    fullJpg: '/assets/projects/novie-brand-cover.jpg',
    featured: false,
    dimensions: 'Vector PDF',
    aspectLabel: 'Identity Mark',
    metrics: {
      dimension: 'Vector PDF',
      format: 'Brand Identity',
      craft: 'Illustrator',
    },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

export const HERO_ATLAS_THUMBS = [
  '/assets/projects/baleno-caffe-cover.jpg',
  '/assets/projects/world-cup-2026-cover.jpg',
  '/assets/projects/pizza-grid-campaign-cover.jpg',
  '/assets/projects/la-wildfires-research-cover.jpg',
];
