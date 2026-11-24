# The Creative Space

Vite, React, TypeScript, Three.js, React Three Fiber, Drei, and plain CSS.
Mission 007 adds section navigation, project selection, and specimen inspection
to the preserved Japanese Maple gallery.

## Run

Use Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

Development: http://127.0.0.1:5173/. Production preview:
http://127.0.0.1:4173/. Both use strict ports.

## Structure

- src/components/: the preserved SiteHeader, HeroCopy, and FeaturedWorkIndex.
- src/gallery/: architecture, renderer/camera, JapaneseMaple, asset measurements,
  lighting, and failure boundaries.
- src/hooks/: gallery visibility, document visibility, and motion preferences.
- src/styles/: approved palette, typography, and responsive layout.
- public/models/japanese-maple.glb: original model, served at
  /models/japanese-maple.glb.
- source-assets/blender/: the unchanged Blender source, kept outside public assets.

The desktop composition follows mission-004b.html. At 800px and below, the
editorial content, gallery, and work index stack vertically. The gallery keeps
its defined footprint while loading and during failures. Work and Explore target
the existing work index. Studies, About, and Contact target restrained sections
below the opening composition. About and Contact explicitly await future content.

## Current mission boundary

The architecture contains a 10 × 8 m floor, 10 × 3.8 m wall, and recessed portal.
The 1 × 0.9 × 0.28 m plinth supports the measured trunk base of a 1.8 m Maple.
The portal opening remains 3.4 × 2.85 m inside a 4.1 × 3.4 m surround.

JapaneseMaple uses one original scene with 301 skinned meshes and a shared
21-bone skeleton. A parent group handles uniform scale, orientation, and position.
The validated 10-second clip plays at 0.35 speed. Rendering runs continuously
only while the loaded specimen is visible, the document is visible, and motion
is permitted. Reduced motion restores a static pose. Otherwise the Canvas idles
with demand rendering.

The DOM inspection button gently moves the existing camera closer over 800 ms;
Return or Escape restores the initial camera. Reduced motion applies the camera
state immediately. Camera transitions reuse Fiber frames and invalidation, pause
with gallery activity, and stop requesting frames at their endpoint. IcaMeal and
Blender are accessible selection buttons; project exhibitions remain future work.

Blender's procedural red leaf ColorRamp was absent from the GLB. One shared
renderer material clone restores its dominant color; the original files, trunk
material, armature, and animation data remain unchanged. Only the trunk casts
Maple shadows, based on the recorded cost comparison. DPR is capped at 1.5 and
the existing 1024px PCF shadow map remains.

Asset loading failures retain the static architecture. WebGL failures show the
approved still illustration. Both preserve editorial content and navigation.

Instrument Sans and IBM Plex Mono assets remain unsupplied; the approved Arial
and Courier New fallbacks stay in use. Mission 006A/006B reports remain unchanged
historical records.

## Review artifacts

[Mission 007 report](MISSION-007.md) records interactions, changed files,
accessibility checks, responsive verification, and remaining limits.

- [Default desktop](artifacts/mission-007/desktop-1440x900.png)
- [Desktop inspection](artifacts/mission-007/desktop-inspection-1440x900.png)
- [390px complete page](artifacts/mission-007/mobile-390-full.png)
- [320px complete page](artifacts/mission-007/mobile-320-full.png)
- [About and Contact](artifacts/mission-007/about-contact-placeholders.png)
- [Browser verification](artifacts/mission-007/verification.json)

Run the updated smoke checks with `node .verification/mission-007/browser-smoke.mjs`
while the development server is running.

[Mission 006C report](MISSION-006C.md) contains the measurements, asset checks,
motion verification, performance results, changed files, and remaining risks.

- [Desktop 1440 × 900](artifacts/mission-006c/desktop-1440x900.png)
- [Mobile 390 × 844](artifacts/mission-006c/mobile-390x844.png)
- [Mobile 320 × 768](artifacts/mission-006c/mobile-320x768.png)
- [Full mobile page at 390px](artifacts/mission-006c/mobile-390-full.png)
- [Full mobile page at 320px](artifacts/mission-006c/mobile-320-full.png)
- [Browser verification](artifacts/mission-006c/verification.json)
- [Original materials and shadow comparison](artifacts/mission-006c/original-materials/verification.json)

Work stops at Mission 007. Mission 008 has not started.
