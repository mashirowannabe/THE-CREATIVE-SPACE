# Mission 009C — Edited chapter copy

## IcaMeal

01 / Overview

IcaMeal

A week of meals,starting with a budget.

Digital product / Frontend prototype

IcaMeal is a frontend prototype for students and people living in rented rooms who plan a week of meals around a budget and eating preferences.

A budget leads to seven main meals, recipes and a grouped shopping checklist. The exhibition follows that sequence through the captured interface.

Hosted backend unverified. Checkout is simulated.

“Good food, student budget.”


### A culinary editorial identity

Cream, forest green, terracotta and gold carry through the planning screens. Fraunces headings and italic emphasis sit beside DM Sans controls. The club lettering and budget panel below show that contrast in the existing interface.

The original interface also includes this botanical strip. The complete budget sequence and club offer follow below. Food photography is externally sourced, separate from the interface design.


### From an amount to seven meals

A budget input, slider and presets set the amount. Four recipe-tag preferences narrow the search: All, Vegan, High Protein and Super Hemat. With enough recipes, the planner chooses seven entries with the highest total within the budget.

When the recipe pool cannot meet the amount, the planner uses its cheapest options and reports a shortfall. Small pools repeat meals. Costs are recipe-record estimates; affordability is not guaranteed.

Each day has one main meal. Selecting it reveals cost and macronutrients; regenerating the week rotates the menu order. The recorded nutrition values have no medical or nutritional validation.


### Recipes become a shopping checklist

Ten recipes open the catalog, with an option to reveal all. In the product, hover or keyboard focus can expose a preview; the recipe dialog requests ingredients and cooking steps. The capture below records the preview state.

One list for the week

The opening shopping screen groups ingredients by category, shows purchase progress and offers a copy control. Guest checks live in memory; signed-in updates call the database.

Repeated recipes can undercount ingredients in the current prototype.


### A month of ideas, with an access boundary

A membership or monthly-plan entitlement gates the 30-day calendar in the frontend. Its generator cycles the recipe catalog; it does not optimize a whole month around the weekly budget or eating preferences.

Simulated checkout

Checkout controls request a demo function. No real payments or recurring billing are established.

Favorites are unimplemented. No recipe-book PDF or download handler was supplied; the pictured offers remain prototype promises.


### A static frontend, with client integration

The product uses HTML, CSS and vanilla JavaScript with the Supabase browser SDK. The source records authentication and data requests. This product stack is separate from the portfolio’s React and Vite implementation.

HTML & CSSInterface and layout

Vanilla JavaScriptPlanner and interface state

Supabase browser SDKClient requests

Auth / Database / Demo checkout Request destinations; hosted behavior unverified

Source-backed client request path. Hosted endpoints and server enforcement remain unverified.

Guest state

Weekly choices and shopping checks stay in application memory. There is no custom local storage for plans or premium flags.

Authenticated requests

The SDK persists its auth session and requests profiles, plans, shopping lists, products and entitlements. Two incremental migrations are supplied; the base schema, complete policies and demo function source are missing.


### Current limits and possible next work

Repeated-recipe ingredient undercount — unresolved

The ingredient query deduplicates recipe IDs while aggregation stores one servings value per recipe. Repeated meals can therefore be counted once.

In the audit’s isolated synthetic diagnostic, two one-serving meals requiring 100 g each produced 100 g instead of 200 g. This was a source diagnostic, not a customer result. The defect remains unresolved.

Cost and nutrition. Some budgets cannot be met. Recipe estimates and macronutrients have not been independently validated.

Monthly planning. A catalog rotation provides 30 ideas, without monthly budget or diet optimization.

Backend and purchases. The hosted schema, RLS policies, auth configuration and checkout deployment remain unverified. Checkout is simulated; favorites and recipe-book downloads are not implemented.

Presentation evidence. The catalog preview is translucent and the monthly heading is partly clipped in the originals. Food-photo rights and two source/credit mismatches still need reconciliation.

Possible next work includes correcting aggregation, verifying the complete backend and reconciling image credits.


## Fire Sprinkler

01 / Overview

Fire Sprinkler

Form, surfaceand a particle experiment.

Blender / Mechanical modeling study

Original modeling by the portfolio owner from visual references, with material and particle-system experimentation. The exhibition follows a compact assembly through its silhouette, three material setups and recorded motion.

Artistic modeling and particle study. Engineering dimensions, activation behavior and sprinkler performance remain unvalidated.


### A compact assembly around a central element

Two angular supports frame a red glass element between gold-toned seats. Above, a cylinder and spaced metal tabs form the head; below, the supports meet a rectangular base.

Head & rim

A cylinder and repeated tabs establish the upper silhouette.

Supports & base

The angled frame surrounds the central element and meets the block below.

Glass & seats

The red element and gold-toned contacts make the central axis visible.

The source contains separate mesh objects with Bevel and Smooth by Angle modifiers for shape and surface treatment.


### Three materials, with distinct surface roles

Gray metallic surfaces define the frame and head, warm brass marks the seats, and red glass emphasizes the center. Each setup gives the assembly a different surface role.

Stainless — procedural surface detail

UV coordinates pass through Mapping, Noise and Bump into the normal input. Y mapping scale 80 and Noise scale 100 create directional surface variation; Bump strength is 0.05 with distance 0.001.

Brass — warm metallic contacts

A gold base color, metallic weight 1 and roughness 0.3 define the brass. The capture pairs the selected lower seat with a direct Principled BSDF connection to Material Output.

Glass — a red central accent

The inspected source uses a red base color, metallic 0, roughness 0.05, IOR 1.45 and transmission weight 1. The capture shows the first four values; Transmission remains collapsed.


### Recorded motion as a particle experiment

Object particles rise and scatter around the model while the viewing angle changes. Use Play to inspect the recorded motion.

Experiment setup

A circular emitter uses Newtonian particles rendered as Icosphere instances, with Collision modifiers on assembly meshes. The visualization is artistic, without calibrated fluid or fire simulation.

Water pressure, droplet dimensions, discharge rate, coverage, thermal activation and fire-suppression effectiveness have not been validated.


### Workflow evidence and current limits

The editable source records separate modeling, material and particle configurations alongside the renders, shader captures and clip.

Modeling

Separate meshes; Bevel, Smooth by Angle and Collision modifiers.

Materials

Principled metal/brass/glass setups; Noise-driven bump for stainless.

Particles

10,000 configured particles, emission frames 1–200 and lifetime 30 frames; source cache not baked.

The Collision captures show Particle damping and friction at 0 and 0.1. Their target objects and chronology are unknown. Softbody & Cloth fields belong to a separate settings group.

Current limits

The model was made from visual references. Original modeling credit is separate from reference photography, the packed lighting environment and Blender’s software node assets; their source and license records remain unresolved.

No topology or exploded-assembly capture, toleranced CAD record or manufacturing validation was supplied. Shader and particle values are artistic configurations. The original MKV preview has browser-dependent playback.

Possible next work includes assembly/topology documentation, reconciled reference and lighting credits, portable playback and controlled particle comparisons. Check the saved Smooth by Angle library path for portability before future exports.

## What changed

Shortened exhibition introductions, placed scope beside the overview, connected identity to supplied captures, removed a repeated architecture explanation, and consolidated mechanical documentation limits in Technical Notes. Original figure captions and source credits remain in their media records.
