export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
  buttonText?: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "01",
    title: "GRAPHIC DESIGN & VISUAL IDENTITY",
    description:
      "Art-directed visual systems, commercial posters, composite key visuals, and bilingual brand marks built with typographic precision and high-contrast editorial discipline.",
    capabilities: [
      "Brand Identity Systems & Vector Monograms",
      "Commercial Key Visuals & Photo Manipulation",
      "Cohesive Multi-Post Social Media Grid Systems",
      "Bilingual Arabic / English Editorial Typography",
      "Sports, Product & Campaign Poster Art Direction",
      "Adobe Photoshop & Adobe Illustrator Production",
    ],
    buttonText: "VIEW SELECTED WORK",
  },
  {
    id: "02",
    title: "AI BUILDING & CREATIVE AUTOMATION",
    description:
      "Designing and engineering AI-assisted workflows, intelligent automation pipelines, and hybrid creative-technical systems that accelerate production from concept to delivery.",
    capabilities: [
      "AI-Assisted Design & Content Production Workflows",
      "Custom Python Scripting & Process Automation",
      "LLM Prompt Engineering & Structured Synthesis",
      "Automated Visual & Presentation Generation Pipelines",
      "Hybrid Human-in-the-Loop Creative Direction",
      "Rapid Prototyping with Modern AI Tooling",
    ],
  },
  {
    id: "03",
    title: "WEB & APP DEVELOPMENT",
    description:
      "Building responsive web interfaces and cross-platform mobile applications end to end — pairing smooth 60fps motion and modern UI engineering with reliable backend integrations.",
    capabilities: [
      "React.js, TypeScript, JavaScript & Tailwind CSS",
      "Cross-Platform Mobile Apps with React Native & Expo",
      "Interactive Motion with GSAP, ScrollTrigger & WebGL",
      "Firebase, Firestore, Supabase & PostgreSQL Backends",
      "Authentication, In-App Purchases & Push Notifications",
      "End-to-End Testing with Playwright & CI/CD Workflows",
    ],
  },
  {
    id: "04",
    title: "MEDICAL RESEARCH & DATA SYNTHESIS",
    description:
      "Structuring complex clinical, biological, and environmental literature into clear, evidence-backed research briefs and visual narratives without sacrificing scientific rigor.",
    capabilities: [
      "Biomedical & Clinical Literature Synthesis",
      "Molecular & Cellular Mechanism Breakdowns",
      "Environmental & Public-Health Risk Briefs",
      "Structured Academic & Evidence-Based Summarization",
      "Complex Data Translation into Visual Hierarchies",
      "Clear Technical & Scientific Documentation",
    ],
  },
  {
    id: "05",
    title: "PRESENTATION DESIGN",
    description:
      "Transforming dense academic, medical, and executive subject matter into widescreen editorial slide decks that command attention and communicate clearly at a glance.",
    capabilities: [
      "Executive & Research Briefing Decks",
      "Medical & University Lecture Presentations",
      "Custom Masked Layouts & Visual Storytelling",
      "High-Contrast Dark & Editorial Slide Systems",
      "Bilingual Presentation Architecture",
      "Visual Pacing & Information Architecture",
    ],
  },
  {
    id: "06",
    title: "VIDEO EDITING & VISUAL CONTENT",
    description:
      "Producing engaging digital content, motion-driven social assets, and polished video edits tailored for modern platforms, courses, and brand campaigns.",
    capabilities: [
      "Short-Form & Campaign Video Editing",
      "Educational Course Visuals & Thumbnails",
      "Rhythmic Pacing, Sound Sync & Visual Transitions",
      "Social Media Motion & Promotional Assets",
      "Color Grading & Atmospheric Finishing",
      "Cross-Platform Digital Content Packaging",
    ],
  },
];
