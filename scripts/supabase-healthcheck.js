require("dotenv").config();

const { createSupabaseClient } = require("../src/supabaseClient");

async function fetchHealth(url) {
  const healthUrl = new URL("/auth/v1/health", url).toString();
  const res = await fetch(healthUrl, { method: "GET" });
  const text = await res.text();
  return { url: healthUrl, status: res.status, body: text.slice(0, 500) };
}

async function fetchRestRoot(url, anonKey) {
  const restUrl = new URL("/rest/v1/", url).toString();
  const res = await fetch(restUrl, {
    method: "GET",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  });
  const text = await res.text();
  return { url: restUrl, status: res.status, body: text.slice(0, 500) };
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY. Create a .env from .env.example.",
    );
    process.exit(1);
  }

  // Validate the client can be constructed (also validates env vars).
  createSupabaseClient();

  console.log("Checking Supabase endpoints...");

  const health = await fetchHealth(supabaseUrl);
  console.log(`[auth health] ${health.status} ${health.url}`);
  if (health.body) console.log(health.body);

  const rest = await fetchRestRoot(supabaseUrl, supabaseAnonKey);
  console.log(`[postgrest root] ${rest.status} ${rest.url}`);
  if (rest.body) console.log(rest.body);

  if (health.status >= 400 && rest.status >= 400) {
    console.error("Both checks failed. Verify SUPABASE_URL and network access.");
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});

