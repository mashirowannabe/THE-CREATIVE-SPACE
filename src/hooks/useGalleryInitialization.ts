import { useEffect, useRef, useState, type RefObject } from 'react'
import { chapterForFragment, projectForFragment } from '../exhibitions/projects'

// Warm the installation when it is just below the viewport. The upper margin
// stays at zero so an adjacent exhibition overview doesn't warm it behind readers.
const APPROACH_MARGIN = 200

export function useGalleryInitialization(
  ref: RefObject<HTMLElement | null>,
  fragment: string,
  returnSignal: number,
) {
  const [initialized, setInitialized] = useState(false)
  const initialFragment = useRef(fragment)
  const initialReadingArrival = useRef((() => {
    const project = projectForFragment(fragment)
    return Boolean(project && chapterForFragment(project, fragment))
  })())

  useEffect(() => {
    if (initialized) return
    const element = ref.current
    if (!element) return
    if (fragment !== initialFragment.current) initialReadingArrival.current = false

    const requested = returnSignal > 0 || fragment === 'botanical-study'
    const initialize = () => {
      if (document.visibilityState !== 'visible') return
      setInitialized(true) // Never reset: subsequent navigation retains this Canvas.
    }
    const checkProximity = () => {
      if (requested) {
        initialize()
        return
      }
      const bounds = element.getBoundingClientRect()
      const approaching = bounds.bottom > 0 && bounds.top < window.innerHeight + APPROACH_MARGIN
      // A fresh chapter link can smooth-scroll through the opening stage. Wait
      // for its first departure before interpreting re-entry as gallery interest.
      if (initialReadingArrival.current) {
        if (!approaching) initialReadingArrival.current = false
        return
      }
      if (approaching) initialize()
    }

    const observer = new IntersectionObserver(checkProximity, {
      rootMargin: `0px 0px ${APPROACH_MARGIN}px 0px`,
      threshold: 0,
    })
    observer.observe(element)
    document.addEventListener('visibilitychange', checkProximity)
    checkProximity()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', checkProximity)
    }
  }, [ref, fragment, returnSignal, initialized])

  return initialized
}
