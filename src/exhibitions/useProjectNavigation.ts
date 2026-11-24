import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { projectForFragment, projects, type ProjectId } from './projects'

function readFragment() {
  try { return decodeURIComponent(window.location.hash.slice(1)) }
  catch { return window.location.hash.slice(1) }
}

export function useProjectNavigation() {
  const [destination, setDestination] = useState(() => {
    const fragment = readFragment()
    return { fragment, project: projectForFragment(fragment), revision: 0 }
  })
  const [galleryReturnSignal, setGalleryReturnSignal] = useState(0)
  const returnOrigin = useRef<ProjectId | null>(null)
  const handledFragment = useRef(destination.fragment)

  const synchronize = useCallback((repeat = false) => {
    const fragment = readFragment()
    // Traversal can dispatch both popstate and hashchange for the same entry.
    if (!repeat && handledFragment.current === fragment) return
    handledFragment.current = fragment
    setDestination(current => ({
      fragment,
      project: projectForFragment(fragment) ?? current.project,
      revision: current.revision + 1,
    }))
  }, [])

  useLayoutEffect(() => {
    const onFragmentChange = () => synchronize()
    window.addEventListener('hashchange', onFragmentChange)
    window.addEventListener('popstate', onFragmentChange)
    return () => {
      window.removeEventListener('hashchange', onFragmentChange)
      window.removeEventListener('popstate', onFragmentChange)
    }
  }, [synchronize])

  useLayoutEffect(() => {
    const target = document.getElementById(destination.fragment)
    if (!target) return // Unknown fragments retain ordinary browser behavior.
    const frame = requestAnimationFrame(() => {
      const origin = destination.fragment === 'featured-work' ? returnOrigin.current : null
      const workControl = origin ? document.getElementById(projects[origin].workControlId) : null
      // An explicit return keeps the specimen visible, including on stacked
      // mobile layouts, while focus goes to its matching work control.
      const galleryLocation = origin
        ? window.matchMedia('(max-width: 800px)').matches
          ? document.getElementById('botanical-study')
          : document.querySelector<HTMLElement>('.exhibition-main')
        : null
      // Scroll the reading section into view, retaining the heading as the focus
      // destination. This includes the preceding return/local navigation controls.
      const readingLocation = target.matches('.project-exhibition h2, .project-exhibition h3, .sprinkler-material h4')
        ? target.closest<HTMLElement>('.project-introduction, .project-chapter, .sprinkler-material')
        : null
      const location = galleryLocation ?? (destination.fragment.startsWith('work-')
        ? document.getElementById('featured-work') ?? target
        : readingLocation ?? target)
      location.scrollIntoView({ block: 'start' })
      ;(workControl ?? target).focus({ preventScroll: true })
      returnOrigin.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [destination])

  const selectProject = useCallback((id: ProjectId) => {
    const project = projects[id]
    const fragment = project.chapters[0]?.id ?? project.workControlId
    if (readFragment() === fragment) synchronize(true)
    else window.location.hash = fragment
  }, [synchronize])

  // Native anchors call this only to handle a repeated destination; normal
  // clicks, modified clicks and browser history retain native URL semantics.
  const repeatAnchor = useCallback((fragment: string) => {
    if (readFragment() === fragment) synchronize(true)
  }, [synchronize])

  const returnToGallery = useCallback(() => {
    returnOrigin.current = destination.project
    setGalleryReturnSignal(current => current + 1)
    repeatAnchor('featured-work')
  }, [destination.project, repeatAnchor])

  return {
    selectedProject: destination.project,
    fragment: destination.fragment,
    selectProject, repeatAnchor, returnToGallery, galleryReturnSignal,
  }
}
