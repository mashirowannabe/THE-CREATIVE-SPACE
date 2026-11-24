import { projects, type ProjectId } from '../exhibitions/projects'

export function FeaturedWorkIndex({ selectedProject, onSelect }: {
  selectedProject: ProjectId | null
  onSelect: (project: ProjectId) => void
}) {
  return (
    <section
      className="featured-work-index"
      id="featured-work"
      aria-labelledby="featured-work-title"
      tabIndex={-1}
    >
      <span className="work-number" aria-label="Works one through two">
        01—02
      </span>
      <div>
        <h2 className="editorial-label" id="featured-work-title">
          Featured work
        </h2>
        <div className="work-titles" role="group" aria-label="Select featured work">
          <button id="work-icameal" type="button" aria-controls="project-exhibition-region"
            aria-pressed={selectedProject === 'icameal'} onClick={() => onSelect('icameal')}>IcaMeal</button>
          <span aria-hidden="true">/</span>
          <button id="work-blender" type="button" aria-controls="project-exhibition-region"
            aria-pressed={selectedProject === 'blender'}
            onClick={() => onSelect('blender')}>{projects.blender.title}</button>
        </div>
        <p className="work-selection" role="status">
          {selectedProject ? `Selected: ${projects[selectedProject].title}` : '\u00a0'}
        </p>
      </div>
    </section>
  )
}
