const { createApproval, getApprovals, getApprovalById } = require("../models/approvals");
const { response } = require("../utils/wrapper");

// POST /approvals
exports.create = async (req, res) => {
  try {
    const { submission_id, status } = req.body;
    const approver_id = req.user.id; // dari JWT

    if (!submission_id || !status) {
      return response(res, 400, "submission_id and status are required");
    }

    const { data, error } = await createApproval(submission_id, approver_id, status);

    if (error) return response(res, 500, error.message);

    return response(res, 201, "Approval created successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// GET /approvals
exports.list = async (req, res) => {
  try {
    const { data, error } = await getApprovals();
    if (error) return response(res, 500, error.message);

    return response(res, 200, "List of approvals", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// GET /approvals/:id
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await getApprovalById(id);

    if (error || !data) return response(res, 404, "Approval not found");

    return response(res, 200, "Approval detail", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};
