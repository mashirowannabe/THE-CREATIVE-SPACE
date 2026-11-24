import { ChapterIndex, ExhibitionChapterSection as Chapter, ExhibitionFigure as Figure, GalleryReturnLink, ReadingControls } from './ExhibitionPrimitives'
import { icamealMedia as media } from './icameal.media'
import { projects, type ProjectId } from './projects'

type Props = {
  currentChapter: string
  onRepeat: (fragment: string) => void
  onReturn: () => void
  onSelect: (project: ProjectId) => void
}

export function IcaMealExhibition({ currentChapter, onRepeat, onReturn, onSelect }: Props) {
  const chapters = projects.icameal.chapters
  return (
    <article className="project-exhibition" aria-labelledby="project-icameal">
      <header className="project-introduction">
        <GalleryReturnLink onReturn={onReturn} />
        <div className="project-intro-grid">
          <div>
            <p className="editorial-label project-chapter-number">01 / Overview</p>
            <h2 id="project-icameal" tabIndex={-1}>IcaMeal</h2>
            <p className="project-subtitle">A week of meals,<br />starting with a budget.</p>
          </div>
          <div className="project-intro-copy">
            <p className="editorial-label">Digital product / Frontend prototype</p>
            <p>IcaMeal is a frontend prototype for students and people living in rented rooms
              who plan a week of meals around a budget and eating preferences.</p>
            <p>A budget leads to seven main meals, recipes and a grouped shopping checklist.
              The exhibition follows that sequence through the captured interface.</p>
            <p className="project-scope">Hosted backend unverified. Checkout is simulated.</p>
            <p className="project-tagline">“Good food, student budget.”</p>
          </div>
        </div>
        <ReadingControls />
        <Figure media={media.shopping} eager />
      </header>

      <div className="project-reading-grid">
        <ChapterIndex project="icameal" currentChapter={currentChapter} onRepeat={onRepeat} onReturn={onReturn} />
        <div className="project-chapters">
          <Chapter chapter={chapters[1]} number="02" title="A culinary editorial identity">
            <p>Cream, forest green, terracotta and gold carry through the planning screens.
              Fraunces headings and italic emphasis sit beside DM Sans controls. The club
              lettering and budget panel below show that contrast in the existing interface.</p>
            <div className="project-identity-grid">
              <Figure media={media.club} preview={{
                window: { left: 0, top: 0, width: 1262, height: 868 },
                label: 'IcaMeal club capture (typography detail)',
                alt: 'Detail of the oversized cream Good Food Club lettering on the original terracotta club panel.',
                caption: 'Typography in use: oversized Fraunces lettering on terracotta. A detail from the supplied club capture.',
                credit: 'Existing interface detail. Inspect to see the complete original offer and its prototype limitations.',
              }} />
              <Figure media={media.budget} preview={{
                window: { left: 1384, top: 530, width: 987, height: 519 },
                label: 'IcaMeal budget capture (palette detail)',
                alt: 'Detail of the original forest-green budget summary with a gold 85,000 rupiah estimate, terracotta meter and light text.',
                caption: 'Palette in use: the forest-green summary pairs a gold estimate with a terracotta budget meter. A detail from the supplied budget capture.',
                credit: 'Existing interface detail. Values describe the captured state; the complete original retains its source and photographic-rights notes.',
              }} />
            </div>
            <Figure media={media.botanical} detail />
            <p>The original interface also includes this botanical strip. The complete
              <a className="project-inline-link" href="#project-icameal-budget"> budget sequence</a> and
              <a className="project-inline-link" href="#project-icameal-access"> club offer</a> follow below.
              Food photography is externally sourced, separate from the interface design.</p>
          </Chapter>

          <Chapter chapter={chapters[2]} number="03" title="From an amount to seven meals">
            <p>A budget input, slider and presets set the amount. Four recipe-tag preferences
              narrow the search: All, Vegan, High Protein and Super Hemat. With enough
              recipes, the planner chooses seven entries with the highest total within the budget.</p>
            <Figure media={media.budget} />
            <p>When the recipe pool cannot meet the amount, the planner uses its cheapest
              options and reports a shortfall. Small pools repeat meals. Costs are
              recipe-record estimates; affordability is not guaranteed.</p>
            <Figure media={media.weekly} />
            <p>Each day has one main meal. Selecting it reveals cost and macronutrients;
              regenerating the week rotates the menu order. The recorded nutrition values
              have no medical or nutritional validation.</p>
          </Chapter>

          <Chapter chapter={chapters[3]} number="04" title="Recipes become a shopping checklist">
            <p>Ten recipes open the catalog, with an option to reveal all. In the product,
              hover or keyboard focus can expose a preview; the recipe dialog requests
              ingredients and cooking steps. The capture below records the preview state.</p>
            <Figure media={media.recipes} />
            <div className="project-note">
              <h4>One list for the week</h4>
              <p>The <a className="project-inline-link" href="#project-icameal">opening shopping screen</a>
                {' '}groups ingredients by category, shows purchase progress and offers a copy
                control. Guest checks live in memory; signed-in updates call the database.</p>
              <p><a className="project-inline-link" href="#project-icameal-notes">
                Repeated recipes can undercount ingredients in the current prototype.</a></p>
            </div>
          </Chapter>

          <Chapter chapter={chapters[4]} number="05" title="A month of ideas, with an access boundary">
            <p>A membership or monthly-plan entitlement gates the 30-day calendar in the
              frontend. Its generator cycles the recipe catalog; it does not optimize
              a whole month around the weekly budget or eating preferences.</p>
            <Figure media={media.monthly} />
            <div className="project-offer-layout">
              <Figure media={media.club} />
              <div className="project-note">
                <h4>Simulated checkout</h4>
                <p>Checkout controls request a demo function. No real payments or recurring
                  billing are established.</p>
                <p>Favorites are unimplemented. No recipe-book PDF or download handler was
                  supplied; the pictured offers remain prototype promises.</p>
              </div>
            </div>
          </Chapter>

          <Chapter chapter={chapters[5]} number="06" title="A static frontend, with client integration">
            <p>The product uses HTML, CSS and vanilla JavaScript with the Supabase browser
              SDK. The source records authentication and data requests. This product stack
              is separate from the portfolio’s React and Vite implementation.</p>
            <figure className="project-architecture">
              <ol className="project-flow" aria-label="IcaMeal request architecture">
                <li><strong>HTML & CSS</strong><span>Interface and layout</span></li>
                <li><strong>Vanilla JavaScript</strong><span>Planner and interface state</span></li>
                <li><strong>Supabase browser SDK</strong><span>Client requests</span></li>
                <li className="project-flow-boundary"><strong>Auth / Database / Demo checkout</strong>
                  <span>Request destinations; hosted behavior unverified</span></li>
              </ol>
              <figcaption>Source-backed client request path. Hosted endpoints and server
                enforcement remain unverified.</figcaption>
            </figure>
            <div className="project-text-columns">
              <div><h4>Guest state</h4>
                <p>Weekly choices and shopping checks stay in application memory. There is
                  no custom local storage for plans or premium flags.</p></div>
              <div><h4>Authenticated requests</h4>
                <p>The SDK persists its auth session and requests profiles, plans, shopping
                  lists, products and entitlements. Two incremental migrations are supplied;
                  the base schema, complete policies and demo function source are missing.</p></div>
            </div>
          </Chapter>

          <Chapter chapter={chapters[6]} number="07" title="Current limits and possible next work">
            <div className="project-note project-limits">
              <h4>Repeated-recipe ingredient undercount — unresolved</h4>
              <p>The ingredient query deduplicates recipe IDs while aggregation stores one
                servings value per recipe. Repeated meals can therefore be counted once.</p>
              <p>In the audit’s isolated synthetic diagnostic, two one-serving meals requiring
                100 g each produced 100 g instead of 200 g. This was a source diagnostic,
                not a customer result. The defect remains unresolved.</p>
            </div>
            <ul className="project-limit-list">
              <li><strong>Cost and nutrition.</strong> Some budgets cannot be met. Recipe
                estimates and macronutrients have not been independently validated.</li>
              <li><strong>Monthly planning.</strong> A catalog rotation provides 30 ideas,
                without monthly budget or diet optimization.</li>
              <li><strong>Backend and purchases.</strong> The hosted schema, RLS policies,
                auth configuration and checkout deployment remain unverified. Checkout is
                simulated; favorites and recipe-book downloads are not implemented.</li>
              <li><strong>Presentation evidence.</strong> The catalog preview is translucent
                and the monthly heading is partly clipped in the originals. Food-photo
                rights and two source/credit mismatches still need reconciliation.</li>
            </ul>
            <p>Possible next work includes correcting aggregation, verifying the complete
              backend and reconciling image credits.</p>
          </Chapter>
          <footer className="project-footer">
            <GalleryReturnLink onReturn={onReturn} />
            <button className="project-link" type="button" onClick={() => onSelect('blender')}>
              Select {projects.blender.title} <span aria-hidden="true">↗</span>
            </button>
          </footer>
        </div>
      </div>
    </article>
  )
}
