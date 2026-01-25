const { createClient } = require("@supabase/supabase-js");

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to your .env (see .env.example).`,
    );
  }
  return value;
}

function createSupabaseClient() {
  const url = getRequiredEnv("SUPABASE_URL");
  const anonKey = getRequiredEnv("SUPABASE_ANON_KEY");

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

module.exports = {
  createSupabaseClient
};

