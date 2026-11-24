import {
  Box3, Matrix4, Mesh, MeshStandardMaterial, SkinnedMesh, Vector3,
  type AnimationClip, type Object3D, type Vector3Tuple,
} from 'three'

export type GalleryLoadState = 'loading' | 'ready' | 'failed'

export function inspectMaple(scene: Object3D, animations: AnimationClip[], height: number, yaw: number) {
  scene.updateWorldMatrix(true, false)
  scene.updateMatrixWorld(true)
  const inverseRoot = new Matrix4().copy(scene.matrixWorld).invert()
  const meshes: Mesh[] = []
  const skeletons = new Set<SkinnedMesh['skeleton']>()
  let nodeCount = -1
  scene.traverse((object) => {
    nodeCount++
    const mesh = object as Mesh
    if (mesh.isMesh) {
      meshes.push(mesh)
      if ((mesh as SkinnedMesh).isSkinnedMesh) skeletons.add((mesh as SkinnedMesh).skeleton)
    }
  })
  skeletons.forEach((skeleton) => skeleton.update())
  const materialsOf = (mesh: Mesh) =>
    (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]
  const trunk = meshes.find((mesh) => materialsOf(mesh).some((material) => /trunk/i.test(material.name)))
  if (!trunk) throw new Error('The Maple asset has no identifiable trunk.')

  const bounds = new Box3()
  const trunkBounds = new Box3()
  const point = new Vector3()
  for (const mesh of meshes) {
    for (let index = 0; index < mesh.geometry.attributes.position.count; index++) {
      mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverseRoot)
      bounds.expandByPoint(point)
      if (mesh === trunk) trunkBounds.expandByPoint(point)
    }
  }
  const size = bounds.getSize(new Vector3())
  if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('The Maple bounds are invalid.')
  const base = new Vector3()
  const cutoff = trunkBounds.min.y + trunkBounds.getSize(new Vector3()).y * 0.01
  let baseVertices = 0
  for (let index = 0; index < trunk.geometry.attributes.position.count; index++) {
    trunk.getVertexPosition(index, point).applyMatrix4(trunk.matrixWorld).applyMatrix4(inverseRoot)
    if (point.y <= cutoff) {
      base.add(point)
      baseVertices++
    }
  }
  if (!baseVertices) throw new Error('The Maple trunk base could not be measured.')
  base.divideScalar(baseVertices)
  base.y = trunkBounds.min.y

  const scale = height / size.y
  const rotatedBase = base.clone().applyAxisAngle(new Vector3(0, 1, 0), yaw)
  const clip = animations.find((candidate) =>
    candidate.duration > 0 && Number.isFinite(candidate.duration) &&
    candidate.tracks.some((track) => track.name.endsWith('.quaternion')) &&
    candidate.tracks.every((track) => Boolean(scene.getObjectByName(track.name.split('.')[0]))),
  )
  const materials = [...new Set(meshes.flatMap(materialsOf))].map((material) => ({
    name: material.name, type: material.type, color: material.color.getHexString(),
    roughness: material.roughness, metalness: material.metalness,
    vertexColors: material.vertexColors, side: material.side,
  }))
  return {
    scale, rotatedBase, clip, meshes, trunk,
    report: {
      nodes: nodeCount, meshes: meshes.length,
      skinnedMeshes: meshes.filter((mesh) => (mesh as SkinnedMesh).isSkinnedMesh).length,
      skeletons: skeletons.size,
      skeletonAssociations: [...skeletons].map((skeleton) => ({
        bones: skeleton.bones.length, boneNames: skeleton.bones.map((bone) => bone.name),
        meshCount: meshes.filter((mesh) => (mesh as SkinnedMesh).skeleton === skeleton).length,
        inverseBindCount: skeleton.boneInverses.length,
      })),
      importedBounds: { min: bounds.min.toArray(), max: bounds.max.toArray(), size: size.toArray() },
      trunkBase: base.toArray() as Vector3Tuple,
      baseVertices, trunkName: trunk.name, originalMaterials: materials,
      clips: animations.map((animation) => ({
        name: animation.name, duration: animation.duration, tracks: animation.tracks.length,
      })),
      uniformScale: scale,
      rotation: [0, yaw, 0] as Vector3Tuple,
      animation: { name: clip?.name ?? null, duration: clip?.duration ?? 0, time: 0, running: false },
    },
  }
}
