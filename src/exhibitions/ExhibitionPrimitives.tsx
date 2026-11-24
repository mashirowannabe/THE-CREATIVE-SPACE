import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { projects, type ExhibitionChapter, type ProjectId } from './projects'
import { ArtifactInspector } from './ArtifactInspector'

export type ExhibitionMedia = {
  label: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
  credit: string
  inspectionFocus?: { x: number; y: number }
}

export type ImageWindow = { left: number; top: number; width: number; height: number }
type ImagePreview = { window: ImageWindow; label: string; alt: string; caption: string; credit: string }

export function ExhibitionFigure({ media, eager = false, detail = false, preview }: {
  media: ExhibitionMedia
  eager?: boolean
  detail?: boolean
  preview?: ImagePreview
}) {
  const label = preview?.label ?? media.label
  const [failed, setFailed] = useState(false)
  const [inspecting, setInspecting] = useState(false)
  const returnFocus = useRef<HTMLElement | null>(null)
  const inspectionWindow = useRef<ImageWindow | undefined>(undefined)
  const fallback = useRef<HTMLParagraphElement>(null)
  const focusFailedImage = useRef(false)
  const closeInspection = useCallback(() => setInspecting(false), [])
  const inspect = (event: MouseEvent<HTMLButtonElement>) => {
    returnFocus.current = event.currentTarget
    const area = preview?.window ?? { left: 0, top: 0, width: media.width, height: media.height }
    if (event.detail > 0 && event.currentTarget.classList.contains('project-image-button')) {
      const bounds = event.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
      inspectionWindow.current = { left: area.left + x * area.width, top: area.top + y * area.height, width: 0, height: 0 }
    } else inspectionWindow.current = preview?.window ?? {
      left: (media.inspectionFocus?.x ?? .5) * media.width,
      top: (media.inspectionFocus?.y ?? .5) * media.height,
      width: 0, height: 0,
    }
    setInspecting(true)
  }
  useLayoutEffect(() => {
    if (!failed) return
    if (inspecting) setInspecting(false)
    if (focusFailedImage.current) { fallback.current?.focus({ preventScroll: true }); focusFailedImage.current = false }
  }, [failed, inspecting])
  return (
    <figure className={`project-figure${detail ? ' project-figure-detail' : ''}`}>
      {failed ? (
        <p ref={fallback} className="project-image-fallback" role="status" tabIndex={-1}>Image unavailable. {media.alt}</p>
      ) : (
        <div className="project-image-frame">
          <button className={`project-image-button${preview ? ' project-image-window' : ''}`} type="button"
            aria-label={`Inspect image: ${label}`} onClick={inspect}
            style={preview ? { aspectRatio: preview.window.width / preview.window.height } : undefined}>
            <img src={media.src} width={media.width} height={media.height} alt={preview?.alt ?? media.alt}
              style={preview ? { position: 'absolute', left: 0, top: 0,
                width: `${media.width / preview.window.width * 100}%`, maxWidth: 'none',
                transform: `translate(${-preview.window.left / media.width * 100}%, ${-preview.window.top / media.height * 100}%)` } : undefined}
              loading={eager ? 'eager' : 'lazy'} decoding="async" onError={event => {
                focusFailedImage.current = inspecting || Boolean(event.currentTarget.closest('figure')?.contains(document.activeElement))
                setFailed(true)
              }} />
          </button>
        </div>
      )}
      <figcaption>
        <p>{preview?.caption ?? media.caption}</p>
        <p className="project-credit">{preview?.credit ?? media.credit}</p>
        {!failed && <div className="project-figure-actions">
          <button className="project-link" type="button" aria-label={`Inspect image: ${label}`} onClick={inspect}>Inspect image <span aria-hidden="true">↗</span></button>
          <a className="project-link" href={media.src} target="_blank" rel="noopener noreferrer"
            aria-label={`View full image: ${label} (opens in a new tab)`}>
            View full image <span className="project-link-note">(new tab)</span> <span aria-hidden="true">↗</span>
          </a>
        </div>}
      </figcaption>
      {inspecting && !failed && <ArtifactInspector media={media} initialWindow={inspectionWindow.current}
        returnFocus={returnFocus.current} onClose={closeInspection} />}
    </figure>
  )
}

export function ExhibitionChapterSection({ chapter, number, title, children }: {
  chapter: ExhibitionChapter
  number: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="project-chapter" aria-labelledby={chapter.id}>
      <ReadingControls />
      <p className="editorial-label project-chapter-number">{number} / {chapter.label}</p>
      <h3 id={chapter.id} tabIndex={-1}>{title}</h3>
      {children}
    </section>
  )
}

function ordinaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey
}

export function GalleryReturnLink({ onReturn }: { onReturn: () => void }) {
  return <a className="project-link" href="#featured-work"
    onClick={event => { if (ordinaryClick(event)) onReturn() }}>
    <span aria-hidden="true">↑</span> Return to gallery
  </a>
}

export function ChapterIndex({ project, currentChapter, onRepeat, onReturn }: {
  project: ProjectId
  currentChapter: string
  onRepeat: (fragment: string) => void
  onReturn: () => void
}) {
  return (
    <nav className="project-index" aria-label={`${projects[project].title} chapters`}>
      <p className="editorial-label">In this exhibition</p>
      <ol>
        {projects[project].chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a href={`#${chapter.id}`} aria-current={currentChapter === chapter.id ? 'location' : undefined}
              onClick={event => { if (ordinaryClick(event)) onRepeat(chapter.id) }}>
              <span className="project-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span>{chapter.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <GalleryReturnLink onReturn={onReturn} />
    </nav>
  )
}

type ReadingNavigation = {
  project: ProjectId
  currentChapter: string
  onRepeat: (fragment: string) => void
  onReturn: () => void
  onSelect: (project: ProjectId) => void
}

const ReadingNavigationContext = createContext<ReadingNavigation | null>(null)
export const ReadingNavigationProvider = ReadingNavigationContext.Provider

// Native, local disclosures keep navigation close to reading without a sticky
// overlay, custom keyboard behavior, or a separate routing system.
export function ReadingControls() {
  const navigation = useContext(ReadingNavigationContext)
  if (!navigation) return null
  const { project, currentChapter, onRepeat, onReturn, onSelect } = navigation
  const otherProject = project === 'icameal' ? 'blender' : 'icameal'
  const close = (element: HTMLElement) => element.closest('details')?.removeAttribute('open')
  return (
    <details className="project-reading-controls">
      <summary>Chapters & projects</summary>
      <nav aria-label={`${projects[project].title} reading controls`}>
        <ol>
          {projects[project].chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a className="project-link" href={`#${chapter.id}`}
                aria-current={currentChapter === chapter.id ? 'location' : undefined}
                onClick={event => {
                  if (ordinaryClick(event)) { close(event.currentTarget); onRepeat(chapter.id) }
                }}>
                <span className="project-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {chapter.label}
              </a>
            </li>
          ))}
        </ol>
        <div className="project-reading-actions">
          <a className="project-link" href="#featured-work" onClick={event => {
            if (ordinaryClick(event)) { close(event.currentTarget); onReturn() }
          }}>Return to gallery <span aria-hidden="true">↑</span></a>
          <button className="project-link" type="button" onClick={event => {
            close(event.currentTarget); onSelect(otherProject)
          }}>Select {projects[otherProject].title} <span aria-hidden="true">↗</span></button>
        </div>
      </nav>
    </details>
  )
}

export function SubsectionIndex({ sections, onRepeat }: {
  sections: readonly { id: string; label: string }[]
  onRepeat: (fragment: string) => void
}) {
  return <nav className="project-subsection-index" aria-label="Material Study sections">
    {sections.map(section => <a className="project-link" key={section.id} href={`#${section.id}`}
      onClick={event => { if (ordinaryClick(event)) onRepeat(section.id) }}>{section.label}</a>)}
  </nav>
}
