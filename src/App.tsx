import { FeaturedWorkIndex } from './components/FeaturedWorkIndex'
import { EditorialSections } from './components/EditorialSections'
import { HeroCopy } from './components/HeroCopy'
import { SiteHeader } from './components/SiteHeader'
import { GalleryViewport } from './gallery/GalleryViewport'
import { ProjectExhibitionRegion } from './exhibitions/ProjectExhibitionRegion'
import { useProjectNavigation } from './exhibitions/useProjectNavigation'

export default function App() {
  const navigation = useProjectNavigation()
  return (
    <div className="exhibition" id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <div className="exhibition-main">
          <HeroCopy />
          <GalleryViewport fragment={navigation.fragment} returnSignal={navigation.galleryReturnSignal} />
          <FeaturedWorkIndex selectedProject={navigation.selectedProject} onSelect={navigation.selectProject} />
        </div>
        <ProjectExhibitionRegion project={navigation.selectedProject} fragment={navigation.fragment}
          onRepeat={navigation.repeatAnchor} onReturn={navigation.returnToGallery}
          onSelect={navigation.selectProject} />
        <EditorialSections />
      </main>
    </div>
  )
}
