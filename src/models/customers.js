const supabase = require("../config/supabase");

const TABLE = "customers";

async function createCustomer(name, nik, address, phone, created_by) {
  return await supabase
    .from(TABLE)
    .insert([{ name, nik, address, phone, created_by }])
    .select("*") // ✅ biar hasil insert balik datanya
    .single();   // ✅ cuma ambil 1 record
}

async function getCustomers() {
  return await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
}

async function getCustomerById(id) {
  return await supabase.from(TABLE).select("*").eq("id", id).single();
}

module.exports = { createCustomer, getCustomers, getCustomerById };
