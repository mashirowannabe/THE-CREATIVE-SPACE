import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'
import { galleryConfig } from './gallery.config'

type GalleryCameraProps = {
  active: boolean
  inspecting: boolean
  reducedMotion: boolean
}

export function GalleryCamera({ active, inspecting, reducedMotion }: GalleryCameraProps) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const transition = useRef({
    initialized: false, running: false, elapsed: 0,
    width: 0, height: 0,
    target: new Vector3(),
    fromPosition: new Vector3(), toPosition: new Vector3(),
    fromTarget: new Vector3(), toTarget: new Vector3(),
  })

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera) || size.height === 0) return

    const { camera: settings, portal, inspection } = galleryConfig
    const current = transition.current
    const aspect = size.width / size.height
    const stacked = window.matchMedia('(max-width: 800px)').matches
    const targetX = stacked ? portal.centerX : settings.target[0]

    // Preserve the exact Mission 006C default framing calculation.
    camera.aspect = aspect
    camera.filmGauge = settings.filmGauge
    camera.setFocalLength(settings.focalLength)
    const verticalTangent = Math.tan((camera.fov * Math.PI) / 360)
    const horizontalTangent = verticalTangent * aspect
    const horizontalExtent = portal.outerWidth + 2 * Math.abs(portal.centerX - targetX)
    const widthDistance = horizontalExtent / (2 * horizontalTangent * settings.horizontalCoverage)
    const heightDistance = portal.outerHeight / (2 * verticalTangent * settings.verticalCoverage)
    const distance = Math.max(settings.minimumDistance, widthDistance, heightDistance)

    current.fromPosition.copy(camera.position)
    current.fromTarget.copy(current.target)
    current.toPosition.set(targetX, settings.position[1], distance + portal.frontZ)
    current.toTarget.set(targetX, settings.target[1], settings.target[2])
    if (inspecting) {
      current.toPosition.y += inspection.positionYOffset
      current.toPosition.z = distance * inspection.distanceRatio + portal.frontZ
      current.toTarget.x += stacked ? 0 : inspection.targetXOffset
      current.toTarget.y += inspection.targetYOffset
      current.toTarget.z += inspection.targetZOffset
    }

    const resized = current.width !== size.width || current.height !== size.height
    const changed = !current.fromPosition.equals(current.toPosition) || !current.fromTarget.equals(current.toTarget)
    current.running = current.initialized && !resized && !reducedMotion && changed
    current.elapsed = 0
    current.initialized = true
    current.width = size.width
    current.height = size.height
    if (!current.running) {
      camera.position.copy(current.toPosition)
      current.target.copy(current.toTarget)
      camera.lookAt(current.target)
    }
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    // Hidden/offscreen transitions wait for the existing activity signal to resume.
    if (active) invalidate()
  }, [camera, size.width, size.height, inspecting, reducedMotion, invalidate])

  useLayoutEffect(() => {
    if (active) invalidate()
  }, [active, invalidate])

  useFrame((_, delta) => {
    const current = transition.current
    if (!active || !current.running) return

    current.elapsed += Math.min(delta, 0.05)
    const progress = Math.min(current.elapsed / galleryConfig.inspection.duration, 1)
    const eased = progress * progress * (3 - 2 * progress)
    camera.position.lerpVectors(current.fromPosition, current.toPosition, eased)
    current.target.lerpVectors(current.fromTarget, current.toTarget, eased)
    camera.lookAt(current.target)
    camera.updateMatrixWorld()
    current.running = progress < 1
    if (current.running) invalidate()
  })

  return null
}
