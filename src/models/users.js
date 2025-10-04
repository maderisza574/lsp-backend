// src/models/users.js
const supabase = require("../config/supabase");

class Users {
  static async getAgents() {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role") // ✅ ganti name -> full_name
    .eq("role", "agent");

  if (error) throw error;
  return data;
}


  // kalau nanti butuh semua user
  static async getAll() {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role"); // ✅ ganti name -> full_name

  if (error) throw error;
  return data;
}


  // kalau butuh user by id
  static async getById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = Users;
