import { galleryConfig } from './gallery.config'

export function ExhibitionPlinth() {
  const { colors, plinth, portal } = galleryConfig

  return (
    <group name="exhibition-plinth">
      <mesh
        name="plinth-pedestal"
        position={[portal.centerX, plinth.height / 2, plinth.centerZ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[plinth.width, plinth.height, plinth.depth]} />
        <meshStandardMaterial color={colors.raised} roughness={0.95} />
      </mesh>
    </group>
  )
}
