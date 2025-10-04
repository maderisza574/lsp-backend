// load .env dulu
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// cek dulu apakah env kebaca
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "✅ ada" : "❌ kosong");

// bikin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
