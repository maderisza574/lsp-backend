const supabase = require("../config/supabase");
const TABLE = "approvals";

async function createApproval(submission_id, approver_id, status) {
  return await supabase.from(TABLE).insert([
    {
      submission_id,
      approver_id,
      status,
      reviewed_at: new Date()
    }
  ]).select().single();
}

async function getApprovals() {
  return await supabase.from(TABLE).select("*");
}

async function getApprovalById(id) {
  return await supabase.from(TABLE).select("*").eq("id", id).single();
}

module.exports = { createApproval, getApprovals, getApprovalById };
