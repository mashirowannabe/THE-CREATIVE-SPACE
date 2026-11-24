import type { Vector3Tuple } from 'three'

export const galleryConfig = {
  colors: {
    ivory: '#f1efe8',
    raised: '#e5e1d7',
  },
  environment: {
    centerX: 1,
    floor: { width: 10, depth: 8, thickness: 0.08 },
    wall: { width: 10, height: 3.8, thickness: 0.16 },
  },
  portal: {
    centerX: 2.1,
    openingWidth: 3.4,
    openingHeight: 2.85,
    outerWidth: 4.1,
    outerHeight: 3.4,
    recessDepth: 0.45,
    frontZ: 0.12,
  },
  plinth: {
    width: 1,
    depth: 0.9,
    height: 0.28,
    centerZ: 0.7,
  },
  camera: {
    // Mission coordinates use Z-up; this scene uses Three.js Y-up.
    position: [1.8, 2.7, 8.5] as Vector3Tuple,
    target: [1.8, 1.6, 0] as Vector3Tuple,
    focalLength: 45,
    filmGauge: 36,
    minimumDistance: 7,
    horizontalCoverage: 0.82,
    verticalCoverage: 0.76,
  },
  dpr: [1, 1.5] as [number, number],
  inspection: {
    duration: 0.8,
    distanceRatio: 0.9,
    positionYOffset: -0.1,
    targetXOffset: 0.05,
    targetYOffset: -0.15,
    targetZOffset: 0.1,
  },
  maple: {
    height: 1.8,
    rotationY: -Math.PI / 2,
    animationTimeScale: 0.35,
    // Dominant linear RGB stop from the source's unexported procedural ColorRamp.
    leafColor: [0.3181281089782715, 0, 0.004833156242966652] as [number, number, number] | null,
    shadows: 'trunk' as 'none' | 'trunk',
  },
  shadowMapSize: 1024,
}

// Loaded once by JapaneseMaple; no module-level preloading.
export const JAPANESE_MAPLE_URL =
  `${import.meta.env.BASE_URL}models/japanese-maple.glb`
