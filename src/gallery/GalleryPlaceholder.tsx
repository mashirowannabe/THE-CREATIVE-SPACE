import galleryPlaceholder from './gallery-placeholder.svg'

export function GalleryPlaceholder() {
  return (
    <div className="gallery-placeholder">
      <img
        src={galleryPlaceholder}
        width={920}
        height={920}
        alt="A botanical specimen on a plinth inside a warm ivory architectural portal."
        decoding="async"
      />
    </div>
  )
}
