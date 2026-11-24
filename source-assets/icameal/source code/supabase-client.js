(function () {
  "use strict";

  const config = {
    url: "https://xxmsmbzcbhgxgdxlacbd.supabase.co",
    publishableKey: "sb_publishable_viUbfWl9AI-QKSw4h8mpOA_BHK131f8"
  };

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase JS failed to load.");
    window.icaSupabase = null;
    return;
  }

  // The SDK persists only the Supabase Auth session. App data lives in PostgreSQL.
  window.icaSupabase = window.supabase.createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  });
})();