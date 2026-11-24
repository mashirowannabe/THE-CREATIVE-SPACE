import { galleryConfig } from './gallery.config'

export function ArchitecturalPortal() {
  const { colors, portal } = galleryConfig
  const jambWidth = (portal.outerWidth - portal.openingWidth) / 2
  const jambCenter = portal.openingWidth / 2 + jambWidth / 2
  // The supplied opening and overall height imply a 0.55 m header.
  const headerHeight = portal.outerHeight - portal.openingHeight
  const centerZ = portal.frontZ - portal.recessDepth / 2

  return (
    <group name="architectural-portal" position={[portal.centerX, 0, 0]}>
      <mesh
        name="portal-left-return"
        position={[-jambCenter, portal.openingHeight / 2, centerZ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[jambWidth, portal.openingHeight, portal.recessDepth]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.94} />
      </mesh>
      <mesh
        name="portal-right-return"
        position={[jambCenter, portal.openingHeight / 2, centerZ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[jambWidth, portal.openingHeight, portal.recessDepth]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.94} />
      </mesh>
      <mesh
        name="portal-header"
        position={[0, portal.openingHeight + headerHeight / 2, centerZ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[portal.outerWidth, headerHeight, portal.recessDepth]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.94} />
      </mesh>
    </group>
  )
}
