// controllers/approver.js
const {
  createApprover,
  getApprovers,
  getApproverById,
  updateApprover,
  deleteApprover,
  updateApproverStatus,
  getApproversByUserId,
} = require("../models/approver");
const { response } = require("../utils/wrapper");

/**
 * POST /approver
 * Only admin can create
 */
exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, attachments, user_id } = req.body;
    const admin_id = req.user.id;

    if (!judul) return response(res, 400, "Judul is required");
    if (!user_id) return response(res, 400, "User ID is required");

    const { data, error } = await createApprover(user_id, judul, deskripsi, attachments || []);

    if (error) return response(res, 500, error.message);

    return response(res, 201, "Approver created successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

/**
 * GET /approver
 * Any user can list data
 */
exports.list = async (req, res) => {
  try {
    const { data, error } = await getApprovers();
    if (error) return response(res, 500, error.message);

    return response(res, 200, "List of approver data", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

/**
 * GET /approver/:id
 * Admin only
 */
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await getApproverById(id);

    if (error || !data) return response(res, 404, "Approver not found");

    return response(res, 200, "Approver detail", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

/**
 * PUT /approver/:id
 * Admin only
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const { data: existing, error: findErr } = await getApproverById(id);
    if (findErr || !existing) return response(res, 404, "Approver not found");

    const { data, error } = await updateApprover(id, payload);
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Approver updated successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

/**
 * DELETE /approver/:id
 * Admin only
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existing, error: findErr } = await getApproverById(id);
    if (findErr || !existing) return response(res, 404, "Approver not found");

    const { data, error } = await deleteApprover(id);
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Approver deleted successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

/**
 * PATCH /approver/:id/approve
 * Only assigned user can approve
 */
exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if approver exists
    const { data: existing, error: findErr } = await getApproverById(id);
    if (findErr || !existing) return response(res, 404, "Approver not found");

    // Check if user is the assigned approver
    if (existing.user_id !== user_id) {
      return response(res, 403, "Forbidden: You are not assigned to approve this");
    }

    // Check if already approved/rejected
    if (existing.status !== 'pending') {
      return response(res, 400, `Approver already ${existing.status}`);
    }

    const { data, error } = await updateApproverStatus(id, 'approved', user_id);
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Approver approved successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

/**
 * PATCH /approver/:id/reject
 * Only assigned user can reject
 */
exports.reject = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if approver exists
    const { data: existing, error: findErr } = await getApproverById(id);
    if (findErr || !existing) return response(res, 404, "Approver not found");

    // Check if user is the assigned approver
    if (existing.user_id !== user_id) {
      return response(res, 403, "Forbidden: You are not assigned to reject this");
    }

    // Check if already approved/rejected
    if (existing.status !== 'pending') {
      return response(res, 400, `Approver already ${existing.status}`);
    }

    const { data, error } = await updateApproverStatus(id, 'rejected', user_id);
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Approver rejected successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

/**
 * GET /approver/my-approvals
 * Get approvals assigned to current user
 */
exports.myApprovals = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await getApproversByUserId(user_id);
    if (error) return response(res, 500, error.message);

    return response(res, 200, "My approval assignments", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};