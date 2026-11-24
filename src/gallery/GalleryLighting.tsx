import { galleryConfig } from './gallery.config'

export function GalleryLighting() {
  return (
    <group name="gallery-lighting">
      <hemisphereLight
        name="gallery-fill"
        args={['#fffaf0', '#d4d0c4', 1.25]}
      />
      <directionalLight
        name="gallery-key"
        position={[-3, 7, 5]}
        color="#fff9ef"
        intensity={2.25}
        castShadow
        shadow-mapSize={[galleryConfig.shadowMapSize, galleryConfig.shadowMapSize]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.1}
        shadow-camera-far={18}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
        shadow-radius={2.5}
      />
    </group>
  )
}
