import { useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ACESFilmicToneMapping,
  PCFShadowMap,
  SRGBColorSpace,
} from 'three'
import { galleryConfig } from './gallery.config'
import { GalleryScene } from './GalleryScene'
import { GalleryCamera } from './GalleryCamera'
import { GalleryPlaceholder } from './GalleryPlaceholder'
import type { GalleryLoadState } from './maple.asset'

type GalleryCanvasProps = {
  active: boolean
  reducedMotion: boolean
  inspecting: boolean
  onLoadStateChange: (state: GalleryLoadState) => void
}

export function GalleryCanvas({ active, reducedMotion, inspecting, onLoadStateChange }: GalleryCanvasProps) {
  const [canAnimate, setCanAnimate] = useState(false)
  const [contextFailed, setContextFailed] = useState(false)
  const animate = active && !reducedMotion && canAnimate
  const onReady = useCallback((validAnimation: boolean) => {
    setCanAnimate(validAnimation)
    onLoadStateChange('ready')
  }, [onLoadStateChange])
  const onFailure = useCallback(() => {
    setCanAnimate(false)
    onLoadStateChange('failed')
  }, [onLoadStateChange])
  const onContextLost = useCallback((event: Event) => {
    event.preventDefault()
    setContextFailed(true)
    onFailure()
  }, [onFailure])

  if (contextFailed) return <GalleryPlaceholder />
  return (
    <div className="gallery-canvas" aria-hidden="true">
      <Canvas
        camera={{
          position: galleryConfig.camera.position,
          near: 0.1,
          far: 60,
        }}
        dpr={galleryConfig.dpr}
        frameloop={animate ? 'always' : 'demand'}
        onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', onContextLost)}
        shadows={{ type: PCFShadowMap }}
        style={{ pointerEvents: 'none', touchAction: 'auto' }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        fallback={<div className="gallery-canvas-fallback" />}
      >
        <GalleryCamera active={active} inspecting={inspecting} reducedMotion={reducedMotion} />
        <GalleryScene
          animate={animate}
          reducedMotion={reducedMotion}
          onReady={onReady}
          onFailure={onFailure}
        />
      </Canvas>
    </div>
  )
}
