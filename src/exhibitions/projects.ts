export type ProjectId = 'icameal' | 'blender'

export type ExhibitionChapter = {
  id: string
  label: string
}

type ProjectDefinition = {
  title: string
  workControlId: string
  chapters: readonly ExhibitionChapter[]
}

// Retain the second work-control ID for existing gallery fragment links.
export const projects: Record<ProjectId, ProjectDefinition> = {
  icameal: {
    title: 'IcaMeal',
    workControlId: 'work-icameal',
    chapters: [
      { id: 'project-icameal', label: 'Overview' },
      { id: 'project-icameal-identity', label: 'Identity' },
      { id: 'project-icameal-budget', label: 'Budget & Weekly Menu' },
      { id: 'project-icameal-recipes', label: 'Recipes & Shopping' },
      { id: 'project-icameal-access', label: 'Monthly & Club' },
      { id: 'project-icameal-architecture', label: 'Architecture' },
      { id: 'project-icameal-notes', label: 'Notes' },
    ],
  },
  blender: {
    title: 'Fire Sprinkler',
    workControlId: 'work-blender',
    chapters: [
      { id: 'project-fire-sprinkler', label: 'Overview' },
      { id: 'project-fire-sprinkler-assembly', label: 'Form & Assembly' },
      { id: 'project-fire-sprinkler-materials', label: 'Material Study' },
      { id: 'project-fire-sprinkler-simulation', label: 'Simulation' },
      { id: 'project-fire-sprinkler-notes', label: 'Technical Notes' },
    ],
  },
}

export const sprinklerMaterialSections = [
  { id: 'sprinkler-stainless-title', label: 'Stainless' },
  { id: 'sprinkler-brass-title', label: 'Brass' },
  { id: 'sprinkler-glass-title', label: 'Glass' },
] as const

export function chapterForFragment(project: ProjectId, fragment: string): string | undefined {
  if (project === 'blender' && sprinklerMaterialSections.some(section => section.id === fragment)) {
    return 'project-fire-sprinkler-materials'
  }
  return projects[project].chapters.find(chapter => chapter.id === fragment)?.id
}

export function projectForFragment(fragment: string): ProjectId | null {
  for (const id of Object.keys(projects) as ProjectId[]) {
    const project = projects[id]
    if (fragment === project.workControlId || chapterForFragment(id, fragment)) {
      return id
    }
  }
  return null
}
