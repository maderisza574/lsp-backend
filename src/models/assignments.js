const supabase = require("../config/supabase");
const TABLE = "assignments";

// CREATE
async function createAssignment(data) {
  const defaultData = {
    status: "pending", // Status awal
    step: 0, // Step awal
    ...data,
  };
  if (defaultData.id) delete defaultData.id;

  return await supabase
    .from(TABLE)
    .insert([defaultData])
    .select("*")
    .single();
}

// UPDATE
async function updateAssignment(id, updateData) {
  const safeUpdateData = { ...updateData };
  delete safeUpdateData.id;
  delete safeUpdateData.created_by;
  delete safeUpdateData.customer_id;

  return await supabase
    .from(TABLE)
    .update(safeUpdateData)
    .eq("id", id)
    .select("*")
    .single();
}

// LIST
async function getAssignments(filters = {}) {
  let query = supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.agent_id) query = query.eq("agent_id", filters.agent_id);
  if (filters.status) query = query.eq("status", filters.status);

  return await query;
}

// DETAIL
async function getAssignmentById(id) {
  return await supabase.from(TABLE).select("*").eq("id", id).single();
}

// DELETE
async function deleteAssignment(id) {
  return await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};