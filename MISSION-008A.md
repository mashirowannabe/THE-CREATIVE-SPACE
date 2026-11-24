# Mission 008A — Project Content & Asset Audit

Completed: 2026-11-23 (Asia/Barnaul). Fresh audit of the newly organized assets.

## Executive summary

IcaMeal now has substantial exhibition evidence: seven actual interface screenshots,
a documented student/anak-kos audience, and a static HTML/CSS/JavaScript application
with Supabase integration code. Its budget planner, seven-day menu, recipe index,
shopping checklist, and gated monthly calendar have source evidence. The supplied
screenshots show populated product states. This supports a case study of a working
frontend prototype; it does not establish a finished commercial service or a fully
reproducible backend. Checkout is explicitly simulated. Favorites are promised in
copy but have no implementation in this snapshot.

Two further Blender studies were found and opened: procedural foliage in
`public/projects/2 plants weird.blend` and sprinkler hardware/materials with a
particle emitter in `public/projects/fire sprikler.blend`. Neither is currently
inside `source-assets/blender/`. Both offer credible process material, but no
presentation renders or authorship documentation were supplied. Their original
creators remain unconfirmed.

Japanese Maple remains a separate imported-asset integration study. Its filename
references JSGraphics/CGTrader; ownership, license and original modeling/rigging
credit are unresolved. Existing gallery screenshots support integration work,
not a claim that the portfolio owner created the tree.

Recommended direction: use IcaMeal's actual product screens for a concise product
design/frontend case study, and prepare the plant study as the primary Blender
candidate, with the sprinkler as a supporting study. Confirm provenance and obtain
the missing Blender images before treating those studies as publication-ready.

## Workspace audit and method

Workspace root, used to resolve every relative path below:

```text
C:/Users/ayik/OneDrive/Desktop/enigma 3/porto yang beneran
```

The requested directories were enumerated recursively, including nested source
assets and SQL migrations. A targeted filename search located the two named Blender
files under `public/projects/`; this report records their actual locations.

| Requested location | Fresh result |
| --- | --- |
| `source-assets/icameal/documentation/` | One README; not empty |
| `source-assets/icameal/references/` | One Uchiko WEBP photograph; not empty |
| `source-assets/icameal/screenshots/` | Seven PNG screenshots; all visually inspected |
| `source-assets/icameal/source code/` | Five top-level files, one SVG and two nested migrations; not empty |
| `source-assets/blender/` | One Japanese Maple BLEND; no other files/subdirectories, standalone renders, references or documentation |
| `public/projects/` | The two requested BLEND files; no accompanying renders or documentation |

There are **20 physical files in this focused inventory**: 17 IcaMeal files and
three Blender sources across the two actual locations. No Figma, PSD, PDF,
wireframe export, design history, video, or mobile IcaMeal screenshot was found in
the requested source folders. The existing portfolio gallery screenshots are
additional support for the Maple integration subsection.

All seven IcaMeal PNGs and the WEBP reference were viewed. Dimensions were read
from their file headers. The SVG was inspected as source and is visible in the
hero/budget screenshots. Source, documentation, SQL, local resource references,
and the relationship between markup and handlers were inspected.

Blender 5.3.0 was located at:

```text
C:/Program Files (x86)/Steam/steamapps/common/Blender/blender.exe
```

Inspection ran with `--background --factory-startup --disable-autoexec`.
Each file was opened with
`bpy.ops.wm.open_mainfile(filepath=..., load_ui=False, use_scripts=False)`.
Only object/mesh data, modifiers, materials, image metadata, scene settings,
particle settings and text contents were read. No save, render, simulation bake,
export, extraction, conversion, or unpack operation was performed.

**Inspection limit:** the new plant and sprinkler scenes were examined through
their actual Blender data, not through a rendered/viewport image. Their final
appearance, camera framing, simulation playback and render quality remain
unverified. Packed references were identified by image datablocks and dimensions;
they were not extracted or visually viewed. No remote assets, repository, Supabase
instance, authentication flow, or payment endpoint was contacted.

JavaScript syntax checks passed for `app.js` and `supabase-client.js`.
A small isolated Node VM evaluation exercised existing pure planner/aggregation
functions with diagnostic fixtures; it made no network/database calls and wrote
no files. These diagnostics are described below, not presented as product results.

## IcaMeal content inventory

### Overview and status

The supplied documentation describes a meal-planning web app for **mahasiswa and
anak kos**: students and people living in rented rooms, planning a weekly menu
around budget and eating preferences. The tagline is “Good food, student budget.”

The verified category is digital product UI and frontend implementation.
The snapshot uses HTML5, CSS3 and vanilla JavaScript. `index.html` requests
DM Sans and Fraunces from Google Fonts and a pinned
`@supabase/supabase-js@2.119.0` browser SDK from jsDelivr. Supabase calls and a
browser publishable-key configuration are present. The supplied IcaMeal source
contains no React, Vite configuration, package.json or local Git history; the
portfolio's React/Vite stack must not be attributed to IcaMeal.

The documented repository reference is
`https://github.com/mashirowannabe/ICAMEAL`. It was not fetched or verified.
The snapshot includes frontend and incremental SQL work, not a complete runnable
backend export. A public deployment, user adoption, commercial launch, actual
transactions or validated nutrition/cost accuracy are not evidenced.

### Concept and visual direction

Screenshots and CSS establish a warm culinary editorial treatment: cream
backgrounds, dark forest green, terracotta/orange, gold, generous serif headings
with italic emphasis, restrained sans-serif controls, an oversized wordmark and
food photography. The botanical strip links the hero to the rest of the page.

The budget-first sequence and Indonesian student-oriented copy are observable
design choices. Statements about user research, usability improvement, conversion,
or the owner's personal rationale require owner material; they cannot be inferred
from an attractive interface.

The hero photograph is externally sourced from Uchiko. It is not original IcaMeal
food photography, even though it appears in an IcaMeal screenshot.

### Implemented, conditional and planned features

“Issued in source” below means the actual handler/data path exists in the supplied
code. It does not mean a live backend was exercised during this audit.

| Page/section or feature | Evidence | Classification / limit |
| --- | --- | --- |
| Branded hero and section navigation | `index.html`, CSS, `hero.png` | Implemented single-page presentation and native anchors; not separate product routes |
| Budget amount, slider and presets | `applyWeeklyBudget`, `renderBudget`, `chooseWeeklyRecipes`; `anggaran.png` | Frontend implemented; source supports totals, remaining budget and shortfall reporting |
| All / Vegan / High Protein / Super Hemat preferences | `getWeeklyRecipePool`, `applyDietPreference`, diet-chip handlers | Frontend implemented through recipe tags; persisted profile changes depend on Supabase |
| Seven-day plan and regeneration | `buildWeeklyPlanRows`, `renderPlanner`, `selectDay`, `regenerateWeeklyPlan`; `week plan.png` | Implemented; one `main` meal entry per day. Regeneration rotates selected menu ordering |
| Selected meal cost/macronutrients | `showMealDetail`; weekly/monthly screenshots | Rendering implemented; numbers come from recipe records, not verified nutritional analysis |
| Recipe index, first ten/all toggle, hover and focus preview | `renderRecipes`, `toggleAllRecipes`; `katalog.png` | Implemented frontend interactions; no dedicated text-search feature found |
| Recipe ingredients and instructions dialog | `openRecipe` queries `recipe_ingredients` and `recipe_steps` | Implemented source path; no open-dialog screenshot or live response verification supplied |
| Shopping list grouping, checking, progress and copy | `aggregateIngredients`, `renderShopping`, `loadOrCreateShoppingList`, `copyShopping`; `bahan.png` | Frontend implemented; guest changes are in memory; authenticated writes depend on database |
| Sign-up, password login, logout, profile loading and auth-session persistence | `submitAuth`, `updateHeader`, `loadProfileAndEntitlements`, browser client config | Supabase client integration implemented; server/provider settings and end-to-end success unverified |
| Good Food Club gates and product offers | `hasActiveEntitlement`, `syncEntitlementFlags`; weekly/footer screens | Frontend entitlement checks and offer UI exist; server-side authorization remains a documentation claim here |
| 30-day calendar and selected-day detail | `ensureMonthlyPlan`, `renderMonthlyCalendar`, `showMonthly`; `monthly plan.png` | Implemented source/UI state; gated by membership or monthly entitlement; persistence unverified |
| Membership, recipe-book and monthly-plan purchase controls | `purchaseProduct` invokes `demo-checkout`; setup docs and HTML demo notes | **Simulated checkout**, not a payment gateway, real transaction, or recurring billing system |
| Saved favorite recipes | Membership copy says “simpan resep favorit”; no favorite handler/table/UI found | Advertised concept only; do not list as implemented |
| Downloadable recipe book/PDF | Recipe-book product/entitlement exists; no PDF or download handler supplied | Offer/access concept, not a verified downloadable publication |
| Real payments and verified payment webhooks | Documentation says a future provider flow must replace demo checkout | Planned; absent from supplied implementation |
| Fully budget/diet-optimized monthly menu | Month generation cycles `state.recipes[index % state.recipes.length]` | Not implemented by that monthly generator; do not present the calendar as an optimized month |

### Process, highlights and reflection

Available process evidence consists of the implemented layouts, planner and
shopping logic, Supabase integration boundaries, and two dated migration files.
The first extends recipes 21–30 and temporarily references a local illustrated
atlas. The second replaces 12 recipe photo records with external photographs.
This is evidence of an implementation iteration, not proof of a full design
timeline or user-testing process.

Useful technical highlights are a deterministic seven-recipe budget search,
explicit fallback/shortfall reporting, shared ingredient grouping, different guest
and signed-in data paths, and an explicit demo purchase boundary. The case study
can discuss those decisions with their limits:

- The planner searches for seven choices with the highest total that fits the
  budget. If none fits, it uses the cheapest available choices and reports the
  shortfall; limited pools repeat recipes. It cannot guarantee every requested
  budget is achievable.
- The monthly generator is a catalog rotation; it does not apply the weekly
  budget/diet optimization to the month.
- **Confirmed diagnostic defect:** `aggregateIngredients` stores one servings
  value per recipe ID in a Map, while ingredient queries deduplicate recipe IDs.
  With the same recipe planned twice, two one-serving meals requiring 100 g each
  produced 100 g instead of 200 g in the isolated source evaluation. This affects
  repeated-recipe plans, including limited diet pools. No fix was made.
- The isolated planner fixtures returned seven entries totaling 30,000 for a
  30,000 budget; a 20,000 budget required a 28,000 minimum; a four-recipe vegan
  pool filled seven days with repeats. These are synthetic diagnostic inputs,
  not real IcaMeal savings, usage statistics, or runtime benchmarks.
- The recipe list prints “MUDAH” for all visible recipes despite the seed
  containing varying difficulty values. Use the displayed UI as evidence,
  not as a verified difficulty classifier.
- `footer.png` shows a 25,000 monthly price while static HTML starts at 19,000.
  `loadProducts` replaces displayed prices from database products. These are
  snapshot/UI prices, not commercial performance evidence.
- The setup document describes email verification/rate-limit constraints.
  Their current hosted state was not checked.
- Markup has dialog roles and the recipe preview has a focus handler, but this
  audit did not establish complete keyboard, screen-reader or mobile accessibility.
  Portfolio Mission 007 checks cannot be reused as IcaMeal accessibility results.

### Backend completeness and source gaps

Only two incremental migrations are present. There is no supplied base schema,
initial recipes 1–20 seed, complete RLS policy definitions, purchase routine,
`supabase/functions/demo-checkout/` source, or test evidence. Documentation
describes these services, but their implementation cannot be inspected here.

The client calls the expected tables for recipes, ingredients, steps, products,
profiles, plans, shopping lists and entitlements. That confirms integration work;
it does not confirm live data, policies or enforcement. There is no custom
application `localStorage` persistence for plans or premium flags; the Supabase
SDK is configured to persist its auth session.

All current local HTML/CSS resource references resolve. The earlier migration's
`assets/recipes/recipe-atlas.svg` is absent, and local copies of the remote recipe
photos are not supplied. The photo migration may supersede those atlas references
when actually applied; deployment/application of migrations was not verified.

The documentation README links to `./SUPABASE_SETUP.md`, which no longer resolves
from its new `documentation/` location. The actual setup file exists in
`source-assets/icameal/source code/`. No document or link was modified.

## Blender content inventory

### Procedural foliage — 2 plants weird.blend

Actual source: [2 plants weird.blend](<public/projects/2 plants weird.blend>).

The file opened successfully in Blender 5.3.0 and reports file version [5, 3, 31].
It contains **9 meshes, 4 empties and one 50 mm perspective camera**. The saved
scene uses Cycles, a 1920 × 1080 render setting, frames 1–250 and current frame 2.
These are settings, not an existing rendered image.

The editable base meshes total **5,917 vertices and 5,723 polygons**, before
modifier evaluation. Four slender stem meshes and several foliage/midrib meshes
occupy separate positions. Four object-offset Array modifiers use counts
**19, 68, 2 and 21**; Solidify and Subdivision appear on leaf meshes.
The data therefore describes several related foliage arrangements/tests, not
necessarily exactly two finished plants despite the filename.

The shared leaf material connects Noise, Object Info Random, green/brown
ColorRamps and Mix nodes to Base Color. Further Noise/ColorRamp nodes vary
roughness, and a Voronoi/Noise mix feeds Bump. Stem material is brown and
non-metallic with roughness around 0.6. Two midrib/material slots use cyan emission.
This offers a useful leaf repetition, shape variation and procedural shading
process story; whether the cyan accents look intentional must be reviewed visually.

A separate small leaf mesh has no material assignment. There are no light objects,
no image textures/HDRI, no animation actions, no text documentation and no linked
libraries in this file. The World shader and emission materials are available for
illumination. A camera exists,
but no beauty image is saved in the supplied files, and the Render Result image
datablock is empty.

**Portfolio value:** strongest match for the approved botanical direction and a
promising primary modeling/material study. A paired or three-quarter composition,
a close leaf/midrib detail, and one modifier/material screenshot would be useful.
The scene is a candidate, not a visually approved final exhibit.

**Provenance confidence:** high for editable geometry/material content; unknown
for authorship. Self-contained local meshes and the absence of linked libraries
do not prove that the owner modeled them. No license, creator note, tutorial
attribution or history accompanies the file.

### Sprinkler hardware — fire sprikler.blend

Actual source: [fire sprikler.blend](<public/projects/fire sprikler.blend>).

The file opened successfully in Blender 5.3.0 and reports file version [5, 2, 45].
Its **8 meshes, 3 empties, 3 lights and one 50 mm perspective camera** form a compact
mechanical assembly consistent with a fire sprinkler study. Base mesh totals are
**1,727 vertices and 1,641 polygons** before modifier/particle evaluation.

Cylinder/ring, bracket-like, bulb and deflector components sit together near the
origin. Bevel, Collision and Smooth by Angle modifiers are present. The scene uses
Eevee with 1920 × 1080 settings, frames 1–250, saved at frame 0. Two area lights
and one point light accompany a packed environment image connected to the World.

Materials have meaningful distinctions: `stainless` is gray, metallic 1,
roughness 0.2, with procedural Noise → Bump; `brass` is warm gold, metallic 1,
roughness 0.3; `glass` is red tinted, roughness 0.05, transmission 1.
The particle-instance object also uses a Glass BSDF.

A circular emitter has **10,000 Newtonian particles**, emission frames 1–200,
lifetime 30, normal factor 6, and Icosphere object instances. Collision surfaces
suggest a spray/particle experiment. This is not a Mantaflow smoke/fire domain,
and the name “fire” does not establish a fire simulation. The particle cache is
not baked; playback was not simulated or verified. `WorldAction` is the sole
listed action. Do not claim a finished spray animation from those settings.

Two packed JPEG images are attached to image-reference empties; the EXR is used
for environment lighting. They are external reference/lighting resources, not
proof of original project photography. Their authors/licenses are undocumented.
The saved external paths do not resolve, but the images are packed and available
inside the BLEND.

The `Smooth by Angle` node group has 14 nodes and is reported present by Blender.
Its stored library path points to Blender 5.2's geometry-node essentials file,
which does not resolve at that saved relative path. The inspection did not produce
a missing-library load error; review portability before a future export rather
than declaring the geometry unusable.

**Portfolio value:** good supporting hard-surface and material study, distinct from
the foliage project. Recommend a three-quarter hardware view and a close-up of
the glass bulb/brass/metal transition. Particle settings could support process
imagery after controlled playback verification, not an animation outcome claim.

**Provenance confidence:** high for the assembly, shaders and particle settings
stored in the file; unknown for original modeling authorship. The linked Blender
essentials node group is a software asset, distinct from ownership of the model.
No creator note, modeling history or source-reference attribution was found.

### Japanese Maple — separate provenance and scope

Source: `source-assets/blender/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend`.

The fresh read confirms **302 source mesh objects, one armature, 300 leaf-material
users and the action Armature.009Action**. The source uses a red Object Info Random
→ ColorRamp leaf network and a dark trunk material. No camera or light objects
are present. The only text block contains two newline characters; it provides
no authorship or licensing evidence.

The existing gallery GLB has 301 skinned meshes and a 21-bone skeleton, with its
original sway integrated in the portfolio. Source base-mesh counts and exported
glTF geometry counts describe different stages and must not be conflated.
Its source/export SHA-256 values still match the historical Mission 006C records.

The JSGraphics/CGTrader naming is a **provenance lead**, not a license grant,
purchase receipt, or proof of ownership. No evidence establishes that the owner
created the underlying mesh or rig. The existing screenshots can support a
separately captioned **import, material compatibility, placement, rendering and
interaction study**. Attribute the original asset once the creator/license is
confirmed. Do not use Maple imagery to imply original botanical modeling.

## Asset inventory with exact paths

All file sizes are exact bytes at the fresh audit snapshot. Raster dimensions are
actual pixel dimensions, not assumed screen resolutions. Screenshot sizes around
2520 px wide do not establish physical device size or capture method. Authorship
and license confidence are discussed separately from content availability.

### IcaMeal screenshots, reference and vector

| Exact path (includes filename) | Format | Bytes | Dimensions | Classification / representation | Exhibition role | Quality / provenance |
| --- | --- | ---: | --- | --- | --- | --- |
| `source-assets/icameal/references/uchiko-hero-dry-aged-duck.webp` | WEBP | 1,801,894 | 2880 × 2128 | Reference photograph; Cutout photograph of plated duck on a blue ceramic plate | Reference only | External restaurant photograph, not original project photography; no grant located. |
| `source-assets/icameal/screenshots/anggaran.png` | PNG | 238,062 | 2526 × 1332 | Exported project screenshot; Budget controls, diet chips, weekly cost/remaining-budget card | Process; detail | Strong product evidence; capture includes parts of adjacent sections and hero photo. |
| `source-assets/icameal/screenshots/bahan.png` | PNG | 97,809 | 2527 × 876 | Exported project screenshot; Categorized shopping checklist with quantities and progress | Process; detail; product thumbnail | Clear interface without food photography; some horizontal rows are clipped/scrollable. |
| `source-assets/icameal/screenshots/footer.png` | PNG | 170,684 | 2525 × 1008 | Exported project screenshot; Good Food Club membership offer and footer | Supporting detail | Shows demo product pricing, not sales results; contains unimplemented favorites promise. |
| `source-assets/icameal/screenshots/hero.png` | PNG | 1,880,845 | 2522 × 1331 | Exported project screenshot; Large green IcaMeal wordmark with plated duck and botanical band | Primary hero candidate; thumbnail | Strong art direction; plate is partly cropped; Uchiko photograph rights unresolved. |
| `source-assets/icameal/screenshots/katalog.png` | PNG | 295,067 | 2518 × 1328 | Exported project screenshot; Editorial recipe index and floating image preview | Process; detail | Preview appears translucent during a transition; useful interaction evidence, less clean as hero. |
| `source-assets/icameal/screenshots/monthly plan.png` | PNG | 636,394 | 2522 × 1333 | Exported project screenshot; Populated 30-day calendar and selected meal detail | Process; detail | Signed-in sample state; heading partly obscured by scroll position; no proof of persistence. |
| `source-assets/icameal/screenshots/week plan.png` | PNG | 2,007,119 | 2521 × 1327 | Exported project screenshot; Seven-day plan, three public cards, four locked cards, selected meal/macros | Key supporting visual; alternative hero | Strongest functional overview; food-image provenance needs review. |
| `source-assets/icameal/source code/assets/hero-botanical.svg` | SVG | 1,204 | 220 × 56 SVG units | Vector design asset; Repeating dark green stems/leaves on a tan band | Design detail; process | Project SVG source exists; individual author/rights not documented. |

### IcaMeal documentation and implementation source

| Exact path (includes filename) | Format | Bytes | Dimensions | Classification / representation | Exhibition role | Quality / provenance |
| --- | --- | ---: | --- | --- | --- | --- |
| `source-assets/icameal/documentation/README.md` | MD | 4,017 | Not applicable | Documentation; Project purpose, student audience, stack, repository reference and demo status | Process evidence; not a raster hero | Owner-supplied project documentation; claims need source/runtime distinction. |
| `source-assets/icameal/source code/app.js` | JS | 57,245 | Not applicable | Implementation source; Planner algorithms, DOM interactions and Supabase client operations | Process evidence; not a raster hero | Syntax passes; frontend logic audited; no live database/auth verification. |
| `source-assets/icameal/source code/index.html` | HTML | 14,363 | Not applicable | Implementation source; Single-page sections, dialogs, external SDK/fonts and hero image | Process evidence; not a raster hero | Real markup; marketing copy is not a feature implementation guarantee. |
| `source-assets/icameal/source code/styles.css` | CSS | 40,421 | Not applicable | Implementation/design source; Responsive culinary editorial presentation | Process evidence; not a raster hero | Actual stylesheet; mobile rules exist but no mobile project captures supplied. |
| `source-assets/icameal/source code/supabase-client.js` | JS | 670 | Not applicable | Integration source; Browser Supabase initialization | Process evidence; not a raster hero | Publishable key detected; credential values omitted from this report. |
| `source-assets/icameal/source code/SUPABASE_SETUP.md` | MD | 4,371 | Not applicable | Documentation; Auth, persistence, RLS and demo-checkout setup | Process evidence; not a raster hero | Backend design statements; full server code/policies not supplied. |
| `source-assets/icameal/source code/supabase/migrations/20261118000000_expand_recipe_catalog_and_local_atlas.sql` | SQL | 15,394 | Not applicable | Implementation/process source; Recipe 21–30 seed, ingredients/steps, temporary atlas and unit updates | Process evidence; not a raster hero | Incremental migration; references absent atlas; not a complete database schema. |
| `source-assets/icameal/source code/supabase/migrations/20261118020000_replace_recipe_atlas_with_real_photos.sql` | SQL | 4,508 | Not applicable | Implementation/process source; 12 recipe photo/source/credit updates | Process evidence; not a raster hero | Third-party photo records; two source/credit mismatches require review. |

### Blender sources

| Exact path | Format | Bytes | Content / classification | Exhibition role | Quality / provenance |
| --- | --- | ---: | --- | --- | --- |
| `public/projects/2 plants weird.blend` | BLEND | 304,095 | Editable foliage arrangement and procedural materials | Candidate source for primary hero, process and detail images | Opened read-only; final appearance and author unverified; no render supplied |
| `public/projects/fire sprikler.blend` | BLEND | 22,048,050 | Editable mechanical assembly, materials, particles and packed references | Supporting hero/detail/process candidate | Opened read-only; no finished render/baked spray verified; author and resource licenses unknown |
| `source-assets/blender/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend` | BLEND | 7,939,250 | Imported botanical source with armature/materials | Separately credited integration/process study | Modeling/rigging author and permission unresolved; not evidence of owner-created mesh |

BLEND files are editable sources, not hero image files. The two files under
`public/projects/` would normally be copied by Vite on a future build. Their
location is recorded for future asset hygiene; nothing was moved and no build
was run in this audit.

### Packed sprinkler resources

These are **embedded datablocks**, not separate supplied files. The exact locator
is the parent BLEND plus the image name below. Byte counts are packed payload
sizes and can exceed the compressed parent file's size in total.

| Parent / exact embedded image name | Format | Packed bytes | Dimensions | Saved relative file path | Classification / role / concern |
| --- | --- | ---: | --- | --- | --- |
| `public/projects/fire sprikler.blend` → `construction_yard_4k.exr` | EXR | 22,035,978 | 4096 × 2048 | `//hdri\\construction_yard_4k.exr` | Environment-lighting reference; not a hero or original model; external provenance/license unknown |
| `public/projects/fire sprikler.blend` → `WhatsApp Image 2026-10-09 at 09.40.46.jpeg` | JPEG | 224,834 | 1600 × 1061 | `//WhatsApp Image 2026-10-09 at 09.40.46.jpeg` | Attached reference image; possible process support only after source/rights review; not visually inspected |
| `public/projects/fire sprikler.blend` → `WhatsApp Image 2026-10-09 at 09.41.52.jpeg` | JPEG | 28,541 | 512 × 415 | `//WhatsApp Image 2026-10-09 at 09.41.52.jpeg` | Attached lower-resolution reference; not a hero; source/rights unknown; not visually inspected |

A `Viewer Node` datablock at 256 × 256 is present in the inspected scenes, while
Render Result is 0 × 0. These transient datablocks are not supplied completed
renders and are not promoted to exhibition assets.

### Existing Maple integration visuals and export

| Exact path | Format | Bytes | Dimensions | Representation / appropriate use | Concern |
| --- | --- | ---: | --- | --- | --- |
| `public/models/japanese-maple.glb` | GLB v2 | 4,439,192 | Not applicable | Existing rigged gallery export; integration evidence | Underlying creator/license unresolved |
| `artifacts/mission-006c/desktop-1440x900.png` | PNG | 224,471 | 1440 × 900 | Clean gallery composition; integration-subsection hero | Full portfolio UI, not a standalone original modeling render |
| `artifacts/mission-006c/original-materials/desktop-original-materials.png` | PNG | 161,718 | 1440 × 900 | White exported foliage; material-compatibility process comparison | Diagnostic state, not final leaf appearance |
| `artifacts/mission-007/desktop-inspection-1440x900.png` | PNG | 244,750 | 1440 × 900 | Closer gallery camera; detail/interaction evidence | Includes focus outline, selection UI and scrollbar |

The earlier standalone prototype/SVG botanical illustration and its screenshots
are placeholders/design references, not Blender modeling results. Earlier
blockout and fault-injection screenshots are portfolio QA evidence; they are
not additional Blender projects. They are excluded from the fresh exhibition
shortlist.

## Evidence and provenance confidence

| Material or claim | Content evidence | Provenance / publication confidence |
| --- | --- | --- |
| IcaMeal UI, source and documented student purpose | High: actual code, documentation and seven matching interface captures | Owner-supplied snapshot; specific design/code authorship, collaborators and license terms need confirmation |
| IcaMeal live database/auth/RLS/checkout enforcement | Client paths and documentation present; complete server source and live tests absent | Unverified end-to-end; do not imply launch readiness or audited security |
| Uchiko plate photograph | High external-origin confidence: HTML URL and matching local reference/image content | No reuse license or permission found; never describe as owner photography |
| Recipe photographs | Source pages and credit fields in the photo migration | Recorded credit is not verified permission; two records appear inconsistent |
| Plant study geometry/materials | High: opened file, objects, modifiers and connected shaders | Author unknown; no original-work claim until clarified |
| Sprinkler assembly/materials/particle settings | High: opened file and settings | Author unknown; packed photo/HDRI origins undocumented |
| Japanese Maple mesh and rig | High for source content and existing integration | Separate imported/uncertain provenance; owner modeling/rigging unsupported |

The recipe-photo migration records Pexels and Wikimedia/Creative Commons sources,
but no remote source/license pages were visited. In particular:

- `ayam-kecap` uses a Wikimedia Commons image/source URL while its credit says
  “Tamba Budiarsana — Pexels Free License.”
- `sayur-lodeh` uses a Pexels image/source URL while its credit says
  “Gunawan Kartapranata — CC BY-SA 4.0.”

These are apparent metadata mismatches to resolve, not verified accusations about
a specific photographer. The other ten records likewise need source/license
confirmation before publication; attribution strings alone are not proof.
No local license file was supplied with IcaMeal, the two Blender studies or Maple.

## Recommended hero images and exhibition structure

### IcaMeal

**Primary visual candidate:** [hero.png](source-assets/icameal/screenshots/hero.png)
for the visual-direction opener, subject to clearing the Uchiko photograph.
**Key functional support:** [week plan.png](<source-assets/icameal/screenshots/week plan.png>).
If the external hero photo remains unresolved, the shopping-list capture
[bahan.png](source-assets/icameal/screenshots/bahan.png) offers a product-focused
opener without that food photograph. Do not replace the missing permission with
a claim that the source image is original.

Recommended concise narrative:

1. **Purpose and scope:** student budget planning, UI/frontend prototype, owner role
   once confirmed; explicit simulated purchases.
2. **Visual direction:** hero/typography/botanical strip; separate external food art
   from interface design.
3. **Core product sequence:** `anggaran.png` → `week plan.png` →
   `katalog.png` / recipe detail → `bahan.png`.
4. **Implementation decisions:** budget search, guest versus authenticated data,
   ingredient grouping and Supabase boundary.
5. **Explored access model:** `monthly plan.png` and `footer.png`, with
   “demo checkout” stated plainly.
6. **Reflection:** missing backend export, repeated-recipe aggregation defect,
   month-generator limits, attribution cleanup and future real-payment work.

The documented overview, design direction, screenshot sequence, implemented
frontend decisions and honest limits can be prepared for Mission 008B now.
A research/process timeline, owner-specific reflection, live authentication/
persistence claims and real-payment outcomes require additional evidence.
Do not invent those sections to fill a case-study template.

### Blender

**Primary candidate:** procedural foliage from
`public/projects/2 plants weird.blend`.
**Recommended hero image:** a future approved three-quarter/pair arrangement image
from that source, with the full silhouettes visible. No such image exists in the
audited folders, so there is no publication-ready original-modeling hero yet.
No render or screenshot was generated in this mission.

Use the sprinkler as a second study within the single featured **Blender** project,
not as a third featured project. Obtain a compact three-quarter hardware image
and one close material detail before selecting its final presentation.

Recommended concise narrative:

1. **Studies overview:** confirmed owner contributions and purpose; hold original
   modeling claims until provenance is resolved.
2. **Foliage study:** base leaf/stem construction, Array/Solidify/Subdivision,
   material variation and close-up process.
3. **Mechanical study:** sprinkler component construction, metal/glass material
   contrast and lighting/reference setup.
4. **Experiment:** the configured particle spray, only if playback evidence is
   later available.
5. **Separate integration note:** credited Japanese Maple import, compatibility,
   placement and interaction; no owner mesh/rig credit inferred.
6. **Reflection:** specific owner lessons, unfinished work and next experiments,
   once documented.

File contents support process notes now. Final hero/detail selection, visual
quality assessment, authorship captions and any spray-animation result need
additional material. The existing Maple gallery screenshot may be used only for
the separate integration subsection after provenance review.

## Missing materials and unresolved questions

| Missing material / clarification | Priority | Why / useful format or angle |
| --- | --- | --- |
| Owner roles, collaborators and contribution scope for IcaMeal, foliage and sprinkler | Essential before personal authorship claims | Brief text identifying what was designed/modeled/coded, what was imported, and any tutorial/reference use |
| Uchiko hero-photo permission or a different already authorized visual | Essential if publishing that hero | Original source/license or permission record; otherwise choose a product screen without the photograph |
| Recipe-photo attribution reconciliation, especially the two mismatches | Essential for included third-party photos | Source page, creator, applicable license and any required caption; do not just repeat inconsistent SQL strings |
| Foliage and sprinkler presentation images | Essential to their visual exhibitions | Existing owner-supplied PNG/JPEG beauty views, ideally 1600–2400 px wide; whole plant silhouettes and three-quarter hardware view |
| Maple source/creator/license confirmation | Essential if publishing its study | Creator/source page and actual grant/receipt if applicable; explicit owner integration role |
| Full Supabase base migrations/RLS/purchase routine and demo-checkout source, or limited authorized test evidence | Essential only for backend/security/persistence claims or a reproducible demo | Source snapshot or concise recorded verification using test data; not needed to explain existing frontend source |
| One open recipe-detail capture and one mobile IcaMeal capture | Optional, useful | Ingredients/steps dialog; narrow layout showing planner/shopping readability |
| A clean monthly or catalog capture | Optional | Avoid the clipped monthly heading and transient translucent hover preview |
| Foliage modifier/material and sprinkler topology/material process images | Optional for overview; needed for detailed process claims | One focused viewport/wireframe and one shader/modifier view per selected study |
| Packed sprinkler reference/HDRI source attribution | Essential if reproducing references/claiming asset ownership; review for final render use | Source/license notes; photographs remain references |
| Verified spray playback and portable node-library setup | Optional, only if exhibiting animation/process | Short owner-supplied video or frame sequence and dependency notes; no bake/run performed here |
| Design stages, owner rationale and reflection | Optional | Short notes plus any existing wireframe/iteration; no invented user research or outcomes |
| Recipe atlas / complete initial catalog source | Optional if photo migration supersedes it; required for an offline historical demo | Missing `assets/recipes/recipe-atlas.svg` and initial data only when that version is deliberately exhibited |

Questions still unresolved: who created the two Blender models and the IcaMeal
design/code; which external images are cleared for publication; what exact
Supabase/backend state is demonstrably working; whether plant/sprinkler beauty
or process images already exist elsewhere; and the Maple creator/license.
The two named Blender files themselves are located and inspected, so their paths
are no longer an unresolved question.

## Recommended next steps for Mission 008B

1. Confirm contribution/provenance captions and select the IcaMeal opener based
   on actual image permissions. Keep the featured labels IcaMeal and Blender.
2. Assemble a concise IcaMeal content set from the seven current screenshots,
   documented audience, confirmed frontend features, demo status and known limits.
   Fix/re-verify repeated-recipe aggregation in its own authorized implementation
   work before describing shopping totals as reliable.
3. Obtain the two Blender presentation images and minimal contribution notes.
   Use the plant study as the preferred lead if its visual review supports that
   choice, and the sprinkler as a supporting study.
4. Keep Maple integration credit separate. Review packed reference/HDRI sources
   and the saved Blender node-library path before any later export.
5. Decide whether Mission 008B presents a source-backed frontend prototype or a
   separately verified live demo; backend completeness should match the claims.
6. Only in a separately authorized implementation mission, prepare approved
   presentation derivatives, settle public/source asset placement, and build the
   exhibitions around the existing editorial layout and accessible interactions.

No Mission 008B implementation began.

## Preservation and verification

Only this report was created. No React component, CSS, navigation, source asset,
license record, previous report, screenshot, model, or configuration was changed.
No dependencies were installed, files moved/renamed/deleted, images downloaded/
generated, Blender resources unpacked, or source files converted.

The three Blender files retained identical before/after SHA-256 values:

| Exact file | SHA-256 |
| --- | --- |
| `source-assets/blender/Japanese+Maple-Tree_Pack+JSGraphics_CGTrader.blend` | `5C537AF924AE4068EA1945EBBAF96521B38F13BFE2482B8663DB90B98CB8C544` |
| `public/projects/2 plants weird.blend` | `ED5E9B21DC3B9E14F8631C24BADAEF9A92F02BEAC13762E5A6C8F45BC08C6F75` |
| `public/projects/fire sprikler.blend` | `3FF753866E3BB81BCE3ED35EDB64F33C93439743969A799686E23855D16B5C56` |

A before/after SHA-256 check covers the existing 120 workspace files outside
dependencies and browser-profile directories. Existing source/assets and review
artifacts are unchanged. JavaScript syntax checks passed and isolated source diagnostics completed;
the repeated-recipe diagnostic identified the documented defect. Previous gallery
browser/build results were read as historical evidence, not rerun or claimed as
new IcaMeal/Blender verification.

