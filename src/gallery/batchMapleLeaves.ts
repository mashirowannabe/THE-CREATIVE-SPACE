import { BufferAttribute, Matrix4, SkinnedMesh, type AnimationClip, type Mesh } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// This asset's leaves already share one coordinate space and skeleton. Concatenate
// their original attributes; keep the loaded objects available for effect cleanup.
export function batchMapleLeaves(meshes: readonly Mesh[], clip: AnimationClip | undefined) {
  const leaves = meshes.filter((mesh): mesh is SkinnedMesh =>
    mesh instanceof SkinnedMesh && !Array.isArray(mesh.material) && /leaf/i.test(mesh.material.name),
  )
  const first = leaves[0]
  if (leaves.length < 2 || !first?.parent || Array.isArray(first.material) || first.material.transparent) return null
  const parent = first.parent
  const identity = new Matrix4()
  const names = new Set(leaves.map(mesh => mesh.name))
  if (clip?.tracks.some(track => names.has(track.name.split('.')[0]))) return null

  const attributes = first.geometry.attributes
  const compatible = leaves.every(mesh => {
    const geometry = mesh.geometry
    return mesh.parent === parent && mesh.material === first.material &&
      mesh.skeleton === first.skeleton && mesh.bindMode === 'attached' &&
      mesh.bindMatrix.equals(identity) && mesh.matrix.equals(identity) &&
      mesh.visible && mesh.castShadow === first.castShadow && mesh.receiveShadow === first.receiveShadow &&
      mesh.renderOrder === first.renderOrder && mesh.layers.mask === first.layers.mask &&
      mesh.frustumCulled === first.frustumCulled &&
      Boolean(geometry.index) && geometry.groups.length === 0 &&
      geometry.drawRange.start === 0 && geometry.drawRange.count === Infinity &&
      Object.keys(geometry.morphAttributes).length === 0 &&
      Object.keys(geometry.attributes).length === Object.keys(attributes).length &&
      Object.entries(attributes).every(([name, reference]) => {
        const attribute = geometry.attributes[name]
        return reference instanceof BufferAttribute && attribute instanceof BufferAttribute &&
          attribute.itemSize === reference.itemSize && attribute.normalized === reference.normalized &&
          attribute.array.constructor === reference.array.constructor && attribute.gpuType === reference.gpuType
      })
  })
  if (!compatible) return null

  const geometry = mergeGeometries(leaves.map(mesh => mesh.geometry), false)
  if (!geometry) return null
  const batch = new SkinnedMesh(geometry, first.material)
  batch.name = 'japanese-maple-leaf-batch'
  batch.bind(first.skeleton, first.bindMatrix)
  batch.castShadow = first.castShadow
  batch.receiveShadow = first.receiveShadow
  batch.frustumCulled = first.frustumCulled
  batch.renderOrder = first.renderOrder
  batch.layers.mask = first.layers.mask

  const originalOrder = new Map(parent.children.map((child, index) => [child, index]))
  leaves.forEach(mesh => {
    parent.remove(mesh)
    // dispose releases any prior GPU upload, retaining attributes for restoration.
    mesh.geometry.dispose()
  })
  parent.add(batch)
  let restored = false
  return {
    mesh: batch,
    sourceLeaves: leaves,
    restore() {
      if (restored) return
      restored = true
      parent.remove(batch)
      leaves.forEach(mesh => parent.add(mesh))
      parent.children.sort((a, b) => (originalOrder.get(a) ?? Infinity) - (originalOrder.get(b) ?? Infinity))
      geometry.dispose()
    },
  }
}
