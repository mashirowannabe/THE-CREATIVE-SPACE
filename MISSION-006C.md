# Mission 006C — Japanese Maple Integration & Rig Validation

Completed: 2026-11-23 (Asia/Barnaul).

The original Japanese Maple is visible on the plinth, framed by the existing
portal. Its imported rig and original sway clip work. The editorial layout and
gallery architecture are preserved. Mission 006C is complete.

## Asset verification and hygiene

The 4,439,192-byte GLB loads through useGLTF at /models/japanese-maple.glb.
Draco and Meshopt decoding are disabled because the inspected asset is
uncompressed and has no external buffer or image references.

Actual imports, checked with the installed loader and in the browser:

| Property | Result |
| --- | --- |
| GLB format | v2 |
| Imported nodes, excluding the scene wrapper | 323 |
| Meshes | 301 |
| Skinned meshes | 301 |
| Skin / shared skeleton | 1 |
| Bones and inverse bind matrices | 21 each |
| Skeleton associations | All 301 meshes share the same skeleton |
| Animation clips | 1 |
| Clip name | Armature.009Action |
| Duration / tracks | 10 seconds / 63 |
| Geometry vertices / triangles | 78,743 / 29,353 |
| Model image textures | None |
| Exported environmental objects | None; materials identify 300 foliage meshes and one trunk |

The trunk's imported name is Plane182; inspection of its material and geometry
confirms it is the tree's branching trunk, not an exported floor plane.

The Blender source was moved from public/models/ into:

```text
source-assets/blender/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend
```

The move used verified workspace-contained paths and preserved bytes. Blender
5.3.0 subsequently inspected the file in background mode with auto-execution
disabled, without saving it. The final build contains only the GLB in dist/models/;
no .blend file exists anywhere in dist/.

Before and after SHA-256 values are identical:

| Asset | SHA-256 |
| --- | --- |
| Japanese Maple GLB | 167858B8C7E4F3E51B1FC702B1C61061741D5DECFE2B14FA277457EA6E15615D |
| Blender source | 5C537AF924AE4068EA1945EBBAF96521B38F13BFE2482B8663DB90B98CB8C544 |

package.json, package-lock.json, and mission-004b.html also retain their original
hashes. No dependencies were installed. Historical Mission 006A/006B reports
retain their original asset locations as records of those missions.

## Imported bounds and trunk support

Bounds were measured from actual skinned vertex positions, including imported
node matrices and skeleton transforms. Measurements confirmed Y-up orientation.

| Imported world-space quantity | X | Y | Z |
| --- | ---: | ---: | ---: |
| Minimum | -4.688936314 | 0.085672110 | -6.558388239 |
| Maximum | 7.553007856 | 12.108213077 | 9.304871382 |
| Size | 12.241944170 | 12.022540967 | 15.863259621 |

The trunk base is measured from the complete lowest ring, using the lowest 1%
of trunk height as a slice. This identifies 12 vertices. Wider slices preserve
the same ring centre; a narrower slice captured only one side of the tilted ring.

The base's X/Z centre and lowest Y are:

```text
(-0.071632437, 0.085672110, 0.271633383)
```

This uses actual trunk geometry, rather than the canopy bounding-box centre or
unverified Blender coordinates.

## Final parent transform and clearance

All scale, rotation, and placement are on one parent group. The imported scene
remains one primitive instance; individual mesh transforms, vertex groups,
armature structure, and original animation data were not edited.

```text
Uniform scale: 0.1497187661888292
Position:     (2.140668614941487, 0.2671732773462255, 0.7107247201478198)
Rotation:     (0, -1.5707963267948966, 0) radians
```

Scale is 1.8 / 12.022540966773619. The -90° yaw presents the broader natural
silhouette while reducing the canopy's reach toward the recessed back wall.
The unrotated animated bounds approached that wall; the selected orientation
provides clear depth separation and fits the opening.

Measured final static world bounds:

| Quantity | X | Y | Z |
| --- | ---: | ---: | ---: |
| Minimum | 0.747554752 | 0.280000000 | 0.008702960 |
| Maximum | 3.122582430 | 2.080000000 | 1.841551737 |
| Size | 2.375027678 | 1.800000000 | 1.832848777 |

The lowest trunk vertices contact the plinth at Y = 0.28. The ring centre is
X = 2.1, Z = 0.7. Its mean Y is 0.282939 because the original cut ring is slightly
tilted. The original animation causes only millimetre-scale base movement.

The static canopy leaves approximately 0.35 m and 0.68 m of lateral clearance,
0.77 m above its top, and 0.34 m from the recessed back plane. Its actual projected
vertices fit the Canvas at all required viewports. The camera and portal dimensions
were not redesigned.

## Animation verification

The application discovers a valid quaternion-bearing clip whose tracks resolve
inside the imported scene. It does not select a clip using a hardcoded name.

Armature.009Action plays with its original 63 tracks at 0.35 time scale, giving
a nominal 28.57-second loop. A complete wrap was observed during the production-rate
browser test, approximately 27.24 seconds after sampling an already-running action.
Bone quaternion changes confirmed actual skeletal deformation.

The mixer/action lifecycle handles React's development remount correctly:
actions are recreated after their cache is cleared, rather than reusing stale
action bindings.

Verified behavior:

- Visible gallery, visible document, allowed motion: animation advances and the
  Canvas uses continuous rendering.
- Reduced motion: the action stops, the imported static pose is restored, and
  render counters remain unchanged while idle.
- Offscreen gallery: action time and render counters pause; they resume on return.
- An actual hidden browser tab: action time and render counters pause; playback
  resumes when the tab returns.
- A live reduced-motion preference change restores static demand rendering.
- Delta is capped at 0.05 seconds to avoid a large time jump after a pause.

A hidden tab can retain a queued invalidation until it becomes visible. Counter
samples confirmed it performs no continuous rendering during that interval.

## Materials and lighting observations

The original materials were inspected first and captured in
[the untouched-material screenshot](artifacts/mission-006c/original-materials/desktop-original-materials.png).

The GLB exports white foliage with no vertex colors or image maps. Read-only
Blender inspection confirmed that its actual leaf Base Color is linked to an
Object Info Random → red ColorRamp network. That procedural color was not
represented in the GLB.

A single shared renderer material clone restores the dominant ColorRamp stop:

```text
Linear RGB: (0.3181281089782715, 0, 0.004833156242966652)
sRGB display hex: #99000F
```

Only the leaf clone's base color changes. Its physical material type, roughness,
sheen, sidedness, and other imported parameters are retained. The original trunk
material stays #3A391F. The original GLB and Blender materials remain unchanged.

The existing warm gallery lighting, tone mapping, palette, portal shadows, and
plinth shadows are preserved. No bloom, fog, post-processing, or artificial leaf
animation was added.

This constant color is a minimal compatibility fallback. It does not reproduce
the original per-object procedural color variation. Faceted geometry and the
imported sheen response remain visible.

## Performance measurements and shadow choice

Measurements came from the actual renderer, not inferred mesh counts:

| Configuration | Draw calls | Triangles | Geometries | Textures |
| --- | ---: | ---: | ---: | ---: |
| Gallery before integration | 11 | 148 | 7 | 3 |
| Maple, no Maple shadows | 312 | 29,501 | 308 | 4 |
| Maple, trunk-only shadows — final | 313 | 34,854 | 308 | 4 |
| Maple, all foliage and trunk casting | 613 | 58,854 | 308 | 4 |

The extra texture is generated for skinning; the asset has no image textures.
Only the trunk casts Maple shadows. It provides visible support and branch
shadows for one additional draw call. Full foliage casting nearly doubles calls
and produces a much heavier shadow across the architecture.

[Shadow comparison data](artifacts/mission-006c/original-materials/verification.json)
and its three comparison screenshots retain the measured alternatives.

Hardware-accelerated headless Chrome reported NVIDIA GeForce RTX 3060 through
ANGLE/D3D11. This mission's before/after measurements used that same renderer,
rather than the earlier Mission 006B SwiftShader setup.

Two-second active-animation samples:

| Emulated viewport | Observed render rate |
| --- | ---: |
| 1440 × 900 | 179.94 frames/s |
| 390 × 844 | 180.15 frames/s |
| 320 × 768 | 179.88 frames/s |

These are short headless, hardware-accelerated samples, not an interactive-device
or physical-mobile benchmark. No physical phone performance was measured.

No geometry was merged, batched, simplified, or destructively optimized.

## Browser screenshots and failure handling

- [Desktop 1440 × 900](artifacts/mission-006c/desktop-1440x900.png)
- [Mobile 390 × 844](artifacts/mission-006c/mobile-390x844.png)
- [Mobile 320 × 768](artifacts/mission-006c/mobile-320x768.png)
- [390px full page](artifacts/mission-006c/mobile-390-full.png)
- [320px full page](artifacts/mission-006c/mobile-320-full.png)

The screenshots show the measured trunk/plinth contact, canopy clearance,
original camera framing, and preserved editorial content.

Failure cases were deliberately injected and passed:

- [Blocked GLB request](artifacts/mission-006c/asset-failure-320.png): static
  architecture remains, animation idles, and navigation still works.
- [Unavailable WebGL](artifacts/mission-006c/webgl-failure-320.png): approved still
  illustration and a clear availability message remain inside the stable gallery
  footprint. The headline and navigation survive.

Normal operation produced zero console/runtime/HTTP errors, no horizontal
overflow, and no unexpected external requests. Three expected fault-injection
errors are recorded separately from normal results.

[Full browser verification](artifacts/mission-006c/verification.json) records
structure, materials, transforms, frame counts, motion lifecycle, and failures.
All assertions passed.

## Files created, modified, and moved

Created application files:

- src/gallery/JapaneseMaple.tsx
- src/gallery/maple.asset.ts
- src/gallery/GalleryErrorBoundary.tsx
- src/hooks/useGalleryActivity.ts

Modified:

- src/gallery/GalleryScene.tsx — integrates the specimen within its own suspense
  and error boundary.
- src/gallery/GalleryCanvas.tsx — visible-animation render mode and context-loss
  handling.
- src/gallery/GalleryViewport.tsx — activity signals, stable loading/failure status,
  and WebGL fallback.
- src/gallery/gallery.config.ts — display height, yaw, animation speed, leaf
  compatibility color, and shadow strategy.
- src/gallery/GalleryEnvironment.tsx — memoizes extrusion options to prevent
  geometry rebuilding on visibility changes.
- src/styles/app.css — availability/loading caption styling.
- README.md — current mission boundary, asset location, and review links.

Moved byte-for-byte:

- public/models/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend →
  source-assets/blender/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend.

Created review files include this report, the screenshots, verification.json,
asset-inspection.json, blender-inspection.json, and baseline/original-material
comparison artifacts under artifacts/mission-006c/.

Local helpers are under .verification/mission-006c/:
inspect-model.mjs, inspect-blender.py, baseline.mjs, original-materials.mjs,
and the updated browser-smoke.mjs. Chrome profiles remain ignored local artifacts.
The browser harness builds on the existing smoke checks.

## Commands and remaining risks

```sh
npm run typecheck
npm run build
node .verification/mission-006c/inspect-model.mjs
node .verification/mission-006c/baseline.mjs
node .verification/mission-006c/original-materials.mjs
node .verification/mission-006c/browser-smoke.mjs
```

Blender was run in background/factory-startup mode with --disable-autoexec and
the read-only inspection script. Source relocation used native PowerShell
Move-Item after absolute path and SHA-256 checks.

TypeScript and the final production build pass. The existing development server
serves http://127.0.0.1:5173/. The final build contains:

- Editorial bundle: 202.64 kB / 64.08 kB gzip.
- Gallery bundle: 1,017.59 kB / 275.85 kB gzip.
- CSS: 3.92 kB / 1.44 kB gzip.
- public model: 4,439,192 bytes.
- Blender source in dist/: none.

Known risks and notices:

- 313 draw calls and 301 skinned meshes can be costly on weaker mobile hardware.
  The RTX 3060 test does not establish physical-phone performance.
- The procedural leaf palette is approximated by one source-derived color.
  Original per-object variation would require a separately reviewed material bake.
- The inherited glTF sheen and faceted leaf surfaces are preserved.
- The existing THREE.Clock deprecation warning remains in Fiber.
- Vite warns that the separately loaded gallery bundle exceeds 500 kB.
- Approved font files remain unsupplied, so the existing fallbacks remain.

A separate optimization review should first profile physical phones and cold
network loading. If necessary, create a derived asset that bakes the source
palette, reduces draw calls only after validating bind matrices and skin weights,
and is compared against the preserved original for deformation and silhouette.
No such asset optimization was performed in this mission.

No project navigation, scene exploration, camera transitions, or elaborate
interactions were implemented. Work stops at Mission 006C; Mission 007 was not started.
