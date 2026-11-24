import { useEffect, useState, type RefObject } from 'react'

export function useGalleryActivity(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(
    () => document.visibilityState === 'visible',
  )
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const element = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.05),
      { threshold: [0, 0.05] },
    )
    if (element) observer.observe(element)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(media.matches)
    const updateVisibility = () => setDocumentVisible(document.visibilityState === 'visible')
    media.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    updateMotion()
    updateVisibility()
    return () => {
      observer.disconnect()
      media.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [ref])

  return { visible, reducedMotion, documentVisible }
}
