# MISSION 010A — Gallery Loading Architecture

Completed and verified: **2026-11-24, Asia/Barnaul**.

## 1. Executive Summary

Exhibition-first visits now defer the gallery JavaScript, Canvas, WebGL context
and Japanese Maple request. Scrolling into the installation or using gallery
return initializes it. Once started, the same Canvas remains mounted through
project selection, chapters, history and repeated returns.

The local production comparison measured **4,716,098 bytes of gallery transfer
avoided per tested exhibition-first document**. Main-gallery visits still download
the original gallery and model; no faster rendering or main-gallery loading is claimed.

**691 normal checks and seven deliberate-failure checks passed.** Separate baseline
and final measurement runs passed 49 and 67 checks. All six requested viewport
sizes passed. Normal suites recorded no console/runtime errors, HTTP errors or
failed requests. Existing gallery-bundle and THREE.Clock warnings remain.

## 2. Previous Loading Architecture

Read Missions 009A, 009B, 009C, 007, 008C-A and 008C-B before implementation.
The current source confirmed C11: GalleryViewport rendered React.lazy's
GalleryCanvas unconditionally. The lazy import separated delivery into a chunk,
but exhibition-first documents still mounted it. `active` controlled animation
and demand rendering after initialization, rather than initial delivery.

App retained the gallery above the independently rendered DOM exhibition.
Native fragments, project selection and the existing return signal controlled
navigation and focus. JapaneseMaple used the existing cached GLTF loader without
module-level preloading. These ownership boundaries remain.

A production build of the untouched Mission 009C source was retained in
`.verification/mission-010a/baseline-build`. Fresh IcaMeal overview, Fire Sprinkler
overview and IcaMeal Budget documents requested the GLB at every tested size:
**18 of 18 documents**, with one Canvas mount each.

## 3. Implemented Loading Architecture

GalleryViewport owns a one-way initialization latch through
[useGalleryInitialization.ts](src/hooks/useGalleryInitialization.ts). Until it
opens, the existing botanical SVG and an availability caption occupy the existing
figure. React.lazy is rendered only after initialization is requested.

IntersectionObserver watches the figure with `rootMargin: 0px 0px 200px 0px`.
The bottom margin starts delivery shortly before a gallery below the viewport
becomes visible. The zero upper margin prevents an adjacent exhibition overview
from warming the installation above the reader.

Fresh recognized chapter/subsection links suppress the initial smooth-scroll pass
through the opening gallery. The observer waits for the figure's first departure;
subsequent re-entry loads it. Changing the fragment releases this initial guard.
Explicit gallery return and `#botanical-study` request initialization immediately,
including during the return scroll. Hidden documents wait for visibility.

Initialization never resets. There is no visibility-dependent unmount or Canvas
key change. Existing activity, reduced-motion, inspection, Escape, camera, mixer
and WebGL fallback code continues to run after initialization. The loading
observer and its visibility listener are cleaned up on initialization or effect
replacement; the existing activity observer remains.

The status element reserves two text lines and retains its width when readiness
hides it. This preserves its loading position and removes the previous caption
movement without changing figure dimensions or camera composition. The illustration
also remains available while the lazy JavaScript resolves.

## 4. Files Modified

| File | Change |
| --- | --- |
| [App.tsx](src/App.tsx) | Pass the existing navigation fragment to GalleryViewport |
| [GalleryViewport.tsx](src/gallery/GalleryViewport.tsx) | Gate first lazy rendering, reuse the illustration and retain status space |
| [useGalleryInitialization.ts](src/hooks/useGalleryInitialization.ts) | New one-way loading trigger and observer cleanup |
| [app.css](src/styles/app.css) | Reserve status width/height and hide it at readiness |

Created this report, verification scripts under `.verification/mission-010a/`
and evidence under `artifacts/mission-010a/`. Refreshed generated `dist/`.

[SHA-256 verification](artifacts/mission-010a/integrity.json) confirms **90 of 93
baseline files unchanged**, exactly three authorized modifications and one new
application hook. Original public/source assets, gallery renderer/scene/camera,
model/rig/material/animation code, exhibition content, chapter registry, navigation
controller, fonts, dependencies and previous reports retain their hashes.

## 5. Performance Measurements Before and After

Used existing Chrome **157.0.8103.79** on Windows through CDP, local Vite production
preview, disabled browser cache and no CPU/network throttling. Baseline and final
measurement runs each ran alone. These are single samples, not statistical or
physical-device benchmarks. Other functional suites ran concurrently.

Canvas time is the first gallery Canvas DOM insertion observed by MutationObserver.
WebGL time is the first successful WebGL context acquisition. GLB start comes from
ResourceTiming's request start, measured from document navigation. Instrumentation
is confined to browser verification; no production telemetry was added.

Main-gallery results, **before → after**, milliseconds from navigation:

| Viewport | First Canvas | First WebGL context | GLB request start |
| --- | ---: | ---: | ---: |
| 1440 × 900 | 282 → 456 | 359 → 555 | 374 → 569 |
| 1024 × 768 | 341 → 364 | 407 → 422 | 415 → 428 |
| 900 × 900 | 344 → 338 | 412 → 404 | 418 → 409 |
| 768 × 1024 | 340 → 343 | 398 → 408 | 404 → 412 |
| 390 × 844 | 333 → 340 | 391 → 404 | 396 → 409 |
| 320 × 768 | 336 → 342 | 397 → 407 | 402 → 412 |

Main-gallery timing did not consistently improve; the first 1440px sample was
slower. This mission establishes selective delivery and persistence, not a
main-gallery speed improvement.

| Exhibition-first measurement | Mission 009C baseline | Mission 010A |
| --- | --- | --- |
| Same 18 overview/Budget documents | 18 Canvas mounts and 18 GLB requests | Zero Canvas mounts, WebGL contexts, gallery-bundle or GLB requests |
| First Canvas | 270–354ms | Deferred; no insertion during observation |
| First WebGL context | 589–1,220ms | Deferred; no successful acquisition |
| GLB request start | 594–1,225ms | No request |
| Gallery transfer per document | 4,716,098 bytes | 0 bytes |

Final initial observations ended approximately 1.2–1.4 seconds after navigation.
The fuller loading suite additionally verified exhibition-only switching,
reselection and history for about nine seconds before explicit return, with zero
gallery requests. All twelve chapter links and three material subsection links
were tested at every required size: **90 fresh reading destinations**.

Measured avoided transfer comprises the original **4,439,192-byte GLB**
(`transferSize` 4,439,492) and the **276,306-byte gzip gallery chunk**
(`transferSize` 276,606). Transfer values include HTTP overhead. Other exhibition,
image and font transfers remain outside this saving.

In the functional sequence, first return began Canvas insertion after **77–112ms**,
WebGL acquisition after **391–581ms**, and the GLB request after **396–588ms**.
These timings include concurrent test activity. Every tested subsequent return
retained one Canvas and one GLB request for that document.

Main JS grows **772 bytes raw / 283 bytes gzip**; CSS grows **82 / 31 bytes**.
Gallery JS remains **1,018,886 bytes / 276,306 gzip**. Its warning remains.

Sources: [measured comparison](artifacts/mission-010a/measurements.json),
[baseline](artifacts/mission-010a/baseline/audit-results.json),
[isolated final samples](artifacts/mission-010a/measurements/audit-results.json)
and [loading/navigation sequences](artifacts/mission-010a/loading/audit-results.json).

## 6. Navigation Regression Results

Passed main-gallery entry, both fresh overview links, all twelve chapters,
all three material subsections, legacy `#work-blender`, project switching,
repeated project/chapter selection, explicit return, and browser Back/Forward.
The correct article, fragment, current chapter and focus destinations remain.

The existing 265-check reading suite also passed native keyboard disclosures,
touch project selection, manual reading without history/focus changes, matching
work-control focus on return, enlarged text, image-link names and video behavior.
The separate lifecycle run verified that image inspection and its Escape/focus
restoration do not load a deferred gallery behind the modal.

Evidence: [reading regression](artifacts/mission-010a/reading/audit-results.json).

## 7. Canvas Lifecycle Verification

Passed one Canvas DOM identity across repeated project navigation and returns,
zero navigation-induced Canvas removals and one completed model request per
successful document. Development-store inspection additionally confirmed the
same scene and camera UUIDs after navigation.

Inspection moves the existing camera; explicit return restores its measured
opening position/quaternion/FOV and resets inspection. Escape retains its control
focus behavior. Opening cameras match prior verified baselines where available.

A supplementary 390 × 240 test kept the gallery deferred beyond the 200px margin,
then initialized it while it was still below the viewport. The prewarmed scene
idled in demand mode until entry. Offscreen and actual hidden-tab samples stopped
frame advancement and animation; foreground restored the same scene and sway.
Reduced-motion initialization and subsequent preference changes passed.

Observer instrumentation confirmed two gallery observers while deferred, including
after fragment changes, and only the existing activity observer after initialization.
Context-loss dispatch retained the existing illustration and disabled inspection.

Renderer measurements remain **313 draw calls, 34,854 triangles, 308 geometries,
four textures and 301 skinned meshes** at all six sizes.

Evidence: [42 gallery checks](artifacts/mission-010a/gallery/audit-results.json)
and [17 lifecycle checks](artifacts/mission-010a/lifecycle/audit-results.json).

## 8. Responsive Test Results

| Viewport | Result | Preserved Canvas dimensions |
| --- | --- | --- |
| 1440 × 900 | Passed | 912 × 900 |
| 1024 × 768 | Passed | 646 × 780 |
| 900 × 900 | Passed | 566 × 900 |
| 768 × 1024 | Passed | 768 × 480 |
| 390 × 844 | Passed | 390 × 429 |
| 320 × 768 | Passed | 320 × 360 |

All six gallery screenshots were visually inspected. Figure dimensions remain
identical before and after deferred loading; no document horizontal overflow was
found. Original gallery framing, specimen treatment and responsive breakpoint remain.

No gallery-caption/control loading shifts were recorded in the isolated final
samples or explicit-return sequences. Baseline main-gallery caption shifts ranged
approximately **0.00041–0.00268**. One 768px functional sequence recorded a
**0.00706** shift attributed to editorial sections during project replacement,
before gallery return; this is not a claim of zero whole-document CLS.

Screenshots: [desktop](artifacts/mission-010a/loading/gallery-1440x900.png),
[tablet](artifacts/mission-010a/loading/gallery-768x1024.png),
[390px](artifacts/mission-010a/loading/gallery-390x844.png),
[320px](artifacts/mission-010a/loading/gallery-320x768.png).

## 9. Build, Typecheck and Failure Results

Passed `npm run typecheck` and `npm run build -- --configLoader runner`.
The unchanged Vite configuration uses the runner loader for the known sandbox
directory restriction. Chrome debugging required automatically approved execution
outside the filesystem sandbox. No test or application dependency was installed.

| Suite | Passed |
| --- | ---: |
| Six-size delivery/navigation lifecycle | 367 |
| Existing reading/navigation regression | 265 |
| Existing gallery/camera/animation/media regression | 42 |
| Supplemental approach/cleanup/hidden-tab/scene checks | 17 |
| Deliberate deferred-load failures | 7 |
| Separate baseline / final measurements | 49 / 67 |

WebGL denial attempts no context while reading, then shows the illustration on
actual return. Failed model delivery retains architecture and navigation; failed
lazy JavaScript retains the illustration and matching return focus. Six injected
console errors and two failed requests are isolated in the
[fault record](artifacts/mission-010a/failures/audit-results.json).

An early new-harness string-quoting error was corrected before the complete passing
run. No application workaround was added for it.

Reproduce with production preview on port 4240 and development on port 5240:

```powershell
$env:AUDIT_URL = 'http://127.0.0.1:4240'
$env:AUDIT_OUTPUT = 'artifacts/mission-010a/loading'
node .verification/mission-010a/browser-smoke.mjs
```

The new harness accepts `AUDIT_BODY='./failure-checks.txt'` and, against development,
`'./lifecycle-checks.txt'`; use distinct output directories. Existing
`.verification/mission-009c/browser-smoke.mjs` runs `./reading-checks.txt` against
production and `./regression-checks.txt` against development. `AUDIT_MEASURE='1'`
selects the shorter final comparison run; `AUDIT_BASELINE='1'` selects the retained
baseline build on port 4241. Clear these flags for normal loading verification.
`integrity.mjs` and `summarize.mjs` under `.verification/mission-010a/` reproduce
the preservation and consolidated measurement records.

## 10. Remaining Limitations

The original bundle/model size and active renderer cost remain. This mission
changes when delivery happens; it does not optimize geometry, batching, materials,
animation, image derivatives, video formats or dependency versions.

Chrome on Windows and emulated mobile/touch were tested. Physical-device loading,
GPU/battery cost, assistive technology, other engines and field Core Web Vitals
remain unmeasured. The existing IntersectionObserver browser requirement remains.
Context-loss verification used event dispatch, not a physical driver fault.

Main-gallery single-run timings include variation and do not establish a speed
gain. Owner-dependent content and asset attribution gaps remain unchanged.
No deployment, model conversion, new routing system or second Canvas was introduced.
The dedicated local verification servers were stopped after completion.
