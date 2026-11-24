# Mission 006A — Application Bootstrap

Completed: 2026-11-23 (Asia/Barnaul).

The Vite + React + TypeScript application is initialized directly in the existing
workspace. The DOM shell follows the approved Hybrid Exhibition reference, with
the original copy, warm ivory palette, editorial typography, architectural portal,
and botanical specimen. Mission 006A is complete; full 3D hero implementation
awaits review.

## Created application files

```text
.gitignore
index.html
package.json
package-lock.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
README.md
MISSION-006A.md
src/
  App.tsx
  main.tsx
  vite-env.d.ts
  components/
    SiteHeader.tsx
    HeroCopy.tsx
    FeaturedWorkIndex.tsx
  gallery/
    GalleryViewport.tsx
    GalleryPlaceholder.tsx
    gallery-placeholder.svg
    GalleryCanvas.tsx
    GalleryScene.tsx
    gallery.config.ts
  hooks/                         (reserved empty directory)
  styles/
    tokens.css
    global.css
    app.css
```

Generated directories: node_modules/, dist/, and .verification/. These are ignored
by the new root .gitignore. Local verification artifacts include browser-smoke.mjs,
results.json, reference-desktop.png, application-1440.png, application-390.png,
application-320.png, and isolated Chrome test profiles.

No nested application directory was created. Existing files and assets were
preserved. The placeholder SVG was extracted from mission-004b.html; its content
matches the original SVG after normalizing line endings.

## Installed dependencies

Direct versions are pinned in package.json; package-lock.json records the resolved
dependency tree.

| Dependency | Version | Purpose |
| --- | --- | --- |
| react | 19.2.9 | Application UI |
| react-dom | 19.2.9 | DOM renderer |
| three | 0.187.0 | Future 3D renderer |
| @react-three/fiber | 9.8.2 | React scene foundation |
| @react-three/drei | 10.7.9 | Future scene helpers |
| vite | 7.3.8 | Development and build |
| @vitejs/plugin-react | 5.2.0 | React integration and refresh |
| typescript | 5.9.3 | Type checking |
| @types/node | 22.20.5 | Build configuration types |
| @types/react | 19.2.18 | React types |
| @types/react-dom | 19.2.7 | DOM renderer types |
| @types/three | 0.187.0 | Three.js types |

Verified on Node.js 22.21.0 and npm 10.9.4. Registry engine and peer requirements
were checked before installation. Installation added 133 packages, audited 134,
and reported zero vulnerabilities. npm ls --depth=0 passed without dependency
conflicts. Direct runtime dependencies are limited to the approved stack.

## Commands executed

Project setup and verification:

```sh
node --version
npm --version
npm install --no-fund
npm ls --depth=0
npm run typecheck
npm run build
npm run dev
npm run preview
node .verification/browser-smoke.mjs
```

npm view registry queries checked versions, engines, and peer dependencies for
Vite 7, React 19.2, React DOM 19.2, Three.js, Fiber 9, Drei 10, the React Vite
plugin 5, TypeScript 5.9, and the matching type packages. Queries used
--json --fetch-retries=0 --fetch-timeout=15000.

Read-only workspace inspection used rg --files, Get-Content, Get-ChildItem,
Get-FileHash, and Get-NetTCPConnection. New files and the two verified fixes were
written with guarded PowerShell file operations.

The production build and browser checks were repeated after correcting the
320px heading wrap and the application favicon request.

## Verification results

- Development server: http://127.0.0.1:5173/.
- Production preview: http://127.0.0.1:4173/.
- Both applications loaded and rendered successfully in the installed Chrome.
- TypeScript checks passed, including the unmounted future gallery components.
- Production build passed: 37 modules, JavaScript 199.73 kB (62.87 kB gzip),
  CSS 3.43 kB (1.32 kB gzip).
- Ten viewport checks passed: development at 1440x900, 1024x768, 801x900,
  800x900, 768x1024, 390x844, and 320x768; production at 1440x900,
  390x844, and 320x768.
- The approved heading remains two lines at every checked width. No horizontal
  overflow or overlapping mobile sections was found.
- The gallery has a fixed desktop footprint and a 360–480px mobile height.
- Section navigation and the Explore link work.
- Application browser checks reported zero runtime, console, or HTTP errors.
- The desktop application screenshot was visually compared with the reference.
- No Canvas is mounted and no GLB request is made by the application.
- /models/japanese-maple.glb returned HTTP 200 and model/gltf-binary from both
  servers. Each response contained the original 4,439,192 bytes, with a valid
  GLB v2 header and the original SHA-256 hash.

The browser smoke check uses Node.js built-ins and the installed Chrome.
No browser-testing library was added to the project.

## Preserved originals

SHA-256 hashes before and after implementation are identical:

| Original file | SHA-256 |
| --- | --- |
| mission-004b.html | DD11AF3121D54397E45660C88403649D35468302C93E8015E08F7A7D7D297EC8 |
| public/models/japanese-maple.glb | 167858B8C7E4F3E51B1FC702B1C61061741D5DECFE2B14FA277457EA6E15615D |
| public/models/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend | 5C537AF924AE4068EA1945EBBAF96521B38F13BFE2482B8663DB90B98CB8C544 |

Vite's standard public-directory copy also includes the existing Blender source
in dist/models/; the source file itself remains unchanged.

## Review notes

Instrument Sans and IBM Plex Mono font assets have not been supplied. The
application retains the reference's Arial and Courier New fallbacks.

About and Contact remain the prototype's text-only navigation labels until actual
destinations and content are supplied. Featured-work names are the reference's
IcaMeal and Blender; no project descriptions or projects were invented.

GalleryCanvas provides the Fiber renderer, a Drei perspective camera, capped
pixel ratio, demand rendering, and Three.js color/tone settings. GalleryScene is
an empty group. Camera values are provisional scaffold settings. The model is
not loaded, preloaded, integrated, or transformed, and there are no scene
interactions.

The two browser findings were resolved. There are no remaining blocking issues.
Work stops at Mission 006A.
