# MISSION 010B — Bundle & Rendering Performance

Completed and verified **2026-11-24, Asia/Barnaul**.

## 1. Executive Summary

The gallery now renders the original Maple leaves as one skinned batch using the
existing skeleton. Production draw calls fall **313 → 14**, uploaded geometry
objects **308 → 9**, and attached skinned meshes **301 → 2**. Triangles, material
appearance, bones, animation, camera and gallery dimensions remain unchanged.

Local renderer CPU submission p50 falls approximately **0.8–0.9ms → 0.2ms** in
the viewport medians. Frame rate remains around **180 FPS**; no FPS improvement
or physical-device performance gain is claimed.

Replacing the unused decoder-bearing loader wrapper reduces gallery JavaScript
by **18,841 bytes raw / 5,841 bytes gzip** after including the batching code.
The gallery still uses two total application JavaScript requests. Main JavaScript
size and Mission 010A's exhibition-first deferral remain intact.

Passed **886 normal browser checks, 31 analytical checks and seven deliberate
failure checks**. The separate baseline performance run passed 45 checks.
Normal final suites recorded no console/runtime errors, HTTP errors or failed
requests. The existing large-chunk and THREE.Clock warnings remain.

## 2. Investigation Findings

[MISSION-010B-INVESTIGATION.md](MISSION-010B-INVESTIGATION.md) was completed before
application-source changes. Stage A established an actual Rollup module/import
graph, separate production measurements, GLB structure and prototype equivalence.

Three.js dominates the retained gallery code, followed by Fiber and its bundled
reconciler. Tree shaking already removes unrelated Drei features. Narrowing only
the Drei barrel to core Gltf produced no meaningful size saving.

The wrapper still retains **21,685 pre-minification characters of MeshoptDecoder**
and **11,888 of DRACOLoader**, despite both being disabled by the current call.
The actual GLB uses neither compression format. Fiber useLoader with Three's
matching addon GLTFLoader removes that unused path while preserving cached,
Suspense-based loading. The decoded attributes, indices, material JSON, bind
matrices, bone inverses/names and clips match the previous loader exactly.

Forced scheduler deduplication, more renderer chunk splitting, ordinary instancing,
animation rewrites and quality reductions were investigated and rejected. Their
benefit or safety was not established. Dependency resolution/configuration remains.

## 3. Identified Bottlenecks

The 300 leaf meshes previously caused **300 main-pass submissions** despite sharing
one opaque physical material, one parent, identity transforms/bind matrices and
the same 21-bone skeleton. They have compatible attributes and no morph targets,
geometry groups or mesh-targeted animation tracks.

Actual production callbacks identify 308 main submissions and five shadow
submissions before optimization. The seven architectural meshes and trunk remain.
Leaf shadow suppression already works; no shadow, DPR or quality change is needed.

Animation already has one mixer, one guarded active-frame update and per-frame
skeleton update deduplication in Three. It was preserved. The costly opportunity
was per-mesh renderer work, rather than removing or reducing sway.

## 4. Implemented Optimizations

JapaneseMaple now uses `useLoader(GLTFLoader, url)` from Fiber and the matching
`three/addons` loader. Loading remains inside the deferred Canvas subtree.
No preload or additional delivery chunk was introduced.

[batchMapleLeaves.ts](src/gallery/batchMapleLeaves.ts) validates the actual source
compatibility conditions, concatenates original attributes/indices, and binds one
SkinnedMesh to the original skeleton and bind matrix. It preserves materials,
normals, UVs, weights, winding, layers, shadow flags and render order. Incompatible
inputs retain the original meshes. Original loaded objects are detached
reversibly; cleanup restores their parent/order and disposes the owned batch.

Material/batch setup runs in a layout effect before drawing. Source leaf GPU
uploads are disposed while retaining their CPU attribute arrays for restoration.
An initial version could retain 309 GPU geometry objects when passive setup ran
after a source-mesh frame. The final version records nine in every production
sample; the [residency finding](artifacts/mission-010b/gpu-residency-finding.json)
is retained separately.

## 5. Before/After Bundle Measurements

| JavaScript | Before raw | After raw | Before gzip | After gzip |
| --- | ---: | ---: | ---: | ---: |
| Main | 248,281 | 248,281 | 77,266 | 77,266 |
| Gallery | 1,018,886 | 1,000,045 | 276,306 | 270,465 |
| Total | 1,267,167 | 1,248,326 | 353,572 | 347,731 |

Gallery gzip decreases approximately **2.1%**. The loader-only prototype saved
7,351 gzip bytes; adding the guarded batch/utilities yields the final net saving
of 5,841. The gallery still exceeds Vite's 500KB warning threshold.

There are **two JavaScript chunks before and after**, with no additional chunks.
Actual cache-disabled ResourceTiming reports **354,172 → 348,331 JavaScript
transfer bytes** for gallery visits, including HTTP overhead. No decoder, source
map, analysis JSON or external-service request appears in the normal application
trace. Normal `dist/` contains no verification instrumentation or analysis files.

The original **4,439,192-byte GLB** still loads once when needed. Both fresh
exhibition overviews, all twelve chapters and three material subsection destinations
retain zero initial gallery JavaScript/model delivery at all required sizes.
Repeated returns retain one Canvas and one model request per successful document.

## 6. Before/After Renderer Measurements

| Quantity | Before | After |
| --- | ---: | ---: |
| Main-pass submissions | 308 | 9 |
| Shadow submissions | 5 | 5 |
| Total draw calls | 313 | 14 |
| Rendered triangles, including shadows | 34,854 | 34,854 |
| Uploaded geometry objects | 308 | 9 |
| Renderer textures | 4 | 4 |
| Attached skinned meshes | 301 | 2 |
| Physical specimen materials | 2 | 2 |
| Shared skeleton bones | 21 | 21 |

The original asset still contains 301 meshes. Runtime batching changes attached
render workloads; it does not simplify the source model or reduce triangles.

Used **Chrome 157.0.8103.79**, Windows headless, the same production preview URL
`http://127.0.0.1:4251`, disabled cache, no CPU/network throttling and separate
isolated baseline/final runs. Each viewport has three fresh-document samples and
three 1.5-second active-frame observations. Functional regressions ran concurrently
only after performance sampling.

The verification-only React renderer hook exposes the actual production R3F store.
`WebGLRenderer.render` duration measures CPU submission, not completed GPU work.
Frame rate/intervals come from actual renderer calls, not a draw-count estimate.
The table reports medians of the three samples, not a statistically certified gain:

| Viewport | CPU p50 ms before → after | CPU p95 ms before → after | FPS before → after |
| --- | ---: | ---: | ---: |
| 1440 × 900 | 0.9 → 0.2 | 1.1 → 0.3 | 179.9 → 180.4 |
| 1024 × 768 | 0.9 → 0.2 | 1.2 → 0.3 | 180.0 → 179.9 |
| 900 × 900 | 0.9 → 0.2 | 1.1 → 0.3 | 180.2 → 180.5 |
| 768 × 1024 | 0.9 → 0.2 | 1.2 → 0.3 | 179.9 → 180.2 |
| 390 × 844 | 0.9 → 0.2 | 1.1 → 0.3 | 179.9 → 179.8 |
| 320 × 768 | 0.8 → 0.2 | 1.1 → 0.3 | 179.8 → 180.1 |

CPU clock resolution and short samples limit precision. The near-constant 180 FPS
does not establish better display throughput, GPU time or battery performance.

Initial timing medians, milliseconds from navigation:

| Viewport | First model render before → after | Inspection ready before → after |
| --- | ---: | ---: |
| 1440 × 900 | 771.8 → 746.6 | 778.0 → 747.7 |
| 1024 × 768 | 767.4 → 760.3 | 773.4 → 761.5 |
| 900 × 900 | 757.3 → 751.7 | 764.1 → 752.7 |
| 768 × 1024 | 752.6 → 752.7 | 753.4 → 753.4 |
| 390 × 844 | 751.9 → 742.6 | 752.5 → 743.1 |
| 320 × 768 | 744.4 → 747.3 | 745.2 → 748.0 |

The first-model metric is the first completed renderer call containing the specimen;
readiness is the inspection button becoming enabled. Small timing differences include
sample variation; no reliable main-gallery startup speed improvement is claimed.
No perceptible initial-loading regression was observed locally.

Full timings, request records and distributions:
[consolidated measurements](artifacts/mission-010b/measurements.json),
[baseline](artifacts/mission-010b/baseline/performance/audit-results.json),
[final](artifacts/mission-010b/final/performance/audit-results.json),
[before graph](artifacts/mission-010b/baseline/bundle-analysis.json) and
[after graph](artifacts/mission-010b/final/bundle-analysis.json).

## 7. Animation and Lifecycle Verification

Analytical checks compare all **72,000 leaf vertices** at eight clip positions
in both the original and displayed coordinate transforms: maximum error is **zero**.
Attribute values and triangle winding/indices are preserved. The existing bones,
bind matrices, action and ten-second/63-track clip remain.

Verified visible sway, inspection camera movement, measured opening-camera reset,
Escape, offscreen demand idling, actual hidden-tab pause/resume, and initial/live
reduced-motion behavior. Scene/camera UUIDs and Canvas DOM identity remain across
project navigation and returns. No new animation loop or mixer was introduced.

The 010A approach margin, initial chapter-scroll guard, explicit return, observer
cleanup and no-loading-behind-image-inspection behavior pass unchanged.

WebGL denial, model failure, lazy-chunk failure and context-loss dispatch retain
their existing fallbacks, disabled inspection and usable navigation. Real driver
faults and physical devices remain outside verification.

## 8. Six-Viewport Regression Results

| Viewport | Loading/navigation/inspection/lifecycle | Changed pixels in static gallery comparison |
| --- | --- | ---: |
| 1440 × 900 | Passed | 8 / 1,296,000 |
| 1024 × 768 | Passed | 14 / 786,432 |
| 900 × 900 | Passed | 7 / 810,000 |
| 768 × 1024 | Passed | 6 / 786,432 |
| 390 × 844 | Passed | 3 / 329,160 |
| 320 × 768 | Passed | 0 / 245,760 |

Static images differ in at most **0.0018%** of viewport pixels. Differences lie
within the canopy; reviewed gallery views and magnified comparisons show no
visible material, shape, composition or shadow change. Pixel identity is not
claimed generally. The 320px static gallery/specimen samples are pixel-identical.
Stored specimen views at the three stacked widths show the same comparison counts.

Figure/Canvas dimensions and cameras are preserved; no horizontal overflow or
gallery loading-induced caption shift was recorded. Both chapter sequences,
subsections, fresh links, legacy `#work-blender`, repeated selection, project
switching, Back/Forward and matching work-control focus pass.

ArtifactInspector passes actual/Fit pixels, zoom limits, keyboard containment/pan,
mouse drag, touch pan, background protection, Close/Escape, exact focus restoration
and history behavior. Original video playback/pause semantics also pass.

[Static comparison](artifacts/mission-010b/visual-comparison.json),
[magnified desktop comparison](artifacts/mission-010b/comparison-detail-1440.png),
[390px gallery](artifacts/mission-010b/final/performance/static-gallery-390x844.png)
and [320px specimen](artifacts/mission-010b/final/performance/static-specimen-320x768.png).

## 9. Build and Typecheck Results

Passed `npm run typecheck` and `npm run build -- --configLoader runner` using the
unchanged Vite configuration. The runner loader avoids the known sandbox directory
restriction. Automatically approved local Chrome debugging was required for CDP.
No dependency was added or changed.

The actual main/gallery JS in normal `dist/` match the analyzed final production
build byte-for-byte. Analysis source maps/JSON remain in verification directories.

| Suite | Passed checks |
| --- | ---: |
| Final production performance | 45 |
| Mission 010A loading/navigation | 367 |
| Gallery/camera/sway/media regression | 42 |
| Approach/cleanup/hidden-tab/context lifecycle | 17 |
| Reading/history/keyboard/touch/video | 265 |
| Six-size fonts and ArtifactInspector | 122 |
| Inspector interaction/Escape/history | 28 |
| Analytical batching/pose/fallback/cleanup | 31 |
| Deliberate load failures | 7 |
| Separate baseline performance | 45 |

All normal suites are free of unexpected console/runtime and HTTP/network errors.
Six injected console errors and two failed requests are isolated in
[failure evidence](artifacts/mission-010b/failures/audit-results.json).

## 10. Files Modified and Created

Application changes:

- [JapaneseMaple.tsx](src/gallery/JapaneseMaple.tsx): direct cached loader,
  layout-phase material/batch setup, restoration and nonvisual batching metadata.
- [batchMapleLeaves.ts](src/gallery/batchMapleLeaves.ts): new guarded runtime
  batch and owned-resource cleanup.

Created both Mission 010B reports, analysis/prototype/measurement/comparison scripts
under `.verification/mission-010b/`, and evidence under `artifacts/mission-010b/`.
Regenerated `dist/` through the normal production build.

Reused the existing 010A loading/failure/lifecycle and 009C reading/inspector bodies
without editing them. A copy of the gallery regression body changes only expected
draw/geometry/skinned counts and its corresponding check label.

Reproduce production browser verification with preview on 4251 and development on 5250:

```powershell
$env:AUDIT_URL = 'http://127.0.0.1:4251'
$env:AUDIT_OUTPUT = 'artifacts/mission-010b/final/performance'
Remove-Item Env:AUDIT_BODY, Env:PERF_BASELINE -ErrorAction SilentlyContinue
node .verification/mission-010b/browser-smoke.mjs
```

The wrapper accepts existing bodies via `AUDIT_BODY='../mission-010a/loading-checks.txt'`,
`../mission-010a/failure-checks.txt`, `../mission-009c/reading-checks.txt`,
`../mission-009c/inspection-checks.txt` and `../mission-009c/interaction-checks.txt`.
Against development, use `./gallery-checks.txt` or `../mission-010a/lifecycle-checks.txt`.
Use separate output directories. `PERF_BASELINE='1'` selects original renderer-count
expectations against the retained baseline build; clear it for final measurements.

`analyze-build.mjs` accepts `ANALYSIS_STAGE` values baseline, narrow-import,
loader-prototype and final. Baseline must use the pre-edit source or retained build;
rerunning it on current source does not recreate the old implementation.
`batch-check.mjs`, `visual-compare.py`, `integrity.mjs` and `summarize.mjs` reproduce
the analytical, visual, preservation and consolidated evidence. These use the
already installed TypeScript and Pillow rather than new dependencies.

## 11. Integrity and Preservation Verification

[SHA-256 evidence](artifacts/mission-010b/integrity.json) confirms **94 of 95 baseline
files unchanged**, exactly one modified application file and one new helper.
Original GLB/Blender source, exhibition screenshots/video, fonts/licenses,
project descriptions, navigation/gate/activity/camera/configuration, approved
styles, dependency manifests and previous mission reports retain their hashes.

The Maple GLB retains SHA-256
`167858b8c7e4f3e51b1fc702b1c61061741d5decfe2b14fa277457ea6e15615d`.
Batch restoration returns all 301 original mesh objects and their child order;
source CPU geometry data remain intact. No second Canvas, renderer, model,
routing system, asset conversion or hosting change was introduced. No deployment
or Mission 010C work was performed.

## 12. Remaining Limitations and Recommendations

The gallery still downloads roughly 1MB raw JavaScript and the original 4.44MB GLB
when needed. Batching preserves the full triangle/shading workload; lower GPU
execution time has not been established. The existing bundle/Clock warnings remain.

The batch adds **4,032,000 bytes of CPU attribute/index arrays** while the cached
source remains available for restoration. Uint32 indices add **144,000 bytes**
versus the original leaf index arrays. Fewer geometry objects must not be read
as lower geometry payload bytes or total process memory.

Coarser leaf culling and tiny canopy raster differences are recorded above.
The compatibility guard deliberately falls back to original meshes if relevant
source conditions change. Future assets/animation edits should rerun the pose,
material, cleanup and visual checks.

Chrome/Windows headless and emulated phone/tablet sizes are verified; physical
devices, other engines, GPU timers, battery cost and assistive technology remain
unmeasured. Profile representative devices before claiming FPS/battery gains or
choosing further quality, batching, memory or engine-delivery changes. Image/video
delivery work remains for its authorized later mission.

The dedicated local verification servers were stopped after completion.
