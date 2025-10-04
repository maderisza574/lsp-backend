const supabase = require("../config/supabase");

const TABLE = "assignments";

async function createAssignment(customer_id, agent_id, created_by) {
  return await supabase
    .from(TABLE)
    .insert([{ customer_id, agent_id, status: "pending", created_by }])
    .select("*")
    .single();
}

async function getAssignments(filters = {}) {
  let query = supabase.from(TABLE).select("*").order("created_at", { ascending: false });

  if (filters.agent_id) query = query.eq("agent_id", filters.agent_id);
  if (filters.status) query = query.eq("status", filters.status);

  return await query;
}

async function getAssignmentById(id) {
  return await supabase.from(TABLE).select("*").eq("id", id).single();
}

module.exports = { createAssignment, getAssignments, getAssignmentById };
