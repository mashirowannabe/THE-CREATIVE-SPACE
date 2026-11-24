import { Component, type ReactNode } from 'react'

type GalleryErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
  onError: () => void
}

export class GalleryErrorBoundary extends Component<
  GalleryErrorBoundaryProps,
  { failed: boolean }
> {
  override state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  override componentDidCatch() {
    this.props.onError()
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
