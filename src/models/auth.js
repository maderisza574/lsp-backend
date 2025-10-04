const supabase = require("../config/supabase");

const TABLE = "users";

async function createUser(email, hashedPassword, full_name, role) {
  return await supabase.from(TABLE).insert([
    { email, password: hashedPassword, full_name, role }
  ]);
}

async function findUserByEmail(email) {
  return await supabase
    .from(TABLE)
    .select("id, email, password, full_name, role")
    .eq("email", email)
    .single();
}

module.exports = { createUser, findUserByEmail };
