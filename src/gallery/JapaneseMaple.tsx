import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { AnimationMixer, Group, LoopRepeat, MeshStandardMaterial, type AnimationAction, type Vector3Tuple } from 'three'
import { galleryConfig, JAPANESE_MAPLE_URL } from './gallery.config'
import { inspectMaple } from './maple.asset'
import { batchMapleLeaves } from './batchMapleLeaves'

type JapaneseMapleProps = {
  animate: boolean
  reducedMotion: boolean
  onReady: (canAnimate: boolean) => void
}

export function JapaneseMaple({ animate, reducedMotion, onReady }: JapaneseMapleProps) {
  const { scene, animations } = useLoader(GLTFLoader, JAPANESE_MAPLE_URL)
  const group = useRef<Group>(null)
  const invalidate = useThree((state) => state.invalidate)
  const inspection = useMemo(
    () => inspectMaple(scene, animations, galleryConfig.maple.height, galleryConfig.maple.rotationY),
    [scene, animations],
  )
  const position: Vector3Tuple = [
    galleryConfig.portal.centerX - inspection.rotatedBase.x * inspection.scale,
    galleryConfig.plinth.height - inspection.rotatedBase.y * inspection.scale,
    galleryConfig.plinth.centerZ - inspection.rotatedBase.z * inspection.scale,
  ]
  const mixer = useMemo(() => new AnimationMixer(scene), [scene])
  const action = useRef<AnimationAction | null>(null)
  const metadata = useMemo(() => ({
    ...inspection.report, position,
    leafColorFallback: galleryConfig.maple.leafColor,
    shadowStrategy: galleryConfig.maple.shadows,
    batching: { sourceLeafMeshes: 0, renderedLeafMeshes: 0, active: false },
  }), [inspection])

  useEffect(() => {
    action.current = inspection.clip ? mixer.clipAction(inspection.clip) : null
    return () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(scene)
      action.current = null
    }
  }, [mixer, scene, inspection.clip])

  useLayoutEffect(() => {
    const originalFlags = inspection.meshes.map((mesh) => ({ mesh, castShadow: mesh.castShadow }))
    const replacements: { mesh: typeof inspection.trunk; material: typeof inspection.trunk.material }[] = []
    const leafClones = new Map<MeshStandardMaterial, MeshStandardMaterial>()
    for (const mesh of inspection.meshes) {
      mesh.castShadow = galleryConfig.maple.shadows === 'trunk' && mesh === inspection.trunk
      if (galleryConfig.maple.leafColor && !Array.isArray(mesh.material)) {
        const material = mesh.material as MeshStandardMaterial
        if (/leaf/i.test(material.name)) {
          let clone = leafClones.get(material)
          if (!clone) {
            clone = material.clone()
            clone.color.setRGB(...galleryConfig.maple.leafColor)
            leafClones.set(material, clone)
          }
          replacements.push({ mesh, material: mesh.material })
          mesh.material = clone
        }
      }
    }
    const leafBatch = batchMapleLeaves(inspection.meshes, inspection.clip)
    const sourceLeafMeshes = inspection.meshes.filter(mesh =>
      !Array.isArray(mesh.material) && /leaf/i.test(mesh.material.name),
    ).length
    metadata.batching = {
      sourceLeafMeshes,
      renderedLeafMeshes: leafBatch ? 1 : sourceLeafMeshes,
      active: Boolean(leafBatch),
    }
    onReady(Boolean(inspection.clip))
    invalidate()
    return () => {
      leafBatch?.restore()
      originalFlags.forEach(({ mesh, castShadow }) => { mesh.castShadow = castShadow })
      replacements.forEach(({ mesh, material }) => { mesh.material = material })
      leafClones.forEach((material) => material.dispose())
    }
  }, [inspection, onReady, invalidate, metadata])

  useEffect(() => {
    const current = action.current
    if (!current) return
    current.setEffectiveTimeScale(galleryConfig.maple.animationTimeScale)
    current.setLoop(LoopRepeat, Infinity)
    if (reducedMotion) {
      current.stop()
    } else if (animate) {
      if (!current.isScheduled()) current.reset().play()
      current.paused = false
    } else {
      current.paused = true
    }
    metadata.animation.running = animate && !reducedMotion
    metadata.animation.time = current.time
    invalidate()
  }, [action, mixer, inspection.clip, animate, reducedMotion, metadata, invalidate])

  useFrame((_, delta) => {
    const current = action.current
    if (!animate || reducedMotion || !current) return
    mixer.update(Math.min(delta, 0.05))
    metadata.animation.time = current.time
    metadata.animation.running = true
  })

  return (
    <group
      ref={group}
      name="japanese-maple-instance"
      position={position}
      rotation={[0, galleryConfig.maple.rotationY, 0]}
      scale={inspection.scale}
      userData={{ specimen: metadata }}
      dispose={null}
    >
      <primitive object={scene} dispose={null} />
    </group>
  )
}
