const { createSubmission, getSubmissionByAssignment } = require("../models/submissions");
const { response } = require("../utils/wrapper");

// CREATE (agent only)
exports.create = async (req, res) => {
  try {
    if (req.user.role !== "agent") {
      return response(res, 403, "Only agent can create submission");
    }

    const { assignment_id, photo_url, notes } = req.body;

    const { data, error } = await createSubmission(assignment_id, photo_url, notes, req.user.id);
    if (error) return response(res, 500, error.message);

    return response(res, 201, "Submission created successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// GET by assignment_id
exports.getByAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.params;
    const { data, error } = await getSubmissionByAssignment(assignment_id);

    if (error || !data) return response(res, 404, "Submission not found");

    return response(res, 200, "Submission fetched successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};
