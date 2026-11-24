import brass from '../../source-assets/blender/fire-sprinkler/brass.png'
import glass from '../../source-assets/blender/fire-sprinkler/glass.png'
import collision from '../../source-assets/blender/fire-sprinkler/collision.png'
import collisionVariation from '../../source-assets/blender/fire-sprinkler/collision2.png'
import type { ExhibitionMedia } from './ExhibitionPrimitives'
import type { ExhibitionVideoMedia } from './ExhibitionVideo'

const publicRoot = `${import.meta.env.BASE_URL}projects/blender/fire-sprinkler/`

// Verified presentation records only; no source-directory glob or BLEND import.
export const sprinklerMedia = {
  overview: {
    label: 'Fire Sprinkler complete model',
    src: `${publicRoot}images/hero.png`, width: 1920, height: 1080,
    alt: 'Complete Fire Sprinkler model against black, with a tabbed metal rim, angular side supports, a red glass element and gold-toned seats above a rectangular base.',
    caption: 'The complete supplied model preview establishes the assembly’s silhouette and the contrast between metal, brass and red glass.',
    credit: 'Source: supplied Blender model preview. Original modeling by the portfolio owner from visual references.',
  },
  assembly: {
    label: 'Fire Sprinkler assembly close-up',
    src: `${publicRoot}images/assembly.png`, width: 1920, height: 1080,
    alt: 'Close view of the Fire Sprinkler’s central red glass element between gold-toned seats, framed by angular metal supports; the rim and base extend beyond the supplied frame.',
    caption: 'A closer supplied view shows how the central element, seats and side supports sit together. The original framing crops the outer rim and base.',
    credit: 'Source: supplied model detail. This is an assembled close-up, not an exploded assembly drawing.',
  },
  material: {
    inspectionFocus: { x: .5, y: .35 },
    label: 'Fire Sprinkler upper material detail',
    src: `${publicRoot}images/material.png`, width: 1920, height: 1080,
    alt: 'Close view of the Fire Sprinkler’s metallic upper cylinder and rim of rectangular tabs, with a gold-toned seat and red glass element below.',
    caption: 'The upper detail shows the gray metallic surfaces and their change in reflection across the cylinder and repeated rim tabs.',
    credit: 'Source: supplied model detail. Appearance depends on the scene’s materials and lighting; it does not establish manufactured surface accuracy.',
  },
  stainlessNodes: {
    label: 'Fire Sprinkler stainless shader graph',
    src: `${publicRoot}images/technical.png`, width: 1520, height: 567,
    alt: 'Stainless shader graph linking UV coordinates through Mapping, Noise Texture and Bump to a Principled BSDF normal input, with metallic 1 and roughness 0.2.',
    caption: 'The stainless graph stretches UV mapping on Y, feeds Noise into Bump, and connects the result to the shader’s normal input. Metallic is 1; roughness is 0.2.',
    credit: 'Source: supplied Blender shader screenshot. These are artistic shader parameters, not measured stainless-steel specifications.',
  },
  brass: {
    inspectionFocus: { x: .5, y: .75 },
    label: 'Fire Sprinkler brass shader capture',
    src: brass, width: 1695, height: 1347,
    alt: 'Blender viewport with the lower gold-toned seat selected above a brass Principled BSDF connected to Material Output, showing metallic 1 and roughness 0.3.',
    caption: 'The brass capture pairs the selected seat with a warm gold base color, metallic 1 and roughness 0.3 in a direct Principled-to-Output setup.',
    credit: 'Source: supplied Blender viewport and shader capture. The preview environment is separate from the owner’s modeling contribution.',
  },
  glass: {
    inspectionFocus: { x: .5, y: .75 },
    label: 'Fire Sprinkler glass shader capture',
    src: glass, width: 1692, height: 1357,
    alt: 'Blender viewport with the central red glass element selected above its Principled shader, showing a red base color, metallic 0, roughness 0.05 and IOR 1.45.',
    caption: 'The glass capture shows the red base color, low roughness and IOR 1.45. Transmission is collapsed in this screenshot; the inspected source has transmission weight 1.',
    credit: 'Source: supplied Blender viewport/shader capture and read-only source inspection. The settings describe a visual material study.',
  },
  collision: {
    inspectionFocus: { x: .5, y: .4 },
    label: 'Fire Sprinkler Collision settings at zero',
    src: collision, width: 395, height: 575,
    alt: 'Blender Collision panel with Particle damping and friction at zero, followed by separate Softbody and Cloth settings.',
    caption: 'This capture shows Particle damping and friction at 0. The Softbody & Cloth fields below belong to a separate settings group.',
    credit: 'Source: supplied Collision screenshot. The capture does not identify its target object or place in an iteration sequence.',
  },
  collisionVariation: {
    inspectionFocus: { x: .5, y: .4 },
    label: 'Fire Sprinkler Collision settings at 0.1',
    src: collisionVariation, width: 393, height: 542,
    alt: 'Blender Collision panel with Particle damping and friction at 0.1, followed by separate Softbody and Cloth settings.',
    caption: 'This capture shows Particle damping and friction at 0.1. It records another configuration, without establishing a tested improvement.',
    credit: 'Source: supplied Collision screenshot. No before/after chronology or physically validated result is established.',
  },
} satisfies Record<string, ExhibitionMedia>

export const sprinklerVideo: ExhibitionVideoMedia = {
  label: 'Fire Sprinkler particle experiment preview',
  src: `${publicRoot}animation/sprinkler-preview.mkv`,
  poster: sprinklerMedia.overview.src,
  width: 1920, height: 1080,
  alt: 'The supplied preview changes the viewing angle of the model while pale purple particles rise and scatter above and around its tabbed rim.',
  caption: 'Recorded particle experiment, approximately 10.4 seconds. The model’s viewing angle changes while pale purple particles rise and scatter around it. This is an experimental visualization, without physically validated sprinkler performance.',
  credit: 'Source: supplied Blender animation preview. No narration or audio track. The original MKV is preserved; native playback availability depends on the browser.',
}
