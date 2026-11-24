# Mission 007 — Interaction & Navigation

Completed: 2026-11-23 (Asia/Barnaul).

The portfolio now has working section navigation, accessible selection of
IcaMeal and Blender, and a restrained Japanese Maple inspection mode. The
Mission 006C gallery, materials, model transform, lighting, and sway are
preserved. Work stops at Mission 007; Mission 008 has not started.

## Interactions and navigation

All navigation uses native HTML anchors without a router or navigation library:

| Control | Target / behavior |
| --- | --- |
| Work | Existing FeaturedWorkIndex, `#featured-work` |
| Explore the work | Same existing work index |
| Studies | Dedicated editorial section, `#studies` |
| View specimen | Existing gallery figure, `#botanical-study` |
| About | `#about`, heading “About”, text “Awaiting future content.” |
| Contact | `#contact`, heading “Contact”, text “Awaiting future content.” |
| Site brand | `#top` |
| Skip to content | `#main-content` |

Studies contains only the grounded label “Botanical Study / Blender
Experiments.” About and Contact contain explicit placeholders. No project
descriptions, biography, personal claims, contact details, or external project
URLs were invented.

Anchors preserve native fragment history and move keyboard focus to the section
targets. CSS enables smooth scrolling and switches to immediate scrolling under
`prefers-reduced-motion: reduce`. The header keeps its original styling; About
and Contact are now links. Active-section tracking was omitted to keep the
navigation simple.

IcaMeal and Blender are native buttons in a named group. Each exposes its state
through `aria-pressed`; a small `role="status"` line announces the selected
label. Hover and selection use the existing terracotta accent, selection adds
an underline, and keyboard focus has a green outline. Button targets are at
least 44px high while the work index retains its original text placement.
Selecting a project does not open a detail page.

## Camera behavior and rendering

The DOM owns the inspection toggle and Escape handling. It passes a boolean
through GalleryCanvas to GalleryCamera; all camera work stays inside Canvas.
The button is disabled until the specimen is ready and also remains disabled
when loading fails.

Default framing retains the exact Mission 006C calculation: the same focal
length, film gauge, target, minimum distance, and portal coverage rules. Mobile
keeps the existing centered target. The opening gallery stage retains its
desktop viewport height and original stacked layout on mobile. The additional
sections follow below it. A native desktop scrollbar now occupies its usual
layout space; baseline comparisons account for that width without hiding it.

Inspection uses a modest 10% reduction in calculated camera distance, a 0.1 m
lower camera position, and small target offsets. The portal remains recognizable
and the complete canopy stays in frame. No specimen position, scale, yaw,
animation, material, or lighting changes accompany inspection.

The transition takes 0.8 seconds of active frame time with smoothstep easing.
It starts from the current position and target, so Return or Escape can reverse
a transition in progress. Return restores the original position and look target;
browser assertions compare the complete position, quaternion, and field of view
for exact equality. Reduced motion applies the destination immediately.
Resizing recalculates the responsive endpoint immediately.

GalleryCamera uses Fiber's existing `useFrame` subscription and `invalidate`.
It requests subsequent frames only while an active transition is running. The
existing Maple sway still determines continuous rendering while visible and
motion is allowed. Camera transitions and sway pause when the gallery is
offscreen or the document is hidden, then resume through the existing activity
hook. Delta remains capped to avoid a large step after a pause.

Source inspection confirms one Canvas and one AnimationMixer construction,
owned by JapaneseMaple. No application `requestAnimationFrame` loop, camera
control library, extra 3D asset, additional light, geometry, or post-processing
was introduced. JapaneseMaple and useGalleryActivity were not modified.

## Accessibility and responsive verification

The updated browser smoke harness reuses Mission 006C's actual renderer,
skinned-vertex bounds, asset integrity checks, lifecycle checks, and deliberate
failure cases. The additional checks exercise real CDP keyboard, mouse, and
touch input rather than invoking React handlers directly.

Passed at 1440 × 900, 390 × 844, and 320 × 768:

- All four header targets and the hero CTA navigate to visible sections and
  focus their native anchor targets.
- Tab reaches each header link, CTA, inspection button, project button, and
  specimen link in DOM order. Their computed focus outlines are visible.
- Enter selects IcaMeal; Space selects Blender. The pressed states and visible
  selection announcement agree.
- Enter activates inspection and Return. Escape restores the exact camera,
  including when pressed during a transition.
- The persistent inspection button retains focus after keyboard return.
  Escape returns focus within the gallery without stealing focus from unrelated
  page navigation or causing a scroll jump.
- Reduced-motion inspection changes the camera immediately, keeps the static
  Maple pose, and performs no continuing renders after invalidations settle.
- The animated camera interpolates monotonically toward the inspection endpoint
  and finishes within the expected duration range.
- Actual skinned canopy vertices stay within the Canvas in both default and
  inspection states, including an animated inspection sample.
- Desktop retains the two-column composition; mobile retains its stack. About
  and Contact remain readable, and no horizontal overflow occurs.
- Emulated touch taps activate inspection at both mobile sizes. Touch swipes
  scroll normally over the gallery. Desktop wheel scrolling also passes.
- Only one Canvas and one specimen instance are present, with the original
  301 skinned meshes and 21-bone skeleton association.

Both the camera and sway pause and resume under an actual hidden browser tab
and an offscreen gallery. A separate injected-demand test isolates the camera's
invalidation from the existing continuous sway: the camera reaches its endpoint,
then render counters remain unchanged for the idle sample. The original sway
clip wraps normally at its production time scale. Changing the live motion
preference restores a static pose and demand rendering.

Blocked GLB requests retain the architecture and editorial DOM. Unavailable
WebGL retains the approved illustration and availability message. Native Work
navigation continues to work during failures. Normal operation produced zero
console, runtime, or HTTP errors and no unexpected external requests. The three
intentional fault errors are recorded separately.

## Screenshots and evidence

- [Default desktop 1440 × 900](artifacts/mission-007/desktop-1440x900.png)
- [Desktop inspection](artifacts/mission-007/desktop-inspection-1440x900.png)
- [Mobile 390 × 844](artifacts/mission-007/mobile-390x844.png)
- [Mobile 320 × 768](artifacts/mission-007/mobile-320x768.png)
- [390px complete page](artifacts/mission-007/mobile-390-full.png)
- [320px complete page](artifacts/mission-007/mobile-320-full.png)
- [390px inspection](artifacts/mission-007/mobile-390-inspection-full.png)
- [320px inspection](artifacts/mission-007/mobile-320-inspection-full.png)
- [About and Contact placeholders](artifacts/mission-007/about-contact-placeholders.png)
- [Asset failure](artifacts/mission-007/asset-failure-320.png)
- [WebGL failure](artifacts/mission-007/webgl-failure-320.png)
- [Full browser verification](artifacts/mission-007/verification.json)

The browser harness is `.verification/mission-007/browser-smoke.mjs`. Local
Chrome profiles remain in the ignored `.verification/` directory.

## Performance and asset integrity

The same hardware-accelerated headless Chrome renderer reported NVIDIA GeForce
RTX 3060 via ANGLE/D3D11. All three viewport samples retain the Mission 006C
renderer counts:

| Quantity | Mission 006C | Mission 007 |
| --- | ---: | ---: |
| Draw calls | 313 | 313 |
| Rendered triangles, including shadow pass | 34,854 | 34,854 |
| Geometries | 308 | 308 |
| Textures | 4 | 4 |

Short active-animation samples remained approximately 180 frames/s in that
headless desktop environment. This is not a physical-phone performance result.
The camera adds only vector interpolation within existing render frames.
Its isolated demand-render test records zero additional idle frames.

The unchanged Japanese Maple GLB, Blender source, package.json, and lockfile
pass their existing SHA-256 checks. No dependencies were installed. The final
build contains the original 4,439,192-byte GLB and no Blender source.

Final production output:

- Editorial bundle: 204.43 kB / 64.52 kB gzip.
- Gallery bundle: 1,018.89 kB / 276.31 kB gzip.
- CSS: 5.64 kB / 1.86 kB gzip.

## Files created and modified

Created application files:

- `src/components/EditorialSections.tsx` — Studies and the two explicit
  editorial placeholders.
- `src/gallery/GalleryCamera.tsx` — preserved default framing, inspection
  endpoints, and the activity-aware Fiber transition.

Modified application files:

- `src/App.tsx` — retains the opening stage and appends the editorial sections
  within the existing main landmark.
- `src/components/SiteHeader.tsx` — functional semantic section links.
- `src/components/FeaturedWorkIndex.tsx` — accessible project selection.
- `src/gallery/GalleryViewport.tsx` — DOM inspection control, focus handling,
  readiness state, and Escape handling.
- `src/gallery/GalleryCanvas.tsx` — passes interaction and activity signals to
  the extracted camera component.
- `src/gallery/gallery.config.ts` — small inspection offsets and duration.
- `src/styles/global.css` — reduced-motion-aware scrolling and focus styling.
- `src/styles/app.css` — stage sizing, controls, and restrained section styling.
- `README.md` — current mission scope, behavior, and review links.

Created review files: this report, the updated smoke harness, screenshots, and
`artifacts/mission-007/verification.json`. Historical mission reports and their
artifacts are preserved.

## Commands and remaining issues

```sh
npm run typecheck
npm run build
node .verification/mission-007/browser-smoke.mjs
```

All required checks pass. Vite/esbuild and Chrome required execution outside the
filesystem sandbox because the sandbox prevented configuration resolution and
local debugging communication; automatic review approved those check commands.

No unresolved Mission 007 interaction issue was observed. Existing notices and
limits remain: the gallery chunk exceeds Vite's 500 kB warning threshold,
Fiber emits the existing THREE.Clock deprecation warning, approved fonts remain
unsupplied, the leaf palette is the existing single-color approximation, and
301 skinned meshes may be expensive on weaker mobile hardware. Physical mobile
performance and assistive-technology testing on real devices were not measured.

No case studies, scene exploration, additional models, or Mission 008 work were
implemented.
