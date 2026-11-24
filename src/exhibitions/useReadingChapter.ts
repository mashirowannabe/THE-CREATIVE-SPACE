import { useEffect, useLayoutEffect, useState } from 'react'
import { chapterForFragment, projects, type ProjectId } from './projects'

// Reading position is presentation state. It never writes history or moves focus.
export function useReadingChapter(project: ProjectId | null, fragment: string) {
  const [reading, setReading] = useState<{ project: ProjectId; chapter: string } | null>(null)

  useLayoutEffect(() => {
    if (!project) return
    const chapter = chapterForFragment(project, fragment)
    if (chapter) setReading(current => current?.project === project && current.chapter === chapter
      ? current : { project, chapter })
  }, [project, fragment])

  useEffect(() => {
    if (!project) return
    const chapters = projects[project].chapters.map(chapter => ({
      id: chapter.id,
      section: document.getElementById(chapter.id)?.closest<HTMLElement>('.project-introduction, .project-chapter'),
    })).filter((chapter): chapter is { id: string; section: HTMLElement } => Boolean(chapter.section))
    const article = chapters[0]?.section.closest('article')
    if (!article || !chapters.length) return
    let frame = 0
    const update = () => {
      frame = 0
      const bounds = article.getBoundingClientRect()
      if (bounds.top >= window.innerHeight || bounds.bottom <= 0) return
      const readingLine = Math.min(96, window.innerHeight / 4)
      let currentChapter = chapters[0].id
      for (const chapter of chapters) {
        if (chapter.section.getBoundingClientRect().top <= readingLine) currentChapter = chapter.id
        else break
      }
      setReading(current => current?.project === project && current.chapter === currentChapter
        ? current : { project, chapter: currentChapter })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(schedule, { threshold: [0, 0.1, 0.5, 1] })
    const resizeObserver = new ResizeObserver(schedule)
    chapters.forEach(({ section }) => { observer.observe(section); resizeObserver.observe(section) })
    // A long chapter can fill the viewport without crossing an IO threshold.
    // Throttle passive scroll measurements to one frame; no running frame loop.
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [project])

  return project ? reading?.project === project ? reading.chapter
    : chapterForFragment(project, fragment) ?? projects[project].chapters[0].id : ''
}
