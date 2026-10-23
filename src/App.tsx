import { useCallback, useState } from 'react';
import type { ProjectItem } from './data/projects';
import { ScrollTrigger } from './animations/reveal';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { SelectedWork } from './components/SelectedWork';
import { CreativeVault } from './components/CreativeVault';
import { PixelBreakerSection } from './components/PixelBreakerSection';
import { Contact } from './components/Contact';
import { ProjectModal } from './components/ProjectModal';
import { CustomCursor } from './components/CustomCursor';

export function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  const handlePreloadComplete = useCallback(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  return (
    <>
      <CustomCursor />
      <Navigation />
      <main className="bg-[#050505] text-white min-h-screen">
        <Hero onPreloadComplete={handlePreloadComplete} />
        <About />
        <Services />
        <SelectedWork onSelectProject={setSelectedProject} />
        <CreativeVault onSelectProject={setSelectedProject} />
        <PixelBreakerSection />
        <Contact />
      </main>
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

export default App;
