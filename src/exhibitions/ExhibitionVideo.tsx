import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ExhibitionMedia } from './ExhibitionPrimitives'

export type ExhibitionVideoMedia = ExhibitionMedia & { poster: string }

export function ExhibitionVideo({ media }: { media: ExhibitionVideoMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fallbackRef = useRef<HTMLParagraphElement>(null)
  const visible = useRef(false)
  const restoreFocus = useRef(false)
  const [failed, setFailed] = useState(false)
  const captionId = useId()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting && entry.intersectionRatio > 0.05
      if (!visible.current) video.pause()
    }, { threshold: [0, 0.05] })
    observer.observe(video)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') video.pause()
    }
    const onMotionChange = () => { if (motion.matches) video.pause() }
    document.addEventListener('visibilitychange', onVisibility)
    motion.addEventListener('change', onMotionChange)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      motion.removeEventListener('change', onMotionChange)
      video.pause()
    }
  }, [failed])

  useLayoutEffect(() => {
    if (failed && restoreFocus.current) {
      fallbackRef.current?.focus({ preventScroll: true })
      restoreFocus.current = false
    }
  }, [failed])

  return (
    <figure className="project-figure project-video">
      {failed ? (
        <p ref={fallbackRef} className="project-image-fallback" role="status" tabIndex={-1}>
          Video unavailable in this browser. {media.alt}
        </p>
      ) : (
        <div className="project-image-frame">
          <video ref={videoRef} src={media.src} poster={media.poster}
            width={media.width} height={media.height} controls playsInline preload="none"
            aria-label="Recorded Fire Sprinkler particle experiment" aria-describedby={captionId}
            onPlay={() => {
              if (!visible.current || document.visibilityState !== 'visible') videoRef.current?.pause()
            }}
            onError={() => {
              restoreFocus.current = document.activeElement === videoRef.current
              setFailed(true)
            }} />
        </div>
      )}
      <figcaption id={captionId}>
        <p>{media.caption}</p>
        <p className="project-credit">{media.credit}</p>
        {!failed && <a className="project-link" href={media.src} download>
          Download supplied preview <span className="project-link-note">(MKV)</span> <span aria-hidden="true">↓</span>
        </a>}
      </figcaption>
    </figure>
  )
}
