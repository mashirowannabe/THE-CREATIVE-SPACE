import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useGalleryActivity } from '../hooks/useGalleryActivity'
import { useGalleryInitialization } from '../hooks/useGalleryInitialization'
import { GalleryErrorBoundary } from './GalleryErrorBoundary'
import { GalleryPlaceholder } from './GalleryPlaceholder'
import type { GalleryLoadState } from './maple.asset'

const GalleryCanvas = lazy(async () => {
  const module = await import('./GalleryCanvas')
  return { default: module.GalleryCanvas }
})

export function GalleryViewport({ fragment, returnSignal = 0 }: { fragment: string; returnSignal?: number }) {
  const viewport = useRef<HTMLElement>(null)
  const activity = useGalleryActivity(viewport)
  const initialized = useGalleryInitialization(viewport, fragment, returnSignal)
  const [loadState, setLoadState] = useState<GalleryLoadState>('loading')
  const [inspecting, setInspecting] = useState(false)
  const inspectionControl = useRef<HTMLButtonElement>(null)
  const onLoadStateChange = useCallback((state: GalleryLoadState) => {
    setLoadState(state)
    if (state === 'failed') setInspecting(false)
  }, [])
  const onFailure = useCallback(() => onLoadStateChange('failed'), [onLoadStateChange])

  useEffect(() => {
    if (returnSignal > 0) setInspecting(false)
  }, [returnSignal])

  useEffect(() => {
    if (!inspecting) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      setInspecting(false)
      // Keep focus on the persistent control, without stealing it from page navigation.
      if (viewport.current?.contains(document.activeElement)) {
        inspectionControl.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [inspecting])
  return (
    <figure
      ref={viewport}
      className="gallery-viewport"
      id="botanical-study"
      aria-labelledby="gallery-caption"
      tabIndex={-1}
    >
      {initialized ? (
        <GalleryErrorBoundary fallback={<GalleryPlaceholder />} onError={onFailure}>
          <Suspense fallback={<GalleryPlaceholder />}>
            <GalleryCanvas
              active={activity.visible && activity.documentVisible}
              reducedMotion={activity.reducedMotion}
              inspecting={inspecting}
              onLoadStateChange={onLoadStateChange}
            />
          </Suspense>
        </GalleryErrorBoundary>
      ) : <GalleryPlaceholder />}
      <figcaption className="gallery-caption" id="gallery-caption">
        <p className="editorial-label">
          Botanical study
          <br />
          Blender experiments
        </p>
        <button
          ref={inspectionControl}
          className="inspect-control"
          type="button"
          aria-pressed={inspecting}
          disabled={loadState !== 'ready'}
          onClick={() => setInspecting((current) => !current)}
        >
          {inspecting ? 'Return to Gallery' : 'Inspect Specimen'}
        </button>
        <p className="gallery-load-status" role="status" data-ready={loadState === 'ready'}>
          {!initialized
            ? 'Botanical study available in the gallery.'
            : loadState === 'loading'
              ? 'Preparing the botanical study.'
              : loadState === 'failed'
                ? 'Botanical study temporarily unavailable.'
                : ''}
        </p>
      </figcaption>
    </figure>
  )
}
