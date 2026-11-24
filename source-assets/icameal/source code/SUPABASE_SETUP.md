# IcaMeal — Supabase Integration

This is a static HTML/CSS/JavaScript site connected to Supabase.

## Project

- Project ref: `xxmsmbzcbhgxgdxlacbd`
- Project URL: `https://xxmsmbzcbhgxgdxlacbd.supabase.co`
- Browser key: Supabase publishable key in `supabase-client.js`
- Browser SDK: `@supabase/supabase-js@2.119.0` via pinned jsDelivr UMD URL

The publishable key is designed for browser use. Never put a Supabase secret or service-role key in `index.html`, `app.js`, or any other public asset. Database access is guarded by RLS.

## Supabase Auth setup

In Supabase Dashboard → Authentication → URL Configuration:

1. Set Site URL to the deployed IcaMeal origin.
2. Add the deployed origin to Redirect URLs.
3. Add `http://localhost:5500/**` (or the local development origin/port you actually use) for local preview.
4. Confirm the Email provider is enabled.

When email confirmation is enabled, sign-up creates the account but the user must verify their email before signing in. The UI displays that state.

### Email delivery and rate limits

The hosted project's built-in SMTP service is for testing only. It restricts recipients to organization team-member addresses and has a very low project-wide hourly send allowance. When that allowance is exhausted, Auth returns HTTP 429 with `over_email_send_rate_limit` / `email rate limit exceeded`.

For normal public sign-ups, configure a custom SMTP provider in **Authentication → SMTP Settings** and follow the provider's sender-domain verification steps. After SMTP works, check **Authentication → Rate Limits** and set limits appropriate for the provider's sending capacity.

For local-only testing, you can temporarily turn **Confirm email** off under **Authentication → Sign In / Providers → Email**. This lets new accounts sign up without sending a verification email, but it also marks submitted email addresses as verified without proving ownership. Do not use this shortcut for a public deployment; turn confirmation back on before launch.

Official Supabase guidance: [Testing Auth flows](https://supabase.com/docs/guides/auth/testing-auth-flows), [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), and [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits).

## Data ownership

- Recipe metadata, images, nutrition data, products, ingredients, and recipe instructions are read from PostgreSQL.
- Profiles store the user's name, budget, and diet preference.
- Meal plans and their daily items are stored per authenticated user.
- Shopping lists and checked items are stored per authenticated user.
- Entitlements are read from the database and are not trusted from browser flags.

Guest visitors can browse public recipe data and use a temporary, in-memory preview of a weekly shopping list. Their temporary guest changes are not stored. Signing in makes profile preferences, plans, and shopping checklist changes persistent in PostgreSQL.

## Browser storage

The app contains no custom `localStorage` or cookie persistence for profiles, shopping data, meal plans, purchases, or premium flags. The Supabase Auth SDK still persists the authentication session in the browser so a signed-in user remains signed in across refreshes. This is session storage managed by Supabase Auth, not the application's data store.

## Purchase flow

Purchases are still **demo/simulated**, not real payments.

The browser calls the authenticated `demo-checkout` Edge Function with a product code. The function verifies the signed-in user, allow-lists the product code, and invokes the database purchase routine. Product price and entitlement type are read from the database. The browser cannot directly insert purchases or entitlements.

When adding a real payment provider, replace the demo function with a provider checkout flow and a verified server-side webhook. Never grant an entitlement based only on a client-side success callback.

## Main data tables

- `profiles`
- `products`
- `recipes`
- `ingredients`
- `recipe_ingredients`
- `recipe_steps`
- `meal_plans`
- `meal_plan_items`
- `shopping_lists`
- `shopping_list_items`
- `purchases`
- `user_entitlements`

All public-schema tables have RLS enabled. Premium recipe detail rows are separately guarded by database policies and entitlement checks.
