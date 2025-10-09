const supabase = require("../config/supabase");
const TABLE = "assignments";

// CREATE
async function createAssignment(data) {
  const defaultData = {
    status: "pending", 
    step: 0, 
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
  delete safeUpdateData.agent_id; // Agent tidak boleh ganti agent_id

  return await supabase
    .from(TABLE)
    .update(safeUpdateData)
    .eq("id", id)
    .select("*")
    .single();
}

// LIST, DETAIL, DELETE

async function getAssignments(filters = {}) {
  let query = supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.agent_id) query = query.eq("agent_id", filters.agent_id);
  if (filters.status) query = query.eq("status", filters.status);

  return await query;
}

async function getAssignmentById(id) {
  return await supabase.from(TABLE).select("*").eq("id", id).single();
}

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