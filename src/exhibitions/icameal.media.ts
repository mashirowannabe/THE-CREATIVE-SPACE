import shopping from '../../source-assets/icameal/screenshots/bahan.png'
import botanical from '../../source-assets/icameal/source code/assets/hero-botanical.svg?no-inline'
import budget from '../../source-assets/icameal/screenshots/anggaran.png'
import weekly from '../../source-assets/icameal/screenshots/week plan.png'
import recipes from '../../source-assets/icameal/screenshots/katalog.png'
import monthly from '../../source-assets/icameal/screenshots/monthly plan.png'
import club from '../../source-assets/icameal/screenshots/footer.png'
import type { ExhibitionMedia } from './ExhibitionPrimitives'

// Explicit presentation imports only. Original files remain unmodified.
export const icamealMedia = {
  shopping: {
    inspectionFocus: { x: .72, y: .45 },
    label: 'IcaMeal shopping checklist',
    src: shopping, width: 2527, height: 876,
    alt: 'IcaMeal shopping checklist grouped into protein, carbohydrates, vegetables and spices, with zero of 23 ingredients checked.',
    caption: 'A weekly menu becomes a grouped shopping checklist, with quantities, purchase progress and a copy-list control. This is a captured interface.',
    credit: 'Source: supplied IcaMeal screenshot. Repeated recipes can undercount ingredient quantities; see Notes.',
  },
  botanical: {
    label: 'IcaMeal botanical identity detail',
    src: botanical, width: 220, height: 56,
    alt: 'IcaMeal botanical strip detail with dark green stems, leaves and small flowers on a warm orange background.',
    caption: 'The supplied botanical detail connects the product’s culinary identity to its planning screens.',
    credit: 'Source: IcaMeal interface artwork.',
  },
  budget: {
    inspectionFocus: { x: .7, y: .52 },
    label: 'IcaMeal budget planner',
    src: budget, width: 2526, height: 1332,
    alt: 'IcaMeal budget view with a 120,000 rupiah weekly budget, four eating preferences, an 85,000 estimate and 35,000 remaining.',
    caption: 'Budget amount, slider and presets sit beside an estimated seven-menu total and remaining budget. Values describe this captured state.',
    credit: 'Source: supplied IcaMeal screenshot. A fragment of the Uchiko hero photograph is visible at the top; photographic rights remain unverified.',
  },
  weekly: {
    inspectionFocus: { x: .75, y: .45 },
    label: 'IcaMeal weekly menu',
    src: weekly, width: 2521, height: 1327,
    alt: 'IcaMeal weekly view with seven menu cards, four marked premium, and selected chicken recipe cost and macronutrients.',
    caption: 'Seven day cards lead to one selected meal. The capture shows three available cards and four premium cards, plus recipe-record nutrition and cost.',
    credit: 'Source: supplied IcaMeal screenshot. Food photographs are externally sourced; creator and license records remain unresolved.',
  },
  recipes: {
    inspectionFocus: { x: .25, y: .5 },
    label: 'IcaMeal recipe catalog',
    src: recipes, width: 2518, height: 1328,
    alt: 'IcaMeal recipe index with ten numbered rows, preparation times, price labels and a translucent chicken recipe preview.',
    caption: 'An editorial recipe list pairs names with time and price. The translucent preview is the supplied hover state; no open recipe-dialog capture was provided.',
    credit: 'Source: supplied IcaMeal screenshot. The preview contains external food photography with unverified attribution. Displayed “easy” labels do not establish a validated difficulty classifier.',
  },
  monthly: {
    inspectionFocus: { x: .4, y: .52 },
    label: 'IcaMeal monthly calendar',
    src: monthly, width: 2522, height: 1333,
    alt: 'IcaMeal 30-day menu calendar with recipe names and prices beside selected honey-roast chicken details; the page heading is partly clipped.',
    caption: 'A 30-day calendar and selected-day detail show the monthly access state. The original capture includes a partly clipped page heading.',
    credit: 'Source: supplied IcaMeal screenshot. External food photography; attribution remains unverified. The calendar cycles the catalog rather than optimizing a monthly budget or diet.',
  },
  club: {
    inspectionFocus: { x: .25, y: .45 },
    label: 'IcaMeal Good Food Club offer',
    src: club, width: 2525, height: 1008,
    alt: 'IcaMeal Good Food Club offer with a 25,000 rupiah monthly snapshot price and a join control beside a large typographic club panel.',
    caption: 'Simulated checkout. The offer illustrates access design, with a snapshot price rather than evidence of real transactions. Favorites are promised in the pictured copy but are not implemented in the supplied source.',
    credit: 'Source: supplied IcaMeal screenshot. No real payment integration or recurring billing is established.',
  },
} satisfies Record<string, ExhibitionMedia>
