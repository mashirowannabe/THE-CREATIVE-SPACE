# MISSION 009A — Portfolio Experience Audit

Audited: **2026-11-24, Asia/Barnaul**. Audit only; no implementation or redesign.

## 1. Executive Summary

**The portfolio has a coherent exhibition framework, but its visitor journey is
unfinished and its mobile case studies are harder to use than their desktop versions.**
The main problems are discoverability, reading navigation, artifact legibility and
missing personal/contact information. A visual overhaul would not resolve these.

The most consequential findings are:

- **C01:** About and Contact lead to “Awaiting future content.” There is no usable
  contact destination or personal introduction.
- **C03–C05:** The chapter highlight becomes inaccurate during manual scrolling;
  entering an exhibition scrolls its first return control above the viewport;
  mobile reading loses access to the chapter index and project switch controls.
- **C06:** Original desktop captures remain intact but shrink to roughly one tenth
  of their source width at 320px. Important interface and shader details need a
  separate inspection step.
- **C02:** The intended portfolio fonts are declared but not supplied. Chrome
  actually renders Arial and Courier New, weakening the typography that carries
  much of the identity.
- **C09–C10:** Existing attribution gaps and an unspecified IcaMeal contribution
  leave the work less attributable to the portfolio owner than it should be.
- **C11–C13 / R02:** Gallery delivery and rendering remain relatively expensive.
  Offscreen idling works; the initial download and active rendering costs remain.

**No Critical application defect was confirmed.** P0 items below are completion
requirements before presenting this as a finished public portfolio, rather than
claims that the existing development experience is broken.

The production browser run recorded **98 passing checks and one confirmed
behavioral finding**, the stale chapter highlight. All six requested viewport
sizes were inspected. Normal production use produced **zero console errors,
zero HTTP errors and zero failed network requests**. The existing THREE.Clock
deprecation and Vite gallery-chunk warning remain. Separate fault tests confirmed
usable media and WebGL fallbacks.

Preserve the approved **Hybrid Exhibition — A precise gallery with living
interruptions**, its palette, portal/plinth/specimen composition, inspection
behavior, one persistent Canvas, native fragment history, both chapter sequences
and the factual boundaries of the project descriptions.

## 2. Overall Experience Assessment

### Assessment by experience layer

| Layer | Assessment | Implication |
| --- | --- | --- |
| Portfolio identity | Consistent ivory, graphite, green and terracotta; large sans headings, mono labels and restrained rules | Keep the shared system; resolve actual font delivery rather than adding another visual language |
| Opening gallery | Recognizable architectural setting and animated red specimen; work index has much less emphasis than the studio title | Preserve the installation; strengthen how visitors discover the actual projects |
| IcaMeal | Clear student-budget premise and a real interface sequence; substantial explanatory and limitation copy | A credible prototype exhibition, but it needs a clearer contribution statement and easier artifact inspection |
| Fire Sprinkler | Model silhouette, brass/red-glass accents and dark renders establish its own identity | Distinct within the same portfolio; lengthy shader documentation needs more navigable pacing |
| Reading/navigation | Chapters, focus destinations and history work; reading position and selected state diverge | Improve orientation without replacing native links or chapter IDs |
| Responsive experience | Layout reflows without application overflow; image readability and reading controls deteriorate | Treat fitting the viewport and being easy to read as separate requirements |
| Personal/contact journey | Two advertised destinations remain placeholders | The experience cannot yet complete a visitor's understanding of or contact with the owner |

The gallery and exhibitions belong to the same visual family. Fire Sprinkler's
black image backgrounds and IcaMeal's green/gold product typography are contained
within project artifacts; these differences are appropriate project identities,
not evidence of a broken portfolio palette. Consistent chapter numbering, image
frames, captions and footer controls connect both exhibitions.

The distinctive opening does not yet make the whole portfolio distinctive. The
hero says “A personal creative studio” and “Ideas take shape through design, code,
and experimentation,” but personal context is absent and project names are small.
The strongest individual work should become easier to discover and attribute.

### Evidence and method

Read the current React/TypeScript components, styles, navigation controller,
gallery lifecycle and explicit media records, plus Missions 006C, 007, 008A,
008B, 008C-A and 008C-B. Prior mission completion was background evidence, not
accepted as proof of current experience quality.

Current verification used existing dependencies and **Chrome 157.0.8103.79** on
Windows, with CDP screenshots, DOM measurements, platform-font inspection,
accessibility-tree inspection, pointer/keyboard/touch input and network/console
logging. Production was freshly built into an isolated audit directory.

Primary records:

- [Production audit and measurements](artifacts/mission-009a/production/audit-results.json).
- [Gallery measurements, fresh-document links and image fallback](artifacts/mission-009a/supplement/audit-results.json).
- [Production video/WebGL failure verification](artifacts/mission-009a/failures/audit-results.json).
- [Preservation verification: 85 of 85 baseline files unchanged](artifacts/mission-009a/integrity-after.json).
- [Reproducible audit harness](.verification/mission-009a/audit.mjs).

Mobile sizes use browser emulation, including actual emulated touch events.
Physical devices, Safari/Firefox, assistive screen-reader operation and field
Core Web Vitals were not tested. Browser-only text enlargement was checked at
320px; it is not a complete browser-zoom certification.

Intermediate harness artifacts are retained. Initial scrollbar-equality and
DOM-object-serialization checks were corrected; neither was an application
regression. The supplement completed its gallery, fresh-link and image checks,
then timed out on a video fault that did not initiate a media request. Dedicated
production fault verification subsequently exercised an actual failed media
request and WebGL failure successfully. Its interception cleanup also emitted
an audit-tool `Invalid InterceptionId` message; normal application logs remained
clean. Do not treat intermediate harness timeouts as portfolio defects.

Finding types are explicit: **C = confirmed condition/issue**, **R = measured
limitation with an unverified outcome**, **D = subjective design recommendation**.
Severity describes experience impact. Complexity estimates concern implementation
after needed content/evidence is available: Small = localized change, Medium =
coordinated component/content work, Large = asset/rendering work with broader
regression checks. No recommendation was implemented.

## 3. Detailed Findings by Audit Scope

### 3.1 Overall visual identity

#### C02 — Intended fonts are not delivered

- **Type / severity / priority / complexity:** Confirmed, inherited limitation;
  **Medium / P1 / Small**.
- **Description:** Typography uses system fallbacks rather than the named
  Instrument Sans and IBM Plex Mono families.
- **Evidence:** [tokens.css](src/styles/tokens.css:9) declares the families; no
  portfolio font imports or font files supply them. Production CDP platform-font
  inspection reports Arial for `.hero-title` and `.site-nav a`, and Courier New
  for `.editorial-label`.
- **Impact:** The experience's main identity mechanism is less distinctive and
  may have different metrics across operating systems.
- **Recommendation:** Deliver the intended fonts once their files/licensing are
  available; retain fallbacks and check heading wrapping, navigation and loading
  behavior. Do not replace the approved typography direction speculatively.

#### C14 — Functional metadata is excessively small

- **Type / severity / priority / complexity:** Confirmed sizing condition;
  **Low / P2 / Small**.
- **Description:** Gallery captions and selection/loading status use 9px text;
  other exhibition labels are generally 10–12px.
- **Evidence:** [app.css](src/styles/app.css:118), lines around `.work-selection`
  and `.gallery-load-status`; [320px gallery](artifacts/mission-009a/production/gallery-320x768.png).
- **Impact:** Labels that explain the specimen and current state are difficult
  to scan, especially on small screens, despite adequate color contrast.
- **Recommendation:** Establish a modest, legible minimum for functional labels
  while retaining the mono style and compact visual hierarchy. This is a
  readability finding, not a claim that WCAG specifies a minimum font size.

### 3.2 3D gallery experience

The desktop portal frames the specimen, the low plinth grounds it, and the cast
shadows make it part of the architecture. Hero text remains separate enough from
the specimen to read at 1440, 1024 and 900px. No object/text collision or unusable
inspection control was found at the requested sizes.

At 900px the installation is noticeably smaller within a tall, quiet stage. At
768px the composition switches to a sequential hero → installation → work index.
This is functional but changes the pacing materially; see D03. The red, faceted
canopy is a strong living interruption; its material treatment is a subjective
polish opportunity, not a geometry or asset-loading failure; see D07.

#### C11 — Offscreen exhibitions still initiate gallery delivery

- **Type / severity / priority / complexity:** Confirmed loading behavior;
  **Medium / P1 / Medium**.
- **Description:** Lazy import separates the gallery bundle, but GalleryCanvas
  mounts regardless of whether the gallery is visible. Deep-linked exhibition
  reading still requests the gallery and its model.
- **Evidence:** [GalleryViewport.tsx](src/gallery/GalleryViewport.tsx:7) renders
  the lazy Canvas unconditionally; `active` controls rendering, not mounting.
  Fresh-document exhibition requests in the supplement include
  `/models/japanese-maple.glb` even when the reading destination is below the gallery.
- **Impact:** A visitor reading a DOM case study incurs download/initialization
  costs for an offscreen installation.
- **Recommendation:** Consider deferring the first Canvas/model load until the
  gallery approaches view, using the existing placeholder, then retaining the
  same mounted instance. Preserve direct links, inspection and return behavior.

### 3.3 IcaMeal exhibition

| Chapter | Current experience | Assessment / related findings |
| --- | --- | --- |
| 01 Overview | Budget premise, frontend status, shopping checklist opener | Clear premise; return/navigation controls are outside the landing view; contribution unspecified: C04, C10 |
| 02 Identity | Palette/typography description and botanical strip | Shares the portfolio framing; thin visual proof for a whole identity chapter: D04 |
| 03 Budget & Weekly Menu | Two large original interface captures with planning explanations | Logical sequence; dense screens shrink heavily on mobile: C06 |
| 04 Recipes & Shopping | Catalog capture, shopping explanation and defect link | Avoids duplicating the opener; original translucent preview remains an evidence limitation, not a new CSS opacity bug |
| 05 Monthly & Club | Calendar, club offer and simulated-checkout note | Appropriate separation of actual interface from prototype promises; compact desktop club plate is harder to inspect: C06 |
| 06 Architecture | DOM request-flow diagram and guest/authenticated explanation | Readable diagram reflows to one column; no live backend behavior is implied |
| 07 Notes | Unresolved aggregation diagnostic and scope/credit limits | Useful honesty; some note paragraphs become much wider than normal body copy: C08; repeated caveats affect pacing: D01 |

The captured monthly heading is partly clipped in the source, and the catalog
preview is translucent in the source. The portfolio preserves image proportions
and explicitly describes both. Neither should be reported as a portfolio cropping
regression. Keep the seven chapters and the unresolved ingredient-undercount
disclosure. Fixing the original IcaMeal product is separate work.

#### C10 — IcaMeal does not establish the owner's contribution

- **Type / severity / priority / complexity:** Confirmed content gap;
  **Medium / P1 / Small**, with an owner-content dependency.
- **Description:** The exhibition explains the product and source implementation
  without saying which design/development work the owner performed.
- **Evidence:** [IcaMealExhibition.tsx](src/exhibitions/IcaMealExhibition.tsx:24)
  gives category and prototype scope, but no personal role/collaborator statement.
  Fire Sprinkler explicitly identifies original modeling by the owner.
- **Impact:** Reviewers cannot confidently attribute the IcaMeal skills or
  decisions to the person represented by this portfolio.
- **Recommendation:** Add a short, owner-confirmed contribution statement and
  relevant collaborator boundaries. Do not invent research, metrics, dates,
  authorship, commercial outcomes or personal reflections.

### 3.4 Fire Sprinkler exhibition

| Chapter | Current experience | Assessment / related findings |
| --- | --- | --- |
| 01 Overview | Full model against black and mechanical-study scope | Strong silhouette and explicit modeling credit; same hidden-return issue as IcaMeal: C04 |
| 02 Form & Assembly | Assembled close-up and three component descriptions | Explains the visible assembly; source crop is intentional evidence, not a responsive crop |
| 03 Material Study | Upper detail, stainless graph, brass capture and glass capture | Specific material evidence; long chapter and dense node/UI screenshots: C06, D05 |
| 04 Simulation | User-started clip, poster, caption and scope limits | Playback works in Chrome; no autoplay or loop; alternative-browser compatibility remains R01 |
| 05 Technical Notes | Workflow, paired Collision screenshots and limitations | Pair becomes a readable vertical sequence on mobile; iteration chronology remains unknown and is accurately disclosed |

Black presentation images distinguish this project while the surrounding type,
spacing, chapter rail and captions remain shared. Do not recolor original renders
merely to match the ivory page. Preserve the five chapters, model authorship and
the explicit distinction between an artistic particle experiment and validated
sprinkler behavior.

### 3.5 Shared exhibition reading

#### C06 — Important artifact details are too small in mobile layouts

- **Type / severity / priority / complexity:** Confirmed legibility limitation,
  inherited from full desktop captures; **High / P1 / Medium**.
- **Description:** Entire desktop screens and shader captures are reduced to a
  narrow plate. They communicate composition, but many labels/settings cannot
  be inspected comfortably inline.
- **Evidence:** At 320px the image interior is about **254px wide** after 24px
  page gutters and frame padding. A 2526px IcaMeal budget capture renders at
  roughly **10%** of its source width; at 390px it is 324px wide, roughly 13%.
  [320px budget](artifacts/mission-009a/production/project-icameal-budget-320x768.png).
  Fire Sprinkler also includes 1520px-wide node and approximately 1690px-wide
  viewport/shader captures. All full-image links remain functional.
- **Impact:** Visitors need a new tab and zoom to inspect the evidence supporting
  the narrative; on mobile captions can occupy more space than the artifact.
- **Recommendation:** Keep the originals and full-image links. Add deliberate
  detail views or focused inspection of existing evidence in a later mission,
  alongside the complete plate. Use real mobile captures only if supplied or
  explicitly authorized; never recreate interfaces as fictional evidence.

#### C08 — Reading width varies between ordinary prose and note blocks

- **Type / severity / priority / complexity:** Confirmed layout inconsistency;
  **Medium / P2 / Small**.
- **Description:** Ordinary chapter paragraphs have a 65ch cap; nested note
  paragraphs do not. Some long notes stretch across nearly the entire media column.
- **Evidence:** [exhibitions.css](src/styles/exhibitions.css:36) limits direct
  chapter paragraphs, but `.project-note` does not apply the same measure.
  [IcaMeal Notes at 1440px](artifacts/mission-009a/production/stale-current-chapter-1440x900.png)
  shows the undercount explanation spanning roughly 990px, unlike the narrower
  introduction immediately above it. Captions also use the full figure width.
- **Impact:** Reading rhythm and line length change within the same chapter,
  making already dense technical copy harder to scan.
- **Recommendation:** Apply a deliberate prose measure to nested notes and long
  captions while retaining full-width images, diagrams and genuinely useful columns.

## 4. Visual Inconsistency Report

| Confirmed difference | Evidence | Interpretation |
| --- | --- | --- |
| Named typefaces versus rendered fallback fonts | Production platform-font records | C02; actual identity delivery gap |
| Ordinary paragraph measure versus full-width notes | 65ch selector and Notes screenshot | C08; inconsistent reading measure |
| 9px gallery metadata versus larger exhibition metadata | Gallery/exhibition style rules | C14; functional label legibility needs a common minimum |
| Original IcaMeal screenshot imperfections | Media captions and original captures | Source evidence limitation; preserve truthful captions |
| Black sprinkler plates versus green/cream IcaMeal screens | Both project overview screenshots | Appropriate project distinction; no palette correction required |
| Header 5% inset versus hero/exhibition 7% inset | Desktop DOM measurements | Deliberate-looking offset; no confirmed alignment defect |
| Sticky desktop index versus static tablet/mobile index | 1000px breakpoint | Functional responsive difference with UX cost, covered by C05 |

The following are **subjective recommendations**, not confirmed defects.

#### D01 — Rebalance the story between decisions and repeated limitations

- **Type / severity / priority / complexity:** Subjective editorial recommendation;
  **Medium / P1 / Medium**.
- **Description:** Both exhibitions frequently repeat source provenance and
  unverified-behavior boundaries across prose, captions and final notes.
- **Evidence:** IcaMeal's Overview, Budget, Monthly/Club, Architecture and Notes;
  Fire Sprinkler's introduction, component prose, captions and Technical Notes.
- **Impact:** The visitor can experience the pages as inspection records before
  understanding the owner's choices and demonstrated skills.
- **Recommendation:** Give each chapter a short purpose/decision/result summary
  grounded in supplied evidence. Keep immediate material disclosures, consolidate
  repetitive wording where it preserves meaning, and retain detailed notes.
  Add personal decision-making only when the owner confirms it.

#### D02 — Featured work deserves greater emphasis in the opening

- **Type / severity / priority / complexity:** Subjective hierarchy recommendation;
  **Medium / P1 / Small**.
- **Description:** Project titles at 14px compete weakly with the 89px desktop
  studio headline and large installation.
- **Evidence:** [1440px gallery](artifacts/mission-009a/production/gallery-1440x900.png);
  the featured index is roughly 211px wide and sits near the lower-left edge.
- **Impact:** A visitor can remember the studio name and specimen without quickly
  recognizing the two substantive project exhibitions.
- **Recommendation:** Strengthen project-label hierarchy or add a concise,
  truthful project descriptor. Retain the quiet work index, both native controls
  and the approved opening composition.

#### D03 — Tablet and mobile pacing changes abruptly

- **Type / severity / priority / complexity:** Subjective composition recommendation;
  **Low / P2 / Medium**.
- **Description:** The 900px layout retains a tall, relatively sparse side-by-side
  stage; at 768px the hero, installation and featured work become a long stack.
- **Evidence:** [900px gallery](artifacts/mission-009a/production/gallery-900x900.png)
  and [768px gallery](artifacts/mission-009a/production/gallery-768x1024.png).
- **Impact:** Device orientation changes the initial emphasis and distance to work
  selection much more than the width difference suggests.
- **Recommendation:** Review stage spacing near the existing 800px breakpoint
  and the time to reach the work index. Adjust DOM spacing only after comparing
  the approved gallery framing; avoid a new layout system or unnecessary effects.

#### D04 — IcaMeal's identity chapter has limited visual support

- **Type / severity / priority / complexity:** Subjective content-presentation
  recommendation; **Low / P2 / Small**.
- **Description:** A whole identity chapter is visually represented primarily by
  a small botanical strip while the described typography lives in later screens.
- **Evidence:** [Identity chapter](artifacts/mission-009a/production/project-icameal-identity-1440x900.png).
  The original vector is 220 × 56 and its displayed frame is capped near 460px.
- **Impact:** The chapter feels lighter than the surrounding product chapters,
  and visitors must connect the typography description to other screenshots.
- **Recommendation:** Link clearly to existing budget/club typography evidence
  or use authorized details of those existing captures. Do not invent a brand
  manual, research rationale or new product visual identity.

#### D05 — Fire Sprinkler's material chapter needs internal orientation

- **Type / severity / priority / complexity:** Subjective pacing recommendation;
  **Medium / P2 / Medium**.
- **Description:** Stainless, brass and glass share one long chapter containing
  four figures and several parameter explanations.
- **Evidence:** [FireSprinklerExhibition.tsx](src/exhibitions/FireSprinklerExhibition.tsx:54);
  complete-media inspection confirms the sequence and original proportions.
- **Impact:** The five-chapter index underrepresents the distance within Material
  Study, especially when it is no longer available on mobile.
- **Recommendation:** Add understated subsection links or a local material
  summary while retaining the five approved chapters and existing fragments.
  Keep the actual shader evidence and technical notes accessible.

#### D06 — Full-image links could identify their destination more specifically

- **Type / severity / priority / complexity:** Subjective accessibility/usability
  recommendation; **Low / P2 / Small**.
- **Description:** Figures repeat “View full image (new tab)” as the link name.
- **Evidence:** [ExhibitionPrimitives.tsx](src/exhibitions/ExhibitionPrimitives.tsx:33)
  and the production accessibility tree. Surrounding captions provide context.
- **Impact:** A reader navigating a list of links has to recover figure context
  to distinguish budget, weekly menu, shader and Collision images.
- **Recommendation:** Include a concise figure identifier in each accessible
  link name, preserving the announced new tab and visible inspection affordance.
  This is not asserted to violate WCAG link-purpose requirements.

#### D07 — Specimen material polish is optional

- **Type / severity / priority / complexity:** Subjective visual recommendation;
  **Low / P3 / Medium**.
- **Description:** Red leaves show strong pale facets/specular-looking variation
  against quieter architectural surfaces.
- **Evidence:** [Desktop specimen](artifacts/mission-009a/production/gallery-1440x900.png)
  and [mobile specimen](artifacts/mission-009a/production/specimen-390x844.png);
  the existing leaf-color approximation is documented in previous missions.
- **Impact:** Depending on the intended sculptural reading, the canopy can feel
  more synthetic than the gallery's restrained material treatment.
- **Recommendation:** If later visual refinement is authorized, compare small
  lighting/material adjustments with the approved appearance. Preserve the red
  living interruption, original asset, scale, rig and animation. Do not remesh or
  replace the specimen solely to satisfy this subjective preference.

## 5. UX and Navigation Issues

#### C01 — Advertised About and Contact destinations are unfinished

- **Type / severity / priority / complexity:** Confirmed, existing placeholders;
  **High / P0 / Small**, with an owner-content dependency.
- **Description:** Both navigation destinations contain only “Awaiting future
  content.” Contact provides no contact method or action.
- **Evidence:** [EditorialSections.tsx](src/components/EditorialSections.tsx:13);
  [exhibition ending](artifacts/mission-009a/production/icameal-end-390x844.png).
  Activate About or Contact from the main navigation.
- **Impact:** Visitors reach a dead end when trying to understand or contact the
  owner. Long, detailed work exhibitions end with an unfinished impression.
- **Recommendation:** Populate the existing sections with owner-approved personal
  information and a verified contact method. Retain the anchors and layout; do
  not fabricate biographical details or contact addresses.

#### C03 — Chapter-current state does not follow ordinary reading

- **Type / severity / priority / complexity:** Confirmed behavior;
  **Medium / P1 / Medium**.
- **Description:** `aria-current="location"` reflects the fragment most recently
  activated, even after the visitor scrolls into another chapter.
- **Evidence:** Click Budget & Weekly Menu, then scroll to Notes without activating
  another chapter link. The Notes heading is visible, but the rail still
  underlines Budget & Weekly Menu. Production evidence records
  `#project-icameal-budget`, current `03Budget & Weekly Menu`, scrollY 8239.
  [Reproduction screenshot](artifacts/mission-009a/production/stale-current-chapter-1440x900.png).
  [ChapterIndex](src/exhibitions/ExhibitionPrimitives.tsx:78) derives current state
  solely from the fragment. Both projects share this implementation.
- **Impact:** Visual and accessible orientation becomes inaccurate during the
  primary reading interaction.
- **Recommendation:** Track the visible chapter separately for current-state
  presentation, without moving focus or adding browser-history entries during
  manual scrolling. Preserve explicit hash navigation, repeat activation and
  Back/Forward behavior.

#### C04 — Exhibition entry hides the first gallery-return control

- **Type / severity / priority / complexity:** Confirmed landing behavior;
  **Medium / P1 / Small**.
- **Description:** Entry scrolls to the overview H2. The preceding gallery-return
  link is entirely above the visible viewport.
- **Evidence:** Select either featured project. Production overview measurements
  place the first return link at **y = −75px, height = 44px** across the six sizes.
  At 1440px IcaMeal's chapter rail starts around y = 964px, also outside the 900px
  landing view. [Overview](artifacts/mission-009a/production/icameal-overview-1440x900.png).
- **Impact:** The entry view offers neither an obvious return nor immediate
  reading navigation; visitors must discover that scrolling upward restores a control.
- **Recommendation:** Preserve H2 focus while landing at an introduction position
  that includes its return control, or position the control beside the heading.
  Check explicit selection, repeated selection and fresh deep links together.

#### C05 — Reading controls and project switching are distant on mobile

- **Type / severity / priority / complexity:** Confirmed control availability;
  **Medium / P1 / Medium**.
- **Description:** At widths ≤1000px the index is static, above the chapters.
  Project switching is available at the distant gallery work index or exhibition
  footer. Neither remains available during the middle of a long mobile read.
- **Evidence:** [exhibitions.css](src/styles/exhibitions.css:78); select chapter 03
  at 390px and scroll further. The index is above the viewport and the footer is
  several screens away. Production exhibition heights are approximately 9,074px
  for IcaMeal and 9,792px for Fire Sprinkler at 390px.
- **Impact:** Readers must reverse-scroll, reach the end or use browser history
  to change chapter/project or return deliberately to the gallery.
- **Recommendation:** Provide compact, keyboard/touch-accessible reading controls
  or clearly reachable chapter/project links near reading destinations. Avoid
  restoring the full desktop sticky rail on a small screen; retain all native
  chapter links and unobscured content.

### Verified navigation to retain

- Gallery selection opens the correct single active article; switching removes
  the inactive article from the DOM and keyboard order.
- All twelve chapter targets focus their corresponding H2/H3 at every requested
  size. Fresh-document links were separately verified; the legacy `#work-blender`
  link still selects Fire Sprinkler. Unknown and malformed fragments do not crash.
- Chapter Back/Forward restores the right destination/focus; Back across project
  switching restores the prior article and chapter.
- Explicit gallery return preserves the article and Canvas, focuses the selected
  work button and restores the opening camera. Inspection toggles correctly;
  Escape exits inspection without discarding the reading experience.
- Hover uses terracotta; selected project/chapter states also use underline.
  Keyboard focus shows the shared green outline, including exhibition return links.

No router rewrite, automatic chapter-history churn, focus trap or removal of
existing selection/inspection behavior is justified by this audit.

## 6. Responsive Issues

Measurements below come from the production run. Desktop Chrome reserves 15px
for its scrollbar; mobile emulation uses the full requested CSS width. A desktop
document width smaller than the requested width is not horizontal overflow.

| Viewport | Composition and measured behavior | Issues / assessment |
| --- | --- | --- |
| **1440 × 900** | Gallery side by side; sticky chapter rail about 184px wide; 17px body / 34px chapter headings; chapter image interior about 983px | No application overflow. Hidden entry return C04; wide notes C08; weak featured-work hierarchy D02 |
| **1024 × 768** | 780px gallery stage; sticky rail about 125px wide; body remains 17px | Controls remain usable. Long rail labels wrap; closer to the desktop layout's comfortable lower limit. Stage extends 12px beyond viewport but does not hide work controls |
| **900 × 900** | Desktop gallery, smaller installation; static three-column chapter index; 17px body | No overflow. Sparse stage D03; reading controls scroll away C05 |
| **768 × 1024** | Stacked gallery, 480px installation; work index starts about y = 1013px; single-column exhibition; two-column index; 16px body / 27px H3 | No overflow. Work is near/beyond the first viewport; static reading controls C05 and pacing D03 |
| **390 × 844** | 48px hero; gallery starts y = 455px and is 429px tall; work index y ≈ 910px; 324px image interiors | No overflow. Small top-nav targets C07; dense captures C06; long mobile reading C05 |
| **320 × 768** | 40px hero; 360px installation; work index y ≈ 839px; Contact wraps onto a second nav row; 254px image interiors | No mobile-emulation overflow. Navigation remains operable, but targets are small C07 and capture details are especially weak C06 |

All twelve chapter destinations were checked at each size, not only the opening
page. Intrinsic image ratios are preserved (`width:100%; height:auto`), and all
seven IcaMeal images/eight Fire Sprinkler images loaded when brought into view.
The paired Collision captures become a vertical sequence on mobile. No portfolio
`object-fit` crop was found in exhibition images.

200% exhibition text reflowed at 320px without horizontal overflow. Touch swipe
over the gallery scrolled the document (sample scrollY 248 → 533); touch selection
opened IcaMeal. The Canvas does not capture pointer/touch navigation.

#### C07 — Main navigation offers small touch targets

- **Type / severity / priority / complexity:** Confirmed target dimensions;
  **Medium / P1 / Small**.
- **Description:** Main navigation links are text-sized rather than using the
  44px control sizing present in the exhibition.
- **Evidence:** At 390/320px, Work is approximately **28 × 17px**, About
  **31 × 17px**, Studies **40 × 17px**, Contact **41 × 17px**. At 320px Contact
  wraps onto a separate row with an 8px vertical gap. The hero exploration link
  is about 27px high. [320px gallery](artifacts/mission-009a/production/gallery-320x768.png).
- **Impact:** Touch targeting is less forgiving than chapter/project controls,
  and wrapped navigation increases the chance of imprecise selection.
- **Recommendation:** Enlarge interactive boxes through padding/minimum target
  dimensions while preserving compact labels and preventing header crowding.
  Do not claim an automatic WCAG 2.5.8 failure solely from these dimensions:
  that criterion includes spacing exceptions, and 44px is a stronger usability
  target rather than its universal AA threshold.

An additional desktop-style narrow-window check showed the 320px HTML minimum
can conflict with a persistent scrollbar. The required mobile-emulated 320px
layout passed; this is a boundary to verify during real browser zoom/device
testing, not evidence that the mobile page overflows.

## 7. Accessibility Findings

### Confirmed strengths and limits

The portfolio provides a main landmark, one H1, project H2s, chapter H3s,
subsection H4s, named navigation, figure captions, alt text and native controls.
The accessibility tree includes both the main navigation and the active project
chapter navigation. The first keyboard stop is the visible skip link; activation
focuses main content. Destination focus and the 2px green / 6px offset outline
were verified. Selected project/chapter states are not conveyed only by color.

Reduced motion switches smooth scrolling to `auto`; the gallery stops sway and
uses demand rendering. Video is user-started, has native controls and an accessible
name/description, and pauses offscreen. The supplied clip has no audio/narration;
the visible caption explains its motion and limitations.

Calculated solid-token contrast against ivory:

| Foreground | Contrast | Assessment for ordinary text |
| --- | ---: | --- |
| Graphite `#242520` | 13.42:1 | Passes 4.5:1 |
| Muted `#55574F` | 6.38:1 | Passes 4.5:1 |
| Green `#536348` | 5.62:1 | Passes 4.5:1 |
| Terracotta `#9A4934` | 5.41:1 | Passes 4.5:1 |
| Raised surface `#E5E1D7` | 1.13:1 | Appropriate decorative surface/rule; not suitable as essential control-boundary contrast |

These calculations apply to portfolio tokens, not every pixel inside original
screenshots or native browser media controls. Pale decorative borders are not
automatically an accessibility failure. No confirmed portfolio text-contrast
failure was found in the checked solid-color text styles.

Actionable accessibility work is covered by **C03** (inaccurate current state),
**C07** (target comfort), **C14** (small functional labels), and **D06** (link names).
These are distinct from an unperformed screen-reader certification.

The gallery Canvas is correctly excluded from keyboard control and the
accessibility tree, with a named surrounding figure. Its label “Botanical study /
Blender experiments” is terse; a future description of the actual specimen and
the owner's integration role could improve context once confirmed. This is an
optional content consideration, not a claim of a demonstrated assistive-technology
failure or permission to invent attribution.

## 8. Technical and Performance Findings

### Current checks and preserved behavior

- TypeScript application check passed using the existing compiler with `--noEmit`
  and incremental writes disabled.
- Fresh Vite production build passed into `.verification/mission-009a/build`.
  The `runner` configuration loader avoided the sandboxed default config loader's
  parent-directory read error. No configuration file was edited.
- Normal production console/runtime, HTTP and failed-request logs are clean.
  No external HTTP services were requested by the portfolio in that run.
- The existing **THREE.Clock deprecation** was observed again. It is an inherited
  dependency warning, not a newly introduced audit regression. Address through a
  compatible dependency update when justified; do not patch vendor internals.
- One Canvas remains mounted across exhibition navigation. Active gallery samples
  measured **313 draw calls, 34,854 triangles, 308 geometries and four textures**.
  Offscreen frame counters remained unchanged in demand mode; reduced-motion
  samples also stopped, with specimen animation marked not running.
- Only selected-article image elements render. The overview image loads eagerly;
  remaining figures use lazy loading/async decoding and intrinsic dimensions.
- Before deliberate playback, the MKV had **zero media requests**, consistent with
  `preload="none"`. Chrome playback reached readyState 4 and advanced currentTime;
  offscreen scrolling paused it.
- Actual failed image delivery retained the prose/caption and removed its broken
  full-image link. Actual failed video delivery retained caption/focus and removed
  the download. WebGL failure retained both exhibitions, chapter navigation and
  gallery-return focus. Deliberately induced errors are recorded separately.

#### C12 — Gallery JavaScript is still a large delivery unit

- **Type / severity / priority / complexity:** Confirmed, inherited size warning;
  **Medium / P1 / Medium**.
- **Description:** The gallery chunk exceeds Vite's 500kB warning threshold.
- **Evidence:** Current production build: **1,018.89kB / 276.31kB gzip** for
  GalleryCanvas; main application **236.60kB / 74.02kB gzip**; CSS
  **11.80kB / 3.03kB gzip**.
- **Impact:** Adds download, parse and initialization work, particularly to
  exhibition-first visits because of C11. The warning alone does not prove poor
  field loading scores.
- **Recommendation:** Prioritize initial-load timing and inspect bundled import
  costs before changing chunk boundaries. Split/defer only where measurements
  show benefit; retain one Canvas and avoid suppressing the warning as a “fix.”

#### C13 — Several presentation images are substantially oversized for mobile delivery

- **Type / severity / priority / complexity:** Confirmed asset-delivery condition;
  **Medium / P1 / Medium**.
- **Description:** The same full-resolution PNG is delivered at small and large
  widths; no responsive image candidates are supplied.
- **Evidence:** Current files/build: weekly-menu PNG **2.01MB**; brass and glass
  captures **1.57MB each**; assembly/material PNGs approximately **1.16/1.17MB**.
  These may render around 254–324px wide on phones. `ExhibitionFigure` has one
  `src` and no `srcset`/`sizes`.
- **Impact:** Avoidable transfer and decode work during reading; lazy loading
  controls timing but not the bytes of a requested image.
- **Recommendation:** In a later authorized asset-delivery mission, create
  faithful optimized/responsive derivatives while retaining originals and full-image
  inspection. Check text/shader legibility, aspect ratios and provenance; do not
  alter the source files or substitute invented visuals.

#### C09 — Existing presentation attribution remains unresolved

- **Type / severity / priority / complexity:** Confirmed documentation gap,
  inherited; **High / P0 / Medium**, dependent on source/owner records.
- **Description:** The portfolio visibly uses artifacts containing external
  photography and a gallery model whose creator/license record remains incomplete.
  Sprinkler reference/lighting provenance also remains unresolved.
- **Evidence:** IcaMeal captions disclose unresolved photo rights and two credit
  mismatches; Fire Sprinkler Notes disclose reference/HDRI/node-asset boundaries.
  Missions 008A/008B document the Maple provenance gap. The excluded standalone
  IcaMeal hero does not remove photography from the included budget/recipe screens.
- **Impact:** Public presentation cannot yet provide dependable attribution or
  clearly establish all third-party presentation permissions. This is not a
  finding that infringement occurred.
- **Recommendation:** Reconcile existing creator/source/license records and
  visible credits before final publication. Preserve original-model integration
  versus original-modeling distinctions and do not invent source credits. This
  audit does not remove, replace or publish any asset.

### Risks with unverified outcomes

#### R01 — Single MKV delivery has unverified cross-browser playback

- **Type / severity / priority / complexity:** Confirmed single-format delivery;
  compatibility outcome unverified; **Medium / P1 / Medium**.
- **Description:** One 3.93MB MKV is used, with no alternative `<source>` format.
- **Evidence:** [ExhibitionVideo.tsx](src/exhibitions/ExhibitionVideo.tsx:57) and
  the media record. Chrome playback passed. Safari, Firefox and physical mobile
  playback were not tested; current visible notes acknowledge format variability.
- **Impact:** Recorded motion may be unavailable in other browsers; this audit
  does not claim a reproduced failure there. Prose/poster/fallback reduce the cost.
- **Recommendation:** Verify actual target-browser playback, then supply an
  authorized portable derivative if needed while retaining the original MKV,
  native controls, captions and manual-play/pause behavior.

#### R02 — Active gallery cost warrants physical-device profiling

- **Type / severity / priority / complexity:** Measured rendering cost; mobile
  frame-rate/battery outcome unverified; **Medium / P1 / Large**.
- **Description:** The active installation still has hundreds of draw calls and
  a skinned-mesh-heavy specimen despite a modest triangle count.
- **Evidence:** Current supplement: 313 draw calls / 34,854 triangles / 308
  geometries / four textures. Existing asset inspection records 301 skinned
  meshes. Offscreen and reduced-motion idling passed.
- **Impact:** Potential CPU/GPU/battery pressure on weaker devices. Local
  headless frame counters are not a physical-mobile FPS or battery benchmark.
- **Recommendation:** Profile representative devices first. Only then consider
  geometry/batching or rendering optimizations that preserve bind matrices,
  skinning, appearance and animation. Keep the verified activity lifecycle,
  limited DPR and fallback behavior; do not simplify the installation speculatively.

The DOM exhibition architecture itself has no obvious redundant renderer or new
animation loop. Replacing its project registry/navigation with a larger routing
or interaction system would add complexity without addressing these findings.

## 9. Prioritized Improvement Backlog

P0 = must fix for a finished public portfolio. P1 = high-value improvement.
P2 = refinement. P3 = optional polish. This backlog recommends future work;
it does not authorize source/asset edits in Mission 009A.

| Priority | ID | Type | Recommended work | Severity | Complexity | Completion evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | C01 | Confirmed | Complete existing About and Contact destinations | High | Small | Owner-approved information and verified contact action; existing anchors work |
| P0 | C09 | Confirmed gap | Reconcile presentation provenance/credits | High | Medium | Source/creator/license records reconciled; visible attribution accurate |
| P1 | C04 | Confirmed | Keep gallery return visible at exhibition entry | Medium | Small | Selection/reselection/deep links retain H2 focus and visible return |
| P1 | C03 | Confirmed | Present the chapter actually being read | Medium | Medium | Manual scroll updates current state; focus and history do not churn |
| P1 | C05 | Confirmed | Make chapter/project/return controls reachable during mobile reading | Medium | Medium | Mid-chapter touch/keyboard navigation works at 320/390/768/900px without covering content |
| P1 | C06 | Confirmed | Improve detailed artifact inspection | High | Medium | Important existing screen/node details readable without losing original context |
| P1 | C07 | Confirmed | Enlarge top navigation touch boxes | Medium | Small | Comfortable targets at 320/390px; wrapping and focus remain usable |
| P1 | C02 | Confirmed | Deliver intended portfolio fonts | Medium | Small | Actual platform-font check uses intended families; wrapping preserved |
| P1 | C10 | Confirmed gap | Add verified IcaMeal contribution | Medium | Small | Owner/collaborator responsibilities stated without fabricated outcomes |
| P1 | C11 | Confirmed | Defer first offscreen gallery initialization | Medium | Medium | Exhibition-first visit avoids unnecessary gallery fetch until needed; subsequent Canvas stays persistent |
| P1 | C12 | Confirmed | Reduce/timing-optimize gallery bundle cost | Medium | Medium | Production transfer/initialization measurements improve; existing gallery behavior passes |
| P1 | C13 | Confirmed | Add faithful responsive presentation derivatives | Medium | Medium | Smaller mobile transfer; readable detail, original proportions/full-image links retained |
| P1 | R01 | Risk | Test target browsers and provide portable clip if needed | Medium | Medium | Target-engine playback/fallback evidence; original MKV retained |
| P1 | R02 | Risk | Profile gallery on representative hardware before optimization | Medium | Large | Device measurements establish need; any optimization preserves appearance/rig/animation |
| P1 | D01 | Subjective | Strengthen concise chapter narrative | Medium | Medium | Decisions/skills easier to scan; material disclosures and technical evidence retained |
| P1 | D02 | Subjective | Give featured project labels more emphasis | Medium | Small | Both projects are easier to discover in the approved opening |
| P2 | C08 | Confirmed | Make note/caption reading measure deliberate | Medium | Small | Prose measure consistent at 1024/1440px; media remains appropriately wide |
| P2 | C14 | Confirmed | Raise functional metadata legibility | Low | Small | Gallery labels/status readable at 320/390px without crowding |
| P2 | D03 | Subjective | Refine tablet/mobile spacing near the breakpoint | Low | Medium | Compare 900/768px pacing while preserving camera composition |
| P2 | D04 | Subjective | Connect IcaMeal identity to existing visual evidence | Low | Small | Typography/palette claims visibly linked to supplied artifacts |
| P2 | D05 | Subjective | Add local material-study orientation | Medium | Medium | Stainless/brass/glass easier to reach; five chapters/fragments retained |
| P2 | D06 | Subjective | Distinguish full-image link names | Low | Small | Link-list inspection identifies each figure and announces new tab |
| P3 | D07 | Subjective | Evaluate subtle specimen material polish | Low | Medium | Approved visual comparison; source asset, red identity and sway preserved |

### What should remain untouched

Keep the palette and Hybrid Exhibition direction; the portal/plinth/specimen
relationship; the gallery's current framing, inspection/Escape/return semantics;
one persistent Canvas and validated offscreen/reduced-motion lifecycle; both
native project controls and all twelve chapter fragments; one active exhibition;
semantic DOM reading; faithful media ratios, accurate alt/captions and full-image
inspection; user-started video and graceful failure behavior.

Keep truthful IcaMeal prototype/backend/checkout/undercount boundaries and Fire
Sprinkler's original-modeling versus artistic-particle-study boundaries. Do not
invent missing Studies/About/Contact content, project outcomes or visual evidence.
Studies currently links back to the existing specimen; expanding its content is
future owner-directed work, not a reason to remove that working destination.

### Preservation and audit completion

**No application source files, existing assets, dependency manifests, configuration,
prior mission reports or existing asset locations were modified. No dependencies
were installed.** SHA-256 verification confirms all **85 baseline application,
asset and root-document/configuration files** are unchanged.

Created this report and new audit evidence/harness/build copies under
`artifacts/mission-009a/` and `.verification/mission-009a/`. The production build
was isolated there; the existing `dist/` was not rebuilt. No deployment, redesign,
asset conversion or functionality change was performed.
