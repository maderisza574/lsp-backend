// models/approver.js
const supabase = require("../config/supabase");
const TABLE = "approver";

/**
 * Create new approver record
 */
async function createApprover(user_id, judul, deskripsi, attachments) {
  const payload = {
    user_id,
    judul,
    deskripsi,
    attachments,
    status: 'pending',
    created_at: new Date(),
  };

  const result = await supabase.from(TABLE).insert([payload]).select().single();
  return result; // { data, error }
}

/**
 * Get all approver records (visible to everyone)
 */
async function getApprovers() {
  const result = await supabase.from(TABLE).select(`
    id,
    judul,
    deskripsi,
    attachments,
    status,
    approved_at,
    created_at,
    users(full_name, email)
  `);
  return result;
}

/**
 * Get approver by ID
 */
async function getApproverById(id) {
  const result = await supabase
    .from(TABLE)
    .select(`
      id,
      user_id,
      judul,
      deskripsi,
      attachments,
      status,
      approved_at,
      created_at,
      users(full_name, email)
    `)
    .eq("id", id)
    .single();

  return result;
}

/**
 * Update approver by ID
 */
async function updateApprover(id, payload) {
  const result = await supabase.from(TABLE).update(payload).eq("id", id).select().single();
  return result;
}

/**
 * Delete approver by ID
 */
async function deleteApprover(id) {
  const result = await supabase.from(TABLE).delete().eq("id", id).select().single();
  return result;
}

/**
 * Update approver status (approve/reject)
 */
async function updateApproverStatus(id, status, approved_by = null) {
  const payload = {
    status,
    approved_at: status === 'approved' ? new Date() : null
  };

  const result = await supabase.from(TABLE).update(payload).eq("id", id).select().single();
  return result;
}

/**
 * Get approvers by user_id (for assigned approver)
 */
async function getApproversByUserId(user_id) {
  const result = await supabase
    .from(TABLE)
    .select(`
      id,
      judul,
      deskripsi,
      attachments,
      status,
      approved_at,
      created_at,
      users(full_name, email)
    `)
    .eq("user_id", user_id);
  return result;
}

module.exports = {
  createApprover,
  getApprovers,
  getApproverById,
  updateApprover,
  deleteApprover,
  updateApproverStatus,
  getApproversByUserId
};