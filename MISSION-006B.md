# Mission 006B — Gallery Blockout

Completed: 2026-11-23 (Asia/Barnaul).

The real architectural blockout is visible in GalleryViewport. GalleryCanvas now
mounts a perspective camera, floor, back wall, recessed portal, empty plinth, and
restrained gallery lighting. The approved editorial composition, copy, typography,
palette, and responsive DOM layout remain intact.

## Created files

Application components:

- src/gallery/GalleryEnvironment.tsx
- src/gallery/ArchitecturalPortal.tsx
- src/gallery/ExhibitionPlinth.tsx
- src/gallery/GalleryLighting.tsx

Handoff and review artifacts:

- MISSION-006B.md
- artifacts/mission-006b/desktop-1440x900.png
- artifacts/mission-006b/mobile-390x844.png
- artifacts/mission-006b/mobile-320x768.png
- artifacts/mission-006b/mobile-390-full.png
- artifacts/mission-006b/mobile-320-full.png
- artifacts/mission-006b/verification.json

Local verification helper:

- .verification/mission-006b/browser-smoke.mjs
- Isolated Chrome test profiles in the same ignored directory.

## Modified files

- src/gallery/GalleryViewport.tsx: replaces the rendered SVG with the actual
  Canvas; loads the gallery bundle separately with a stable Suspense fallback.
- src/gallery/GalleryCanvas.tsx: configures the renderer, supported PCF shadows,
  and responsive 45 mm perspective camera.
- src/gallery/GalleryScene.tsx: composes the four scene components.
- src/gallery/gallery.config.ts: records dimensions, palette, camera framing,
  DPR, and shadow budget.
- src/styles/app.css: adds Canvas sizing, a desktop edge fade into the ivory
  editorial area, and pointer behavior. Existing text and layout rules remain.
- README.md: describes the current mission boundary and links review artifacts.

No scaffold was duplicated. No dependencies or external assets were added.
package.json and package-lock.json retain their original hashes. The original
placeholder component and SVG remain in the workspace and are no longer rendered.

## Scene components and measurements

The scene uses Three.js Y-up coordinates, with the floor at Y = 0.

| Component | Implementation |
| --- | --- |
| GalleryEnvironment | 10 × 8 m floor; 10 × 3.8 m back wall with an opening; recessed back panel |
| ArchitecturalPortal | 4.1 × 3.4 m outer surround; 3.4 × 2.85 m clear opening; center X = +2.1 m |
| ExhibitionPlinth | 1 × 0.9 × 0.28 m, interpreted as width × depth × height; center (2.1, 0.14, 0.7); empty |
| GalleryLighting | One directional key above and camera-left; one hemisphere fill |
| GalleryScene | Composes the environment, portal, plinth, and lighting |
| GalleryCanvas | Perspective camera, ACES tone mapping, sRGB output, capped DPR, demand rendering |
| GalleryViewport | Mounts the actual Canvas inside the existing figure and editorial layout |

The floor slab is 0.08 m thick and the wall is 0.16 m thick. The portal projects
0.12 m from the main wall face. Its recess is 0.45 m deep, measured from the
portal face to the recessed back panel.

The wall uses one simple extruded profile. The portal uses three boxes that meet
without overlapping at the header corners. The floor, back panel, and plinth use
boxes. There are seven meshes in total: six boxes and one extruded wall.

Surfaces use the approved ivory #F1EFE8 and raised ivory #E5E1D7, roughness
0.94–0.96, and zero metalness. Existing graphite, green, and terracotta DOM
colors remain unchanged.

The key light is at (-3, 7, 5), intensity 2.25, with a warm neutral color.
Hemisphere fill intensity is 1.25. Only the portal and plinth cast shadows.
One 1024 × 1024 PCF shadow map with radius 2.5 provides restrained soft edges.
No post-processing, bloom, fog, or spotlights were added.

## Camera and blueprint adjustments

The supplied camera reference uses Z-up coordinates. It corresponds to
(0.5, 2.7, 8.5) looking toward (0.5, 1.6, 0) in this Y-up scene. The camera
was reframed for the existing right-side GalleryViewport.

The camera uses a 45 mm focal length and 36 mm film gauge. Near/far planes are
0.1/60 m. Framing responds to the measured Canvas aspect ratio and the existing
800px DOM breakpoint.

| Browser viewport | Actual camera position | Look target |
| --- | --- | --- |
| 1440 × 900 | (1.8, 2.7, 7.285) | (1.8, 1.6, 0) |
| 390 × 844 | (2.1, 2.7, 7.120) | (2.1, 1.6, 0) |
| 320 × 768 | (2.1, 2.7, 7.151) | (2.1, 1.6, 0) |

Explicit adjustments to the provisional measurements:

- Header height is 0.55 m: 3.4 m overall height minus 2.85 m clear opening.
  This differs from the provisional 0.35 m header and preserves the stated
  overall and opening dimensions.
- Side return width is 0.35 m: half of the 4.1 − 3.4 m width difference,
  compared with the approximate 0.3 m reference.
- Camera X and distance were adjusted to preserve the editorial column and
  fit the portal on desktop and mobile.
- The room center is X = +1 m to keep the wall boundaries outside the framing.
- Straight edges are retained; no optional bevel was added.

Standalone Mission 005A/005B planning documents were not present in the workspace.
The measurements supplied in the Mission 006B brief were used. No planning
documents were modified.

## Actual browser verification

All six viewport checks passed in the installed Chrome:

| Viewport | Result |
| --- | --- |
| 1440 × 900 | Right-side architectural composition visible; editorial content intact |
| 390 × 844 | Portal and plinth fit; existing readable mobile layout preserved |
| 320 × 768 | Portal and plinth fit; two-line heading preserved |
| 1024 × 768 | Narrow desktop framing passes |
| 801 × 900 | Desktop side of the layout breakpoint passes |
| 800 × 900 | Stacked side of the layout breakpoint passes |

Verification inspected the actual Fiber scene and camera, renderer counters,
browser console/network events, DOM layout, and screenshots.

- Exactly one Canvas rendered the seven expected meshes.
- Floor, wall, portal, recessed panel, and empty plinth were visible.
- All portal and plinth projected bounds fit inside the Canvas.
- Header, copy, gallery, and work-index rectangles matched Mission 006A's
  recorded layout within 1px at the corresponding viewports.
- No horizontal overflow or overlapping mobile sections was found.
- Gallery heights remain 429px at 390px and 360px at 320px.
- Navigation and the Explore link work. A wheel gesture over the mobile Canvas
  scrolled the page normally.
- Browser console/runtime/HTTP errors: 0.
- WebGL context errors: 0.
- Model requests: 0. External asset requests: 0. SVG placeholder requests: 0.
- The scene reports 11 draw calls per rendered frame, including its shadow pass.
- Render counters stayed unchanged during 600ms idle samples at every viewport.
  No frame callbacks or continuous animation loop are installed.
- DPR remains capped at 1.5; only one light casts shadows.

Browser verification used Chrome's ANGLE/SwiftShader WebGL renderer in an isolated
headless profile. This validates actual WebGL rendering; hardware performance
was not benchmarked.

## Screenshots

Viewport captures have the requested pixel dimensions:

- [Desktop 1440 × 900](artifacts/mission-006b/desktop-1440x900.png)
- [Mobile 390 × 844](artifacts/mission-006b/mobile-390x844.png)
- [Mobile 320 × 768](artifacts/mission-006b/mobile-320x768.png)

Full mobile page captures include the work index below the initial viewport:

- [390px full page](artifacts/mission-006b/mobile-390-full.png)
- [320px full page](artifacts/mission-006b/mobile-320-full.png)

[Browser verification data](artifacts/mission-006b/verification.json) records the
camera, mesh dimensions/materials, projected bounds, counters, warnings, and hashes.

## Commands and build

```sh
npm run typecheck
npm run build
npm run dev
node .verification/mission-006b/browser-smoke.mjs
```

TypeScript checks and the final production build passed. The build transformed
66 modules and produced:

- Editorial application: 197.01 kB, 62.00 kB gzip.
- Gallery bundle: 939.23 kB, 252.21 kB gzip.
- CSS: 3.79 kB, 1.41 kB gzip.

The build was rerun outside the sandbox after its parent-directory access
restriction blocked Vite config resolution. Port 5173 already had this
workspace's Vite server running; the existing server was verified and reused.
It serves the current blockout at http://127.0.0.1:5173/.

Checks and screenshots were repeated after source changes to lighting, shadow
compatibility, bundle loading, and architectural joins.

## Remaining visual issues and notices

No portal clipping, plinth clipping, horizontal overflow, or overlapping joins
remain in the inspected screenshots. Uniform matte surfaces, straight edges,
and provisional lighting are appropriate to this blockout. Final material,
edge, and specimen-specific lighting polish remains outside this mission.

Two non-blocking notices remain:

- The installed Fiber version constructs THREE.Clock internally. Three.js
  0.187.0 reports a deprecation warning for it once per Canvas mount. The warning
  is recorded, and installed dependencies were preserved.
- Vite reports the gallery dependency bundle above its 500 kB warning threshold.
  It is loaded separately from the editorial application. The warning threshold
  was not changed.

Instrument Sans and IBM Plex Mono assets remain unsupplied. The existing
Arial/Courier New fallbacks are preserved.

## Preserved originals and stop condition

Original files retain their SHA-256 hashes:

| File | SHA-256 |
| --- | --- |
| mission-004b.html | DD11AF3121D54397E45660C88403649D35468302C93E8015E08F7A7D7D297EC8 |
| public/models/japanese-maple.glb | 167858B8C7E4F3E51B1FC702B1C61061741D5DECFE2B14FA277457EA6E15615D |
| public/models/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend | 5C537AF924AE4068EA1945EBBAF96521B38F13BFE2482B8663DB90B98CB8C544 |

The dependency manifests, SiteHeader, HeroCopy, FeaturedWorkIndex, App, global
styles, and typography/palette tokens also retain their original hashes.
Mission 006A's report and the standalone prototype remain untouched.

The Japanese Maple is not loaded, preloaded, integrated, or transformed.
No substitute botanical tree, scene navigation, or elaborate interaction was
implemented. The plinth is empty.

Mission 006B is complete. Work stops here pending review.
