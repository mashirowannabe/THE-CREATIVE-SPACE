import { ChapterIndex, ExhibitionChapterSection as Chapter, ExhibitionFigure as Figure, GalleryReturnLink, ReadingControls, SubsectionIndex } from './ExhibitionPrimitives'
import { ExhibitionVideo } from './ExhibitionVideo'
import { sprinklerMedia as media, sprinklerVideo } from './fire-sprinkler.media'
import { projects, sprinklerMaterialSections, type ProjectId } from './projects'
import '../styles/fire-sprinkler.css'

type Props = {
  currentChapter: string
  onRepeat: (fragment: string) => void
  onReturn: () => void
  onSelect: (project: ProjectId) => void
}

export function FireSprinklerExhibition({ currentChapter, onRepeat, onReturn, onSelect }: Props) {
  const chapters = projects.blender.chapters
  return (
    <article className="project-exhibition sprinkler-exhibition" aria-labelledby={chapters[0].id}>
      <header className="project-introduction">
        <GalleryReturnLink onReturn={onReturn} />
        <div className="project-intro-grid">
          <div>
            <p className="editorial-label project-chapter-number">01 / Overview</p>
            <h2 id={chapters[0].id} tabIndex={-1}>Fire Sprinkler</h2>
            <p className="project-subtitle">Form, surface<br />and a particle experiment.</p>
          </div>
          <div className="project-intro-copy">
            <p className="editorial-label">Blender / Mechanical modeling study</p>
            <p>Original modeling by the portfolio owner from visual references, with material
              and particle-system experimentation. The exhibition follows a compact assembly
              through its silhouette, three material setups and recorded motion.</p>
            <p className="project-scope">Artistic modeling and particle study. Engineering
              dimensions, activation behavior and sprinkler performance remain unvalidated.</p>
          </div>
        </div>
        <ReadingControls />
        <Figure media={media.overview} eager />
      </header>

      <div className="project-reading-grid">
        <ChapterIndex project="blender" currentChapter={currentChapter} onRepeat={onRepeat} onReturn={onReturn} />
        <div className="project-chapters">
          <Chapter chapter={chapters[1]} number="02" title="A compact assembly around a central element">
            <p>Two angular supports frame a red glass element between gold-toned seats.
              Above, a cylinder and spaced metal tabs form the head; below, the supports
              meet a rectangular base.</p>
            <Figure media={media.assembly} />
            <dl className="sprinkler-components">
              <div><dt>Head & rim</dt><dd>A cylinder and repeated tabs establish the upper silhouette.</dd></div>
              <div><dt>Supports & base</dt><dd>The angled frame surrounds the central element and meets the block below.</dd></div>
              <div><dt>Glass & seats</dt><dd>The red element and gold-toned contacts make the central axis visible.</dd></div>
            </dl>
            <p>The source contains separate mesh objects with Bevel and Smooth by Angle
              modifiers for shape and surface treatment.</p>
          </Chapter>

          <Chapter chapter={chapters[2]} number="03" title="Three materials, with distinct surface roles">
            <SubsectionIndex sections={sprinklerMaterialSections} onRepeat={onRepeat} />
            <p>Gray metallic surfaces define the frame and head, warm brass marks the seats, and red
              glass emphasizes the center. Each setup gives the assembly a different surface role.</p>
            <Figure media={media.material} />
            <section className="sprinkler-material" aria-labelledby="sprinkler-stainless-title">
              <ReadingControls />
              <h4 id="sprinkler-stainless-title" tabIndex={-1}>Stainless — procedural surface detail</h4>
              <p>UV coordinates pass through Mapping, Noise and Bump into the normal input.
                Y mapping scale 80 and Noise scale 100 create directional surface variation;
                Bump strength is 0.05 with distance 0.001.</p>
              <Figure media={media.stainlessNodes} />
            </section>
            <section className="sprinkler-material" aria-labelledby="sprinkler-brass-title">
              <ReadingControls />
              <h4 id="sprinkler-brass-title" tabIndex={-1}>Brass — warm metallic contacts</h4>
              <p>A gold base color, metallic weight 1 and roughness 0.3 define the brass.
                The capture pairs the selected lower seat with a direct Principled BSDF
                connection to Material Output.</p>
              <Figure media={media.brass} />
            </section>
            <section className="sprinkler-material" aria-labelledby="sprinkler-glass-title">
              <ReadingControls />
              <h4 id="sprinkler-glass-title" tabIndex={-1}>Glass — a red central accent</h4>
              <p>The inspected source uses a red base color, metallic 0, roughness 0.05,
                IOR 1.45 and transmission weight 1. The capture shows the first four values;
                Transmission remains collapsed.</p>
              <Figure media={media.glass} />
            </section>
          </Chapter>

          <Chapter chapter={chapters[3]} number="04" title="Recorded motion as a particle experiment">
            <p>Object particles rise and scatter around the model while the viewing angle
              changes. Use Play to inspect the recorded motion.</p>
            <ExhibitionVideo media={sprinklerVideo} />
            <div className="project-note">
              <h4>Experiment setup</h4>
              <p>A circular emitter uses Newtonian particles rendered as Icosphere instances,
                with Collision modifiers on assembly meshes. The visualization is artistic,
                without calibrated fluid or fire simulation.</p>
              <p>Water pressure, droplet dimensions, discharge rate, coverage, thermal
                activation and fire-suppression effectiveness have not been validated.</p>
            </div>
          </Chapter>

          <Chapter chapter={chapters[4]} number="05" title="Workflow evidence and current limits">
            <p>The editable source records separate modeling, material and particle
              configurations alongside the renders, shader captures and clip.</p>
            <dl className="sprinkler-components">
              <div><dt>Modeling</dt><dd>Separate meshes; Bevel, Smooth by Angle and Collision modifiers.</dd></div>
              <div><dt>Materials</dt><dd>Principled metal/brass/glass setups; Noise-driven bump for stainless.</dd></div>
              <div><dt>Particles</dt><dd>10,000 configured particles, emission frames 1–200 and lifetime 30 frames; source cache not baked.</dd></div>
            </dl>
            <p>The Collision captures show Particle damping and friction at 0 and 0.1.
              Their target objects and chronology are unknown. Softbody & Cloth fields
              belong to a separate settings group.</p>
            <div className="sprinkler-collision-pair">
              <Figure media={media.collision} />
              <Figure media={media.collisionVariation} />
            </div>
            <div className="project-note project-limits">
              <h4>Current limits</h4>
              <p>The model was made from visual references. Original modeling credit is
                separate from reference photography, the packed lighting environment and
                Blender’s software node assets; their source and license records remain unresolved.</p>
              <p>No topology or exploded-assembly capture, toleranced CAD record or
                manufacturing validation was supplied. Shader and particle values are
                artistic configurations. The original MKV preview has browser-dependent playback.</p>
              <p>Possible next work includes assembly/topology documentation, reconciled
                reference and lighting credits, portable playback and controlled particle
                comparisons. Check the saved Smooth by Angle library path for portability before future exports.</p>
            </div>
          </Chapter>
          <footer className="project-footer">
            <GalleryReturnLink onReturn={onReturn} />
            <button className="project-link" type="button" onClick={() => onSelect('icameal')}>
              Select IcaMeal <span aria-hidden="true">↗</span>
            </button>
          </footer>
        </div>
      </div>
    </article>
  )
}
