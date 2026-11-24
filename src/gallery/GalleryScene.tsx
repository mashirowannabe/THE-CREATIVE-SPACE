import { ArchitecturalPortal } from './ArchitecturalPortal'
import { ExhibitionPlinth } from './ExhibitionPlinth'
import { GalleryEnvironment } from './GalleryEnvironment'
import { GalleryLighting } from './GalleryLighting'

type GallerySceneProps = {
  animate: boolean
  reducedMotion: boolean
  onReady: (canAnimate: boolean) => void
  onFailure: () => void
}

export function GalleryScene({ animate, reducedMotion, onReady, onFailure }: GallerySceneProps) {
  return (
    <group name="gallery-scene">
      <GalleryEnvironment />
      <ArchitecturalPortal />
      <ExhibitionPlinth />
      <GalleryLighting />
      <GalleryErrorBoundary fallback={null} onError={onFailure}>
        <Suspense fallback={null}>
          <JapaneseMaple animate={animate} reducedMotion={reducedMotion} onReady={onReady} />
        </Suspense>
      </GalleryErrorBoundary>
    </group>
  )
}
import { Suspense } from 'react'
import { GalleryErrorBoundary } from './GalleryErrorBoundary'
import { JapaneseMaple } from './JapaneseMaple'
