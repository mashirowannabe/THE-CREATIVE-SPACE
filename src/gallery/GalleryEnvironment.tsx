import { useMemo } from 'react'
import { Shape } from 'three'
import { galleryConfig } from './gallery.config'

export function GalleryEnvironment() {
  const { colors, environment, portal } = galleryConfig
  const { floor, wall } = environment
  const wallLeft = environment.centerX - wall.width / 2
  const wallRight = environment.centerX + wall.width / 2
  const portalLeft = portal.centerX - portal.outerWidth / 2
  const portalRight = portal.centerX + portal.outerWidth / 2
  const recessBackZ = portal.frontZ - portal.recessDepth
  const wallProfile = useMemo(() => {
    const profile = new Shape()
    profile.moveTo(wallLeft, 0)
    profile.lineTo(portalLeft, 0)
    profile.lineTo(portalLeft, portal.outerHeight)
    profile.lineTo(portalRight, portal.outerHeight)
    profile.lineTo(portalRight, 0)
    profile.lineTo(wallRight, 0)
    profile.lineTo(wallRight, wall.height)
    profile.lineTo(wallLeft, wall.height)
    profile.closePath()
    return profile
  }, [wallLeft, wallRight, portalLeft, portalRight, wall.height, portal.outerHeight])
  const wallOptions = useMemo(
    () => ({ depth: wall.thickness, bevelEnabled: false, steps: 1 }),
    [wall.thickness],
  )

  return (
    <group name="gallery-environment">
      <mesh
        name="gallery-floor"
        position={[
          environment.centerX,
          -floor.thickness / 2,
          recessBackZ + floor.depth / 2,
        ]}
        receiveShadow
      >
        <boxGeometry args={[floor.width, floor.thickness, floor.depth]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.96} />
      </mesh>

      <mesh name="gallery-back-wall" position={[0, 0, -wall.thickness]} receiveShadow>
        <extrudeGeometry
          args={[wallProfile, wallOptions]}
        />
        <meshStandardMaterial color={colors.ivory} roughness={0.96} />
      </mesh>

      <mesh
        name="gallery-recess-back-wall"
        position={[
          portal.centerX,
          portal.openingHeight / 2,
          recessBackZ - wall.thickness / 2,
        ]}
        receiveShadow
      >
        <boxGeometry args={[portal.openingWidth, portal.openingHeight, wall.thickness]} />
        <meshStandardMaterial color={colors.raised} roughness={0.96} />
      </mesh>
    </group>
  )
}
