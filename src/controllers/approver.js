// controllers/approver.js
const {
  createApprover,
  getApprovers,
  getApproverById,
  updateApprover,
  deleteApprover,
} = require("../models/approver");
const { response } = require("../utils/wrapper");

/**
 * POST /approver
 * Only admin can create
 */
exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, attachments } = req.body;
    const user_id = req.user.id;

    if (!judul) return response(res, 400, "Judul is required");

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
