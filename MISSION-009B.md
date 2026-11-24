# MISSION 009B — Navigation & Reading Experience Refinement

Completed and verified: **2026-11-24, Asia/Barnaul**.

## 1. Executive Summary

Implemented all **nine authorized findings** from Mission 009A. Reading position
now drives the current-chapter indicator independently of the URL. Exhibition
entry includes the gallery-return control while retaining heading focus. Local
“Chapters & projects” disclosures make navigation available through long mobile
reads, and Material Study has native Stainless, Brass and Glass links.

Phone navigation targets are larger, project labels have more emphasis, functional
gallery metadata is more legible, nested notes/captions have deliberate reading
widths, and full-image links have distinct accessible names.

Final verification passed **265 production checks, 42 gallery/media regression
checks and six deliberate-failure checks**. Both projects were tested at all six
requested sizes. Normal production browsing recorded **zero console/runtime
errors, zero HTTP errors and zero failed requests**. The existing THREE.Clock
deprecation and large-gallery-bundle warning remain.

The approved palette, gallery composition, cameras, model/rig/materials/animation,
native fragments, existing chapter IDs, inspection and reduced-motion behavior
are preserved. Original assets and project narrative remain unchanged. No
dependencies were installed, and no owner information or attribution was invented.

## 2. Findings Implemented

“Fully resolved” below refers to the implemented behavior verified in the browser
matrix described in this report; it does not imply physical-device or screen-reader
certification.

| Finding | Status | Implemented result | Verification |
| --- | --- | --- | --- |
| **C03 — Accurate Current Chapter** | **Fully resolved** | A shared hook observes chapter sections and measures a reading line. Current state changes on scroll; URL/history/focus remain independent | Both exhibitions at all six sizes; manual scrolling changes current chapter while hash, history length and focused element remain identical |
| **C04 — Exhibition Entry Position** | **Fully resolved** | Navigation scrolls the containing introduction into view and focuses its H2 with `preventScroll` | Return link is about y = 53px and 44px high on entry; both projects, all sizes, repeated selection and fresh overview links pass |
| **C05 — Mobile Reading Controls** | **Fully resolved** | Native local disclosures at chapter boundaries, overview media and material subsections provide chapter links, project switching and gallery return | Pointer, keyboard and touch pass; opening a disclosure expands normal flow without overlaying prose; local navigation/reselection/switching and Back pass |
| **C07 — Main Navigation Touch Targets** | **Fully resolved** | Links have at least 44px interactive dimensions at ≤800px; phones use a dedicated four-column navigation row | 390px: approximately 83 × 44px per link; 320px: 65 × 44px; no overlap or isolated Contact wrap |
| **C08 — Reading Measure** | **Fully resolved** | Nested note paragraphs use 65ch; long figure/architecture captions use 80ch | Computed-style checks pass for both projects; full-width image frames and appropriate grids retain their widths |
| **C14 — Functional Metadata** | **Fully resolved** | Gallery captions, selection/loading status and featured-work labels use an 11px minimum while retaining mono styling | Computed sizes pass across the six viewports; gallery and WebGL-fallback screenshots were inspected |
| **D02 — Featured Work Hierarchy** | **Fully resolved** | Project titles increase from 14px to 17px desktop / 16px mobile; existing work controls and selected states remain | Gallery screenshots and computed hierarchy pass; titles remain substantially smaller than the studio headline |
| **D05 — Material Study Orientation** | **Fully resolved** | Restrained native links reach existing Stainless/Brass/Glass H4 IDs, which now accept destination focus and direct-link project recognition | Three links pass at every size; fresh subsection links mount Fire Sprinkler and keep Material Study current; five chapters remain |
| **D06 — Full Image Link Names** | **Fully resolved** | Each image record supplies a concise figure label for an accessible name such as “View full image: IcaMeal budget planner (opens in a new tab)” | All seven IcaMeal and eight Fire Sprinkler names are distinct, announce the new tab and retain the visible “View full image” affordance |

## 3. Files Modified

Created application file:

- [useReadingChapter.ts](src/exhibitions/useReadingChapter.ts) — shared reading
  state, visibility/resize observation and passive scroll scheduling.

Modified application files:

| File | Change |
| --- | --- |
| [useProjectNavigation.ts](src/exhibitions/useProjectNavigation.ts) | Scroll introductions/chapters/material subsections while preserving H2/H3/H4 focus destinations |
| [projects.ts](src/exhibitions/projects.ts) | Define three existing material subsection IDs and map their fragments to Fire Sprinkler / Material Study |
| [ProjectExhibitionRegion.tsx](src/exhibitions/ProjectExhibitionRegion.tsx) | Own reading state and provide the current chapter/navigation context to the selected article |
| [ExhibitionPrimitives.tsx](src/exhibitions/ExhibitionPrimitives.tsx) | Local native disclosures, material links, reading-based chapter-current state and distinct full-image accessible names |
| [IcaMealExhibition.tsx](src/exhibitions/IcaMealExhibition.tsx) | Connect current chapter and overview controls; existing chapter primitives supply local controls |
| [FireSprinklerExhibition.tsx](src/exhibitions/FireSprinklerExhibition.tsx) | Connect current chapter, material navigation, local subsection controls and H4 focusability |
| [icameal.media.ts](src/exhibitions/icameal.media.ts) | Add figure identifiers; original sources, dimensions, alt text, captions and credits remain identical |
| [fire-sprinkler.media.ts](src/exhibitions/fire-sprinkler.media.ts) | Add figure identifiers; original media records otherwise remain identical |
| [exhibitions.css](src/styles/exhibitions.css) | Reading measures, local disclosure layout/focus, adaptive link grid and section scroll margins |
| [app.css](src/styles/app.css) | Phone navigation boxes/row, functional metadata sizing and featured-work title hierarchy |

Created this report and supporting records under `.verification/mission-009b/`
and `artifacts/mission-009b/`. Refreshed generated `dist/` through the production
build so normal preview uses the completed implementation.

## 4. Design Decisions

### Reading state and native navigation have separate responsibilities

`useProjectNavigation` continues to own explicit fragment navigation, selection,
repeat activation, Back/Forward, destination focus and gallery return.
`useReadingChapter` only determines the chapter at a reading line near the top of
the viewport. It observes the introductory/chapter regions with IntersectionObserver
and ResizeObserver; passive scroll/resize events schedule at most one pending
measurement frame. This covers long chapters that can fill the viewport without
crossing an observer threshold. Observers/listeners are cleaned up on project change.

There is no continuous new frame loop, history update or focus movement during
manual reading. Explicit links still change the hash and focus their headings.
Material subsections resolve to the existing Material Study chapter rather than
adding chapters or changing its fragment.

### Local controls occupy normal page flow

At ≤1000px, and short heights where the original rail is static, compact native
`details` controls appear at reading boundaries. Readers can open them with
pointer, touch, Enter or Space. Expanded controls push subsequent content down;
they do not create a sticky panel or overlay. Native links close the local
disclosure on ordinary activation before destination navigation. Modified clicks
retain browser link behavior.

The complete original chapter index remains available, including its desktop
sticky behavior. Local disclosures remain collapsed until requested. The adaptive
grid uses one column at 320px and with enlarged text, two at 390px, and additional
columns where space permits. Readers reach controls at chapter/subsection boundaries
rather than through an always-visible mobile toolbar.

### Entry keeps context above the focused heading

The containing introduction or reading section is the scroll destination; its
heading remains the focus destination. A 32px section scroll margin leaves the
return link/local controls visible. Gallery-return targeting and inspection-reset
behavior remain on the existing path.

### Hierarchy changes stay within the existing system

Phone navigation has a full row below the brand, with 44px targets and existing
12px labels. A small phone-only hero-margin adjustment accommodates the taller
header. Canvas dimensions and camera calculations are unchanged. Gallery metadata
uses the existing mono stack at 11px; project titles use existing sans styling at
17px/16px. Existing colors, title styling, underline states and image frames remain.

Notes/captions receive text measures, not narrower media containers. Material
links are plain underlined native links. Figure identifiers describe supplied
artifacts; project descriptions, personal roles and credit statements are unchanged.

## 5. Responsive Test Results

Chrome **157.0.8103.79**, Windows headless with CDP. Mobile results are browser
emulation with actual emulated touch events. Desktop scrollbar space is accounted
for when evaluating overflow.

Both IcaMeal and Fire Sprinkler were independently checked at each size, including
all twelve chapter destinations, reading-current state, gallery-return visibility,
repeat selection, full-image names and three material subsection links.

| Viewport | Result | Reading/navigation layout |
| --- | --- | --- |
| **1440 × 900** | Passed | Original desktop gallery and sticky rail; local disclosures hidden; both overview return links visible |
| **1024 × 768** | Passed | Original desktop gallery/rail retained; long chapter labels wrap; both projects and material targets fit |
| **900 × 900** | Passed | Static original index plus compact local disclosures; expanded controls stay in flow |
| **768 × 1024** | Passed | Stacked gallery; ≥44px top-nav targets; local reading controls and project switching pass |
| **390 × 844** | Passed | Four phone nav targets approximately 83 × 44px; two-column local links; pointer/touch controls pass |
| **320 × 768** | Passed | Four nav targets approximately 65 × 44px; single-column local links; wrapping controls remain usable |

No horizontal document overflow was found in these tests. Expanded controls were
also checked against the following heading to confirm that they occupy separate
flow space. A 200% exhibition-text test at 320px included enlarged disclosure
summary/link text: the menu reflowed to one column, and text-range measurements
confirmed every local link stayed inside the reading measure.

Gallery canvas sizes remain 912 × 900 at the 1440px desktop sample,
646 × 780 at 1024px, 566 × 900 at 900px, 768 × 480 at 768px,
390 × 429 and 320 × 360 on phones. The taller accessible mobile header changes
the installation's vertical page position, while preserving its own composition.

## 6. Accessibility Verification

- The skip link is the first keyboard stop and focuses the main landmark.
- Native disclosures open from keyboard and expose native chapter links. Tab
  enters their link order; activation closes the disclosure and focuses the
  requested chapter heading. Summary/link focus is visibly outlined in green.
- No focus trap or custom keyboard-navigation model was added. Closed disclosure
  content is excluded from the native keyboard order.
- Chapter-current state follows reading for both projects. Manual scrolling does
  not steal focus; selected/current states retain underline as well as color.
- All original H2/H3 chapter IDs remain. Material H4s retain their existing IDs
  and now have `tabIndex={-1}` for destination focus.
- Phone main-navigation boxes meet the tested 44px minimum without overlap.
- Seven IcaMeal and eight Fire Sprinkler full-image link names are distinct;
  visible text/new-tab notices, image alt text and captions are preserved.
- Reduced motion still disables smooth scroll, stops the Maple's sway and pauses
  playing video when the preference changes. Video does not automatically resume.

The initial keyboard harness omitted Enter's character event, causing three
false failures for the native summary. A focused diagnostic confirmed that
complete Enter events and Space toggle it correctly. The corrected final harness
passed all keyboard checks; no keyboard polyfill was added to the application.

The original semantic structure and token contrast are retained. Screen-reader
operation and physical-device browser/zoom behavior remain unverified.

## 7. Navigation and History Verification

Verified:

- Native chapter activation updates the fragment and focuses H2/H3 correctly at
  every tested size. Reading-current state agrees at the destination.
- Manual scrolling between chapters changes only current presentation state:
  hash, `history.length` and focused element remain identical before/after.
- Back/Forward restore chapter focus/current state. Back across local project
  switching restores the previous exhibition and chapter.
- Repeated project selection restores the overview and visible return control.
  Repeated local chapter activation closes the disclosure and restores destination focus.
- Fresh documents load all twelve original chapter links and all three material
  subsection links. Fresh overview links include the gallery-return control.
- Legacy `#work-blender` selects Fire Sprinkler. Unknown/malformed fragments
  remain safe.
- Gallery return retains the active article and Canvas and focuses its matching
  work control. Inspection toggles; Escape restores its existing non-inspection state.
- Touch opens local controls, switches projects and scrolls the page over the Canvas.

No router or navigation replacement was introduced. The existing native link and
history behavior remains the basis of the experience.

## 8. Build and Typecheck Results

Passed baseline and final typecheck:

```powershell
npm run typecheck
```

Passed isolated verification build and final normal production build:

```powershell
npm run build -- --configLoader runner --outDir .verification/mission-009b/build
npm run build -- --configLoader runner
```

The runner loader avoids the already-known sandbox parent-directory restriction
without editing Vite configuration. The generated normal `dist/` and isolated
verification build match byte for byte across **21 output files**.

| Bundle | Size | Gzip |
| --- | ---: | ---: |
| Main application JS | 240.75kB | 75.15kB |
| GalleryCanvas JS | 1,018.89kB | 276.31kB |
| CSS | 13.41kB | 3.26kB |

The existing gallery chunk warning remains. No dependency or design-token file
changed. [Build log](.verification/mission-009b/build.log) and
[build equivalence](artifacts/mission-009b/build-equivalence.json) record the results.

## 9. Regression Testing and Preservation

### Gallery and media

The separate gallery run passed **42 checks** at the six requested sizes:

- One persistent Canvas and 301 skinned meshes remain.
- Scene samples retain **313 draw calls, 34,854 triangles, 308 geometries and four
  textures**. No geometry, material, camera, DPR or renderer optimization was made.
- Opening camera position/quaternion/FOV match the prior verified 1440/390/320px
  baselines. At all six sizes, inspection changes the camera and exhibition return
  restores the measured opening camera and work-control focus.
- Sway advances while active; offscreen frame counts remain fixed in demand mode;
  reduced motion stops animation and frame advancement.
- All seven IcaMeal/eight Fire Sprinkler images load with their original alt text
  and proportions. The original MKV plays deliberately in Chrome, pauses on
  preference changes, and pauses on unmount when switching projects.

The final production run passed **265 checks** with no normal console/runtime,
HTTP or failed-request errors. No external HTTP services were requested. The
inherited THREE.Clock warning remains separately recorded.

### Deliberate failures

The final-build failure run passed **six checks**. A failed image keeps its caption
and removes only its broken full-image link; new local navigation remains usable.
A failed video retains caption/focus and removes its download. WebGL failure
retains direct-link focus/current state, local project switching and gallery return.
Four expected injected console errors are separated in the failure artifact.

### File/content integrity

Established a pre-edit SHA-256 baseline of **86 application, asset and root files**
and copied source files for comparison. Final integrity checks show:

- **76 baseline files preserved; ten authorized application files modified**;
  one new application hook added; no unexpected changes.
- All original public/source assets, gallery implementation, global styles,
  design tokens, dependency manifests, configurations and prior mission reports
  retain their hashes.
- Both exhibition narratives retain the same 31/37 checked text blocks. Media
  record comparisons confirm that only figure-label fields were added.
- **17 delivered image/vector/video/model files match original asset bytes**.

[Integrity evidence](artifacts/mission-009b/integrity.json) records the files,
content checks and emitted-asset matches. No original asset was moved, replaced,
converted or deleted. Owner-dependent About/Contact/contribution/attribution
content remains as supplied.

## 10. Remaining Issues

No authorized finding is partially resolved or deferred. The following Mission
009A findings remain **deferred by this mission's explicit scope**:

| Finding | Status / reason |
| --- | --- |
| C01 — About/Contact placeholders | Deferred; owner information/contact method required and editing expressly excluded |
| C02 — Intended font delivery | Deferred; font sourcing/delivery not authorized here |
| C06 — Dense artifact legibility | Deferred; original media preserved; this mission improves link naming, not detail views or replacement captures |
| C09 — Attribution gaps | Deferred; real source/owner records required |
| C10 — IcaMeal contribution | Deferred; owner-confirmed role required; project narrative unchanged |
| C11 — First offscreen gallery loading | Deferred; gallery loading/rendering optimization excluded |
| C12 — Large gallery bundle | Deferred; measured warning remains; no rendering/dependency optimization |
| C13 — Responsive image delivery | Deferred; original assets retained without conversions |
| R01 — MKV support in other browsers | Deferred; Chrome passed, other engines/physical devices unverified |
| R02 — Physical-device gallery cost | Deferred; measured scene cost preserved; device profiling/optimization excluded |
| D01 — Editorial narrative changes | Deferred; project descriptions preserved |
| D03 — Broader tablet/mobile composition refinement | Deferred; only spacing required for accessible phone navigation changed |
| D04 — IcaMeal identity evidence expansion | Deferred; no additional artifact treatment/content authorized |
| D07 — Specimen material polish | Deferred; original model/material appearance preserved |

Testing limits: Chrome on Windows and emulated mobile input only. Browser-only
200% text enlargement was checked; physical devices, screen readers, other browser
engines and full browser-zoom certification were not exercised. No deployment was performed.

## 11. Screenshots and Reproducible Evidence

- [Final production verification](artifacts/mission-009b/production/audit-results.json).
- [Gallery/media regression](artifacts/mission-009b/gallery/audit-results.json).
- [Final-build failure verification](artifacts/mission-009b/failures/audit-results.json).
- [1440px gallery hierarchy](artifacts/mission-009b/production/gallery-1440x900.png).
- [Desktop IcaMeal entry and visible return](artifacts/mission-009b/production/icameal-overview-1440x900.png).
- [390px main navigation](artifacts/mission-009b/production/gallery-390x844.png).
- [320px main navigation](artifacts/mission-009b/production/gallery-320x768.png).
- [390px local reading controls](artifacts/mission-009b/production/icameal-reading-controls-390x844.png).
- [320px local reading controls](artifacts/mission-009b/production/icameal-reading-controls-320x768.png).
- [Keyboard reading focus](artifacts/mission-009b/production/keyboard-reading-390x844.png).
- [Fire Sprinkler Glass destination](artifacts/mission-009b/production/material-glass-390x844.png).
- [200% text and adaptive local menu](artifacts/mission-009b/production/text200-controls-320x768.png).
- [WebGL fallback with local reading controls](artifacts/mission-009b/failures/webgl-failure-reading-390x844.png).

With the isolated preview on port 4210 and development server on 5210:

```powershell
$env:AUDIT_URL = 'http://127.0.0.1:4210'
$env:AUDIT_OUTPUT = 'artifacts/mission-009b/production'
Remove-Item Env:AUDIT_BODY -ErrorAction SilentlyContinue
node .verification/mission-009b/browser-smoke.mjs

$env:AUDIT_URL = 'http://127.0.0.1:5210'
$env:AUDIT_OUTPUT = 'artifacts/mission-009b/gallery'
$env:AUDIT_BODY = './regression-checks.txt'
node .verification/mission-009b/browser-smoke.mjs

$env:AUDIT_URL = 'http://127.0.0.1:4210'
$env:AUDIT_OUTPUT = 'artifacts/mission-009b/failures'
$env:AUDIT_BODY = './failure-checks.txt'
node .verification/mission-009b/browser-smoke.mjs

node .verification/mission-009b/integrity.mjs
```

Browser verification used the already installed local Chrome and required its
debugging connection outside the filesystem sandbox. No additional test dependency
was installed. The dedicated audit servers were stopped after verification.
