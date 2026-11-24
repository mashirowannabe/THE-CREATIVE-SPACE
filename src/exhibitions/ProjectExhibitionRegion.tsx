import { IcaMealExhibition } from './IcaMealExhibition'
import { FireSprinklerExhibition } from './FireSprinklerExhibition'
import type { ProjectId } from './projects'
import { ReadingNavigationProvider } from './ExhibitionPrimitives'
import { useReadingChapter } from './useReadingChapter'
import '../styles/exhibitions.css'

type Props = {
  project: ProjectId | null
  fragment: string
  onRepeat: (fragment: string) => void
  onReturn: () => void
  onSelect: (project: ProjectId) => void
}

export function ProjectExhibitionRegion({ project, ...navigation }: Props) {
  const currentChapter = useReadingChapter(project, navigation.fragment)
  return (
    <section id="project-exhibition-region" aria-label="Project exhibitions">
      {project && <ReadingNavigationProvider value={{ project, currentChapter, ...navigation }}>
        {project === 'icameal' && <IcaMealExhibition {...navigation} currentChapter={currentChapter} />}
        {project === 'blender' && <FireSprinklerExhibition {...navigation} currentChapter={currentChapter} />}
      </ReadingNavigationProvider>}
    </section>
  )
}
