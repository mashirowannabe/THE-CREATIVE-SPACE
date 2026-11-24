# MISSION 010B — Bundle & Rendering Investigation

Investigation completed **2026-11-24, Asia/Barnaul**, before application-source edits.

## 1. Scope and Method

Read Missions 010A, 009A–C, 007 and 008C-A/B; inspected current gallery,
navigation/activity ownership, dependency manifests, Vite configuration and existing
verification scripts. Mission 010A's first-load gate is present and must remain.

Built current source with the existing Vite/React plugins and a verification-only
Rollup analysis plugin. Retained module contributions and resolved import edges
are recorded, alongside actual emitted/minified chunk sizes. Hidden source maps
and analysis JSON are verification artifacts, not new application requests.

Production browser measurements use existing Chrome 157.0.8103.79, cache disabled,
no CPU/network throttling, three fresh-document samples at each required viewport.
A browser-injected React renderer hook exposes the real R3F store in the unchanged
production application. Timed `WebGLRenderer.render` samples measure CPU submission,
not GPU completion. The accepted baseline ran without concurrent build/browser work.

Node inspection reads the original GLB. Loader and batching prototypes operate
only in verification scripts or build-time transforms. No application source,
original asset, dependency or configuration has been modified in Stage A.

## 2. Bundle Findings

Actual production baseline: main JS **248,281 bytes / 77,266 gzip**; gallery JS
**1,018,886 / 276,306**. Two JavaScript chunks, totaling **1,267,167 raw /
353,572 gzip**. Gallery code remains absent on exhibition-first visits.

| Gallery contributor | Retained module characters before minification |
| --- | ---: |
| Three.js | 2,114,681 |
| React Three Fiber, including its bundled reconciler | 310,388 |
| three-stdlib | 134,337 |
| Application gallery modules | 21,404 |
| Scheduler | 11,529 |
| Drei | 1,031 |

These are Rollup `renderedLength` values, not allocations of final compressed
bytes. Largest individual modules are `three.core.js` (1,466,814),
`three.module.js` (647,867), Fiber's events/reconciler module (304,131),
three-stdlib's GLTFLoader (98,298), MeshoptDecoder (21,685), and DRACOLoader (11,888).

The graph demonstrates functioning tree shaking: only Drei's Gltf wrapper is
retained from the barrel's much larger input graph; Clone and unused Drei features
are removed. Three's core and WebGL build are complementary resolved modules,
not two installed renderer versions. React/main dependencies are shared by the
gallery through its import of the main chunk.

The decoder code is a confirmed unnecessary contribution. JapaneseMaple calls
`useGLTF(url, false, false)`, but the wrapper's reusable extension callback retains
both decoders. The GLB uses no Draco/Meshopt compression and no embedded/external
images. Its material extensions are specular, sheen, anisotropy and IOR.

Two build-only candidates establish the benefit:

| Candidate | Gallery raw | Gallery gzip | Result |
| --- | ---: | ---: | --- |
| Current import | 1,018,886 | 276,306 | Baseline |
| Import Drei's core Gltf module directly | 1,018,886 | 276,307 | No meaningful saving; reject |
| Fiber useLoader + matching Three addon GLTFLoader | 993,837 | 268,955 | Saves 25,049 raw / 7,351 gzip before batching |

The direct loader candidate removes Drei/three-stdlib from the retained application
graph, preserves Fiber's Suspense/cache lifecycle, and retains the same two chunks.
A Node comparison confirms identical decoded geometry attributes/indices, bind
matrices, bone inverses/names, complete material JSON and animation tracks.

There are two scheduler modules: React DOM's 0.27.0 and Fiber's 0.28.0. Their
currently delivered production implementations are byte-identical, but their
declared versions differ. Forced aliasing would couple these dependencies beyond
their declared resolution for a small saving. Leave resolution/configuration intact.

There is no evidence supporting more splitting: the renderer, camera and specimen
are required together when the installation starts. Splitting their delivery would
add requests/dependency sequencing while retaining total engine code.

## 3. Rendering Findings

Production measures **313 draw calls**, **34,854 triangles**, **308 geometries**,
**four renderer textures**, and **301 skinned meshes** at all six sizes.
Per-object callbacks identify **308 main-pass submissions**: 300 leaves, one trunk
and seven architectural meshes. The shadow pass contributes five submissions,
including only the trunk from the specimen. Leaf shadow suppression already works.

The asset has **301 unique geometries, two physical materials, one shared
21-bone skeleton, one ten-second sway clip and 63 tracks**. Source images/textures
are absent; renderer texture counts include generated renderer/skinning resources.

The 300 opaque, double-sided leaf meshes have:

- The same `Scene` parent and identity local/world transforms.
- Exactly equal identity bind matrices, attached bind mode and shared skeleton.
- One shared material, no morph targets, no geometry groups and compatible
  position/normal/UV/skin-index/skin-weight attribute layouts.
- No leaf-mesh animation targets; the sway targets bones.

Thus these are 300 separate submissions of compatible skinned geometry. Ordinary
InstancedMesh is not the correct substitute: the leaf geometries/weights are
distinct, and it does not preserve this existing skinning pipeline automatically.

A prototype concatenates the leaf attributes/indices and binds one SkinnedMesh to
the **existing** skeleton and bind matrix. It checks all **72,000 leaf vertices**
at eight clip positions: 0, 0.01, 0.5, 1, 2.5, 5, 7.5 and 9.99 seconds.
Maximum position error is **zero** for both the loader replacement and batch.
No geometry simplification, normal/UV/weight modification or skeleton rebuild occurs.

Predicted result, awaiting browser validation: **14 draw calls, nine uploaded
geometries and two attached skinned meshes**, with triangles, material appearance,
textures and animation unchanged. Originals can be detached reversibly and restored
on cleanup; a guard must retain them if compatibility conditions fail.

Tradeoff: the merged geometry owns **4,032,000 bytes** of CPU attribute/index arrays
while the loader cache retains originals for restoration. Its 72,000 vertices
require Uint32 indices, adding 144,000 index bytes versus the original leaf indices.
Geometry counts alone must not be described as lower geometry payload bytes.

Animation already has one mixer and one guarded update per active frame.
Three's WebGLObjects deduplicates skeleton updates per renderer frame. The Node
probe measured roughly 3.2 microseconds per mixer update across 10,000 iterations;
this is a diagnostic, not a browser benchmark. No evidence supports new animation
loops, pose caching or skeleton changes. Existing offscreen/hidden/reduced-motion
behavior should remain.

Short production samples sustain about 180 FPS in this desktop headless environment;
renderer CPU p50 ranges approximately 0.8–1.3ms. The near-constant frame rate limits
what can be concluded about FPS gains from batching. Measure CPU submission and
frame intervals separately after implementation.

## 4. Ranked Candidates

| Priority | Bottleneck/evidence | Proposed action / expected benefit | Risk and verification |
| --- | --- | --- | --- |
| 1 | 300 compatible leaf submissions | Guarded runtime skinned batch; predict 299 fewer draws | Moderate: skinning, material order, culling, cleanup. Verify every vertex at fixed poses, real production metrics, static screenshots, sway and lifecycle |
| 2 | Disabled decoders retained in loader graph | Use Fiber useLoader and matching Three addon; measured 7,351 gzip saving in build prototype | Low–moderate: loader versions/cache. Full decoded-data equivalence already passes; verify browser appearance, one fetch, failures and deferral |
| Reject | Drei barrel looks broad | Narrow to core Gltf | Already tree-shaken; measured no saving |
| Reject | Two scheduler versions | Force deduplication | Small benefit and unnecessary version coupling; preserve dependency resolution |
| Reject | Engine is the largest unit | Split renderer/model/camera chunks | No independent optional feature; request/initialization overhead without established benefit |
| Reject | Hundreds of skins | Ordinary instancing/static flattening | Incorrect skinning/geometry assumptions; retain the shared skeletal deformation |
| Reject | Animation updates | Pose/mixer/skeleton rewrites | One mixer/update already; skeleton updates deduplicated; no confirmed bottleneck |
| Reject | Shadow/quality cost | Lower DPR, remove shadows, simplify model/materials | Would alter the approved experience; no measured justification |

## 5. Implementation Decision and Required Verification

Proceed with the direct loader and a guarded, reversible leaf batch. Do not edit
the original GLB or Blender files, appearance/configuration, camera, navigation,
Mission 010A gate, content, images/video/fonts or dependency versions.

Run separate baseline/final production measurement suites with identical settings.
Confirm all six static gallery views, decoded material/geometry equality, posed
vertex equality, actual draw/geometry counts, CPU/frame timing, one model request,
first-render/readiness timing and two JavaScript requests. Reject the batch if
appearance or sway differs. Reuse the 010A loading/failure/lifecycle and 009C
reading/inspector tests, adapting only renderer-count expectations where necessary.

Evidence:
[resolved bundle graph](artifacts/mission-010b/baseline/bundle-analysis.json),
[narrow-import build](artifacts/mission-010b/narrow-import/bundle-analysis.json),
[loader prototype build](artifacts/mission-010b/loader-prototype/bundle-analysis.json),
[model inspection](artifacts/mission-010b/baseline/model-analysis.json),
[decoded-data/pose prototype](artifacts/mission-010b/baseline/prototype-verification.json),
[production baseline](artifacts/mission-010b/baseline/performance/audit-results.json)
and [pre-edit hashes](artifacts/mission-010b/integrity-before.json).
