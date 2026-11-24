import { useId, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { ExhibitionMedia, ImageWindow } from './ExhibitionPrimitives'
import '../styles/artifact-inspector.css'

export function ArtifactInspector({ media, initialWindow, returnFocus, onClose }: {
  media: ExhibitionMedia
  initialWindow?: ImageWindow
  returnFocus: HTMLElement | null
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 1, height: 1 })
  const [zoom, setZoom] = useState<number | 'fit'>(1)
  const [failed, setFailed] = useState(false)
  const centre = useRef(initialWindow ? {
    x: (initialWindow.left + initialWindow.width / 2) / media.width,
    y: (initialWindow.top + initialWindow.height / 2) / media.height,
  } : { x: .5, y: .5 })
  const dragging = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null)
  const titleId = useId()
  const helpId = useId()
  const fit = Math.min(Math.max(1, size.width - 2) / media.width, Math.max(1, size.height - 2) / media.height, 1)
  const scale = zoom === 'fit' ? fit : zoom
  const minimum = Math.min(fit, .25)

  useLayoutEffect(() => {
    const element = dialog.current
    if (!element) return
    let navigating = false
    const previousOverflow = document.body.style.overflow
    const close = () => {
      // Ignore a queued close from StrictMode's setup/cleanup replay.
      if (element.open) return
      if (!navigating && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
      onClose()
    }
    const navigation = () => { navigating = true; element.close() }
    element.addEventListener('close', close)
    window.addEventListener('hashchange', navigation)
    window.addEventListener('popstate', navigation)
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.removeEventListener('close', close)
      window.removeEventListener('hashchange', navigation)
      window.removeEventListener('popstate', navigation)
      if (element.open) element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, returnFocus])

  useLayoutEffect(() => {
    const element = viewport.current
    if (!element) return
    const resize = new ResizeObserver(() => {
      setSize(current => current.width === element.clientWidth && current.height === element.clientHeight
        ? current : { width: element.clientWidth, height: element.clientHeight })
    })
    resize.observe(element)
    return () => resize.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!dialog.current) return
    const active = document.activeElement
    if (!dialog.current.contains(active) || (active instanceof HTMLButtonElement && active.disabled)) {
      const destination = failed ? dialog.current.querySelector<HTMLButtonElement>('button') : viewport.current
      destination?.focus({ preventScroll: true })
    }
  }, [failed, scale, minimum])

  useLayoutEffect(() => {
    const element = viewport.current
    if (!element) return
    element.scrollLeft = centre.current.x * element.scrollWidth - element.clientWidth / 2
    element.scrollTop = centre.current.y * element.scrollHeight - element.clientHeight / 2
  }, [scale, size])

  const changeZoom = (next: number | 'fit') => {
    const element = viewport.current
    if (element) centre.current = {
      x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth,
      y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight,
    }
    setZoom(next)
  }
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || failed) return
    dragging.current = { id: event.pointerId, x: event.clientX, y: event.clientY,
      left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.classList.add('is-dragging')
  }
  const drag = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragging.current
    if (!start || start.id !== event.pointerId) return
    event.currentTarget.scrollLeft = start.left - (event.clientX - start.x)
    event.currentTarget.scrollTop = start.top - (event.clientY - start.y)
  }
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = null
    event.currentTarget.classList.remove('is-dragging')
  }

  return createPortal(
    <dialog ref={dialog} className="artifact-inspector" aria-labelledby={titleId} aria-describedby={helpId}
      onKeyDown={event => {
        if (event.key === 'Escape') event.stopPropagation()
        if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex="0"], summary',
        )).filter(element => element.getClientRects().length > 0)
        const first = controls[0], last = controls[controls.length - 1]
        const outside = !event.currentTarget.contains(document.activeElement)
        if (first && last && (outside || (event.shiftKey ? document.activeElement === first : document.activeElement === last))) {
          event.preventDefault()
          ;(event.shiftKey ? last : first).focus()
        }
      }}>
      <header className="artifact-inspector-header">
        <div><p className="editorial-label">Artifact inspection</p><h2 id={titleId}>{media.label}</h2></div>
        <button className="artifact-button" type="button" autoFocus
          aria-label="Close image inspection and return to the chapter" onClick={() => dialog.current?.close()}>Close <span aria-hidden="true">×</span></button>
      </header>
      <div className="artifact-toolbar" role="group" aria-label="Image zoom">
        <button className="artifact-button" type="button" disabled={failed} aria-pressed={zoom === 'fit'}
          onClick={() => changeZoom('fit')}>Fit</button>
        <button className="artifact-button" type="button" disabled={failed} aria-pressed={zoom === 1}
          aria-label="Show image at actual size (100%)" onClick={() => changeZoom(1)}>100%</button>
        <button className="artifact-button" type="button" aria-label="Zoom out" disabled={failed || scale <= minimum}
          onClick={() => changeZoom(Math.max(minimum, scale / 1.5))}>−</button>
        <button className="artifact-button" type="button" aria-label="Zoom in" disabled={failed || scale >= 3}
          onClick={() => changeZoom(Math.min(3, scale * 1.5))}>+</button>
        <output aria-live="polite" aria-label="Image magnification">{Math.round(scale * 100)}%</output>
      </div>
      <p className="artifact-help" id={helpId}>Scroll or drag to explore. Use Fit to see the whole image.</p>
      <div ref={viewport} className="artifact-viewport" role="region" aria-label="Image detail, scroll to explore" tabIndex={0}
        onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}>
        {failed ? <p className="artifact-error" role="status">Image unavailable. {media.alt}</p> :
          <div className="artifact-image-surface" style={{ width: Math.max(size.width, media.width * scale), height: Math.max(size.height, media.height * scale) }}>
            <img src={media.src} alt={media.alt} width={media.width} height={media.height} draggable={false}
              style={{ width: media.width * scale, height: media.height * scale }} onError={() => setFailed(true)} />
          </div>}
      </div>
      <details className="artifact-notes"><summary>Caption & source</summary>
        <p>{media.caption}</p><p className="project-credit">{media.credit}</p>
      </details>
    </dialog>, document.body,
  )
}
