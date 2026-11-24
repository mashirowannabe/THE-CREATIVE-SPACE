# Mission 008C-B — Fire Sprinkler Exhibition

Completed and production-verified: 2026-11-24 (Asia/Barnaul).

Fire Sprinkler is the second DOM exhibition below the preserved gallery, reusing
Mission 008C-A's foundation. Only the selected article renders. IcaMeal retains
its seven chapters, media and limitations; Plants Weird and deployment remain
outside scope.

| Chapter | Fragment | Implemented content |
| --- | --- | --- |
| 01 Overview | `#project-fire-sprinkler` | Original modeling from visual references, study scope and complete model preview |
| 02 Form & Assembly | `#project-fire-sprinkler-assembly` | Supplied assembly close-up, component descriptions and modifier evidence |
| 03 Material Study | `#project-fire-sprinkler-materials` | Upper detail, stainless node graph, brass and glass shader captures with factual parameter summaries |
| 04 Simulation | `#project-fire-sprinkler-simulation` | User-started recorded particle experiment and explicit simulation boundaries |
| 05 Technical Notes | `#project-fire-sprinkler-notes` | Modeling/material/particle workflow, paired Collision captures and current limits |

The existing `blender` ID and `work-blender` control remain compatible, with the
visible title Fire Sprinkler. Native buttons and chapter anchors support selection,
repeat activation, direct links and Back/Forward. Navigation focuses the destination
H2/H3 and marks the current chapter. Footer controls switch projects. Gallery
return retains the article, restores work-control focus and resets inspection
through the existing gallery behavior. Escape preserves reading.

Eight original PNGs retain dimensions, alt text, captions, source notes and
full-image links. The overview loads eagerly; others load lazily. The first four
use `public/projects/blender/fire-sprinkler/images/`; the remainder are explicit
imports from `source-assets/blender/fire-sprinkler/`.

| Image | Dimensions | Role |
| --- | --- | --- |
| `hero.png` | 1920 × 1080 | Overview and video poster |
| `assembly.png` | 1920 × 1080 | Assembly close-up |
| `material.png` | 1920 × 1080 | Upper material detail |
| `technical.png` | 1520 × 567 | Stainless shader graph |
| `brass.png` | 1695 × 1347 | Brass viewport and shader |
| `glass.png` | 1692 × 1357 | Glass viewport and shader |
| `collision.png` | 395 × 575 | Collision settings capture |
| `collision2.png` | 393 × 542 | Alternate Collision settings capture |

The unchanged `public/projects/blender/fire-sprinkler/animation/sprinkler-preview.mkv`
contains H.264 video, 1920 × 1080 at 24 fps, 250 frames (10.417 seconds), without
audio. Native controls, `playsInline`, `preload="none"`, the overview poster and
download link are implemented; autoplay and looping are disabled. Playback pauses
offscreen, when hidden, on reduced-motion changes and on unmount, without automatic
resume. Failed media retain descriptions/captions; video failure preserves focus
and removes the broken download. All eight built PNGs and the MKV match originals
byte for byte. No BLEND enters the build.

Validation results are recorded in the existing
[production verification artifact](artifacts/mission-008c-b/production-verification.json)
and its [smoke harness](.verification/mission-008c-b/browser-smoke.mjs):

- `npm run typecheck` and `npm run build`: passed. The build required execution
  outside the filesystem sandbox to resolve Vite's directory-access restriction.
- Chrome 157.0.8103.79 production preview: zero failed checks and zero normal
  console, runtime or HTTP errors. Four errors from deliberate image, video and
  WebGL failure injection are recorded separately as expected.
- Passed: five fresh chapter links, legacy `#work-blender`, repeat selection,
  history, switching, keyboard focus, 44px controls, gallery return, persistent
  Canvas, eight images/proportions, MKV playback and pause/unmount behavior.
  Image/video fallbacks passed; both exhibitions worked without WebGL.
- IcaMeal's seven chapters and media/limitations passed. No broken imports,
  missing assets, external requests or source BLEND/product runtime requests
  were found.
- The [earlier development artifact](artifacts/mission-008c-b/verification.json)
  records two initial-video-loading flags at 390px/320px; neither recurred in
  production. Gallery camera, inspection, Maple animation and reduced-motion
  checks passed. Integrity preserved 66 of 70 baseline files; four authorized
  integration files changed.

| Tested viewport | Result |
| --- | --- |
| 1440 × 900 | Full navigation/media checks passed; sticky chapter rail; no horizontal overflow |
| 390 × 844 | Full navigation/media checks passed; static chapter index; no horizontal overflow |
| 320 × 768 | Full navigation/media checks passed; static chapter index; no horizontal overflow |
| 900 × 900 | Tablet layout passed; static chapter index; no horizontal overflow |
| 1440 × 600 | Short-height layout passed; static chapter index; no horizontal overflow |
| 320 × 768, 200% exhibition text | Text enlargement and wrapping passed; static index; no horizontal overflow |

Remaining limitations:

- MKV playback outside Chrome is unverified. Mobile results are emulated;
  physical devices and screen readers were not tested.
- The existing GalleryCanvas bundle-size warning remains: 1,018.89 kB / 276.31 kB
  gzip, above Vite's 500 kB warning threshold. The existing THREE.Clock deprecation
  warning also remains.
- Particle behavior is artistic, without engineering validation. Reference/lighting
  provenance, node portability and absent topology/assembly documentation remain limits.

This report uses existing records. Only this Markdown file was created;
application source, assets, styling and configuration are unchanged. No work was rerun.
