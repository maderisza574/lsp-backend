const supabase = require("../config/supabase");

const TABLE = "agent_submissions";

async function createSubmission(assignment_id, photo_url, notes, created_by) {
  // insert submission
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ assignment_id, photo_url, notes, created_by }])
    .select("*")
    .single();

  if (error) return { data: null, error };

  // update status assignment jadi submitted
  const { error: updateError } = await supabase
    .from("assignments")
    .update({ status: "submitted" })
    .eq("id", assignment_id);

  if (updateError) return { data: null, error: updateError };

  return { data, error: null };
}

async function getSubmissionByAssignment(assignment_id) {
  return await supabase
    .from(TABLE)
    .select("*")
    .eq("assignment_id", assignment_id)
    .single();
}

module.exports = { createSubmission, getSubmissionByAssignment };
