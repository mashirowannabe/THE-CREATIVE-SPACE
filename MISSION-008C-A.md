# Mission 008C-A — Exhibition Foundation & IcaMeal Implementation

Completed: 2026-11-23 (Asia/Barnaul).

## 1. Summary and audit

Implemented one DOM project-exhibition region below the approved gallery and
above the existing Studies / About / Contact sections. IcaMeal has all seven
chapters, original presentation media, native chapter navigation, fragment
history, project switching and gallery return. The opening gallery remains
mounted and operational. No Fire Sprinkler or Plants Weird exhibition was added;
Mission 008C-B was not begun.

Before application edits, read Missions 008A and 008B, the application components,
gallery activity/camera/mixer code, styles, IcaMeal documentation and relevant
source handlers. Viewed all seven supplied IcaMeal screenshots. Recorded the
[implementation plan](.verification/mission-008c-a/implementation-plan.md) and
[SHA-256 baseline](.verification/mission-008c-a/integrity-before.json).

The initial app had local work-selection state, native section anchors and one
lazy-loaded GalleryCanvas. GalleryViewport owned inspection state; JapaneseMaple
memoized its mixer. The existing activity hook handled visibility and motion
preferences. These boundaries determined the implementation.

Paths were checked against this workspace rather than assumed from old reports.
IcaMeal images are under `source-assets/icameal/screenshots/`; the botanical SVG
is under `source-assets/icameal/source code/assets/`. The baseline also includes
existing Fire Sprinkler source imagery/video, its BLEND, and public PNG/MKV
presentation files. Those assets were left untouched and are not used by an
exhibition in this mission. The historical Plants and editable Maple BLEND paths
are not present in this snapshot; neither source was recreated or relocated.
The original gallery GLB exists at `public/models/japanese-maple.glb`.

This workspace is not a Git repository. The available Codex AGENTS.md is empty;
no applicable ancestor/repository AGENTS.md was found.

## 2. Files created and modified

Created application files:

- `src/exhibitions/projects.ts` — typed project/chapter definitions and exact
  fragment recognition; Blender retains selection without a chapter destination.
- `src/exhibitions/useProjectNavigation.ts` — app-level selection, native hash and
  history synchronization, repeat selection, destination focus and gallery return.
- `src/exhibitions/ProjectExhibitionRegion.tsx` — stable named DOM region with
  one implemented active article.
- `src/exhibitions/ExhibitionPrimitives.tsx` — reusable chapter sections, chapter
  index, figures/captions, image failure handling and gallery-return anchors.
- `src/exhibitions/icameal.media.ts` — seven explicit presentation imports,
  intrinsic dimensions, alt text, captions and visible source/limitation notes.
- `src/exhibitions/IcaMealExhibition.tsx` — bespoke seven-chapter narrative,
  semantic architecture diagram and project-switch control.
- `src/styles/exhibitions.css` — scoped exhibition layout using existing tokens.

Modified application files:

- `src/App.tsx` — connects the navigation controller and appends the DOM region.
- `src/components/FeaturedWorkIndex.tsx` — controlled selection, stable work-button
  IDs and IcaMeal's `aria-controls`; preserves existing labels and appearance.
- `src/gallery/GalleryViewport.tsx` — accepts a DOM gallery-return signal that
  resets its existing inspection state. No camera calculation or renderer changes.
- `src/vite-env.d.ts` — types the SVG `?no-inline` import so native full-image
  navigation uses a real emitted file rather than a top-level data URL.

Created review/verification files:

- This report.
- `.verification/mission-008c-a/implementation-plan.md`, integrity baseline and
  Chrome/CDP development and production smoke harnesses.
- `artifacts/mission-008c-a/verification.json`, `production-verification.json`,
  `asset-delivery.json` and new browser screenshots linked below.

No existing prototype, source asset, source application, prior mission report,
prior screenshot, dependency file, global style or design-token file was edited.

## 3. Exhibition architecture

```text
App — project/fragment controller
  SiteHeader
  main
    exhibition-main                 preserved opening stage
      HeroCopy
      GalleryViewport               same lazy Canvas / scene / Maple
      FeaturedWorkIndex
    ProjectExhibitionRegion         stable aria-controls destination
      IcaMealExhibition              only when IcaMeal is selected
        introduction + shopping artifact
        ChapterIndex + chapter sequence
        gallery return + Select Blender
    EditorialSections               existing anchors and content
```

The registry and shared primitives can accept future project chapters without a
new router or rendering system. Blender currently has no article/chapter entries;
selecting it preserves its work-button behavior and removes the IcaMeal article.
No empty Blender, Fire Sprinkler or Plants Weird exhibition is published.

Explicit gallery return retains IcaMeal below the gallery, preserving page height
as specified in Mission 008B. It navigates to `#featured-work`, restores matching
work-control focus, and shows the opening stage on desktop or Maple figure on
mobile. Selecting Blender closes the active article. Re-selecting IcaMeal opens
or returns to its overview.

Project content is ordinary DOM. No product source scripts, credentials, Supabase
client, live checkout, source glob, additional Canvas or 3D geometry is imported.
Only the selected article renders image elements. The opener loads eagerly;
remaining figures use lazy loading and asynchronous decoding with intrinsic sizes.

## 4. IcaMeal chapters and evidence

| Chapter | Fragment | Implementation |
| --- | --- | --- |
| 01 Overview | `#project-icameal` | Frontend-prototype purpose/scope and original shopping-checklist opener |
| 02 Identity | `#project-icameal-identity` | Observed product palette, Fraunces/DM Sans treatment and contained original botanical SVG |
| 03 Budget & Weekly Menu | `#project-icameal-budget` | Successive budget and weekly PNG plates; tag preferences, seven main meals, search/fallback, regeneration and estimate boundaries |
| 04 Recipes & Shopping | `#project-icameal-recipes` | Original catalog capture, preview/dialog source paths, guest/database checklist behavior, link back to shopping opener and visible defect link |
| 05 Monthly & Club | `#project-icameal-access` | Original calendar and club captures; entitlement boundary, catalog rotation, simulated checkout, unimplemented favorites and absent download evidence |
| 06 Architecture | `#project-icameal-architecture` | Semantic DOM request-path diagram and prose equivalent; HTML/CSS/vanilla JS/SDK, guest memory, auth-session persistence and missing backend evidence |
| 07 Notes | `#project-icameal-notes` | Visible unresolved ingredient undercount, synthetic 100 g versus 200 g diagnostic, cost/monthly/backend/photographic limits and possible next work |

The implementation reproduces six of the seven original PNG screenshots plus
the original SVG. The optional `hero.png` remains unused while its Uchiko photo
rights are unresolved, following Mission 008B. The shopping plate is not duplicated
in chapter 04. Included screenshots retain their full captured proportions;
translucent preview and partly clipped monthly heading are described truthfully.

Visible copy separates captured interface states and source request paths from
unverified hosted behavior. No commercial launch, payments, user/revenue numbers,
research, customer feedback, personal authorship/reflection, nutritional validation,
guaranteed affordability, implemented favorites or optimized monthly plan is claimed.
IcaMeal's original source and its aggregation defect were not modified.

## 5. Interaction and accessibility

- Project controls are native buttons. Chapter, gallery-return and full-image
  controls are native anchors. No router dependency or focus trap.
- Recognized initial fragments mount the article before destination focus/scroll.
  `hashchange` and `popstate` handle Back/Forward; duplicate traversal events are
  deduplicated. Repeated project/chapter activation still reaches its heading.
- Overview focus goes to the H2; chapter focus goes to the H3. Navigation does
  not move focus during ordinary scrolling. Unknown/malformed fragments are safe.
- Only the active article is in the DOM and keyboard order. Switching to Blender
  lands on its persistent work button; Back to an IcaMeal chapter remounts it.
- Explicit return focuses the matching IcaMeal button with `preventScroll` and
  resets inspection through GalleryViewport's existing state/camera path.
- Escape leaves the reading article and its focus intact. Existing gallery
  inspection Escape behavior still restores the camera and inspection-control focus.
- The existing skip link, main landmark, sole portfolio H1, global section targets
  and 2px green/6px-offset focus outline are preserved. Chapter-current state also
  uses an underline. New index/full-image/return/switch controls are at least 44px high.
- Meaningful media have accurate alt text, visible summaries and captions. A failed
  image replaces its frame with a description/status, keeps its caption and removes
  its full-image link. Chapter navigation continues to work.
- Full-image anchors announce the new tab, use real assets and native browser
  inspection. No screenshot controls masquerade as live product controls.
- Reduced motion uses the existing immediate-scroll preference and static Maple
  behavior. No exhibition animation or new animation-frame loop was introduced.

## 6. Responsive verification

| Browser viewport | Result |
| --- | --- |
| 1440 × 900 | 12-column reading grid, 2-column sticky rail / 10-column article; gallery and seven chapters pass; no horizontal overflow |
| 390 × 844 | Single column, non-sticky two-column chapter index, natural media ratios; touch scrolling and all interactions pass |
| 320 × 768 | Same mobile structure with wrapping controls; all chapters, images and keyboard navigation pass without overflow |
| 900 × 900 | Tablet index above article, non-sticky; no overflow |
| 1440 × 600 | Short-height rail falls back to normal flow; no overflow |
| 320 × 768 with 200% exhibition text | Text, chapter labels, headings and captions enlarged through injected verification CSS; repeat chapter navigation and wrapping pass without overflow |

The exhibition width is capped at 1240px. Mobile uses the existing 24px page
gutters; tablet index placement changes at 1000px. Gallery geometry/layout retains
its existing 800px breakpoint. Text enlargement was tested, not presented as a
complete browser-zoom or assistive-technology certification.

## 7. Typecheck and production build

Both final commands passed:

```sh
npm run typecheck
npm run build
```

Final output: editorial JS 221.93 kB / 70.23 kB gzip; gallery JS 1,018.89 kB /
276.31 kB gzip; CSS 10.82 kB / 2.84 kB gzip. Vite retains the existing gallery
chunk warning above 500 kB. No dependencies were installed or changed.

The seven emitted presentation assets are byte-identical to their source files;
see [asset delivery verification](artifacts/mission-008c-a/asset-delivery.json).
No BLEND is present in the build. Existing public Fire Sprinkler PNG/MKV assets
pass through Vite's ordinary public-directory copy unchanged; the app does not
load or link them in this mission.

Sandboxed Vite initially failed to resolve configuration through restricted parent
directories; sandboxed Chrome debugging initially timed out. Automatic review
approved local build/server/browser verification outside the sandbox. Dedicated
ports 5174/4174 avoided the already occupied 5173. No deployment was performed.

## 8. Browser testing and evidence

Hardware-accelerated headless Chrome 157.0.8103.79 on Windows, controlled through
CDP. Development and production-preview runs passed with **zero failed assertions
and zero unexpected console/runtime/HTTP errors**. Mobile results are browser
emulation, not physical mobile-device testing.

Development checks cover all seven anchors, repeated activation, fresh direct links,
unknown/malformed fragments, Back/Forward within chapters and across project
switches, global section navigation, return focus, image links, keyboard order/
focus visibility, touch scrolling, reduced-motion changes and media failures.

Gallery checks confirm one persistent Canvas, scene and Maple instance across DOM
navigation, the original 301 skinned meshes/63 animation tracks, active sway and
bone deformation, offscreen demand-render idling, static reduced motion, inspection
interpolation and the exact approved camera endpoint after both normal-motion and
reduced-motion returns. Opening layout measurements match Mission 007 within 1px.
All three sizes retain 313 draw calls, 34,854 rendered triangles, 308 geometries
and four textures in the static gallery samples.

Production checks independently exercise emitted assets, all chapter targets,
switching/return/history and overflow at the three required sizes. All seven
presentation images load with alt text; their URLs point to emitted `/assets/`
files, not product source scripts.

Intentional screenshot failure retains readable content and chapter navigation.
Intentional WebGL failure retains the gallery placeholder and usable IcaMeal article,
including gallery-return focus. The three resulting fault errors are recorded
separately from normal errors. The existing THREE.Clock deprecation remains a warning.

Evidence:

- [Development verification](artifacts/mission-008c-a/verification.json)
- [Production verification](artifacts/mission-008c-a/production-verification.json)
- [Desktop gallery](artifacts/mission-008c-a/gallery-1440x900.png)
- [Desktop overview](artifacts/mission-008c-a/icameal-overview-1440x900.png)
- [Desktop chapter rail and budget](artifacts/mission-008c-a/icameal-budget-1440x900.png)
- [390px complete exhibition](artifacts/mission-008c-a/icameal-full-390.png)
- [320px complete exhibition](artifacts/mission-008c-a/icameal-full-320.png)
- [Production 390px overview](artifacts/mission-008c-a/production-icameal-390x844.png)
- [Tablet layout](artifacts/mission-008c-a/exhibition-900x900.png)
- [Short-height layout](artifacts/mission-008c-a/exhibition-1440x600.png)
- [200% text enlargement](artifacts/mission-008c-a/text-200-percent-320.png)
- [Image-failure navigation](artifacts/mission-008c-a/image-failure-390.png)
- [WebGL-failure gallery return](artifacts/mission-008c-a/webgl-failure-390.png)

Reproducible harness commands, with the local development/preview servers running:

```sh
node .verification/mission-008c-a/browser-smoke.mjs
node .verification/mission-008c-a/production-smoke.mjs
```

## 9. Known limitations and remaining work

No required Mission 008C-A implementation or verification item remains incomplete.

IcaMeal retains its unresolved repeated-recipe aggregation defect, simulated
checkout, unimplemented favorites/downloads, non-optimized monthly rotation and
unverified hosted backend/nutrition/cost claims. External food-photo attribution
and rights remain unresolved; the optional hero is withheld. Included screenshot
captions retain that distinction. Original dense desktop captures need native
full-image inspection for small labels on mobile; no replacement/mobile captures
were generated.

Existing gallery limits remain: large gallery bundle, THREE.Clock warning,
unsupplied approved fonts with the existing fallback stacks, the existing leaf
material approximation and mobile GPU cost. Physical-device performance,
screen-reader use and other browser engines were not tested.

Fire Sprinkler and Plants Weird exhibitions, new renders/conversions, source-product
fixes, publication/deployment and Mission 008C-B are outside this implementation.

## 10. Preservation confirmation

**The existing 3D gallery remains intact.** Portal, plinth, Japanese Maple,
geometry, lighting, materials, camera calculations, DPR, Canvas lifecycle,
AnimationMixer lifecycle and rendering activity/preferences are preserved.
Only GalleryViewport's DOM inspection state accepts the explicit return signal.

All 53 other baselined files match their before-edit SHA-256 values, including
original source/public assets, Mission 004 prototype, 008A/008B reports, gallery
implementation files, dependency files, global styles/tokens and activity hook.
The gallery GLB and built copy both retain:

```text
167858B8C7E4F3E51B1FC702B1C61061741D5DECFE2B14FA277457EA6E15615D
```

No original asset was deleted, overwritten, relocated, converted, generated or
downloaded. No IcaMeal source code was executed inside the portfolio and no
Supabase or payment service was contacted. No second Canvas, geometry, model,
light, visual effect or unnecessary dependency was introduced.
