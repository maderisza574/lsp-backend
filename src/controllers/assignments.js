const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../models/assignments");
const { response } = require("../utils/wrapper");

// --- CREATE (admin only) ---
exports.create = async (req, res) => {
  try {
    const {
      customer_id, agent_id, jenis_identitas, no_identitas, nama_lengkap,
      tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_telepon,
      status_layak_bayar, total_simpanan, nominal_layak_bayar,
      batas_akhir_pengajuan, nama_bank, no_cif
    } = req.body;

    if (req.user.role !== "admin") {
      return response(res, 403, "Only admin can create assignment");
    }

    if (!agent_id || !customer_id) {
      return response(res, 400, "customer_id and agent_id are required.");
    }

    const assignmentData = {
      customer_id, agent_id, created_by: req.user.id,
      jenis_identitas, no_identitas, nama_lengkap,
      tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_telepon,
      status_layak_bayar, total_simpanan, nominal_layak_bayar,
      batas_akhir_pengajuan, nama_bank, no_cif,
    };

    const { data, error } = await createAssignment(assignmentData);
    if (error) return response(res, 500, error.message);

    return response(res, 201, "Assignment created successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// --- UPDATE DRAFT (agent only) ---
exports.updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.user.role !== "agent") {
      return response(res, 403, "Only agent can update assignment.");
    }

    const { data: assignment } = await getAssignmentById(id);
    if (!assignment) return response(res, 404, "Assignment not found.");

    if (assignment.agent_id !== req.user.id) {
      return response(res, 403, "You are not the assigned agent for this assignment.");
    }

    const safeUpdateData = { ...updateData };
    if (safeUpdateData.status && safeUpdateData.status !== "pending") {
      delete safeUpdateData.status;
    }

    const { data, error } = await updateAssignment(id, {
      ...safeUpdateData,
      status: "pending",
    });
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Assignment draft saved successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// --- SUBMIT (agent only) ---
exports.submit = async (req, res) => {
  try {
    const { id } = req.params;
    const finalData = req.body;

    if (req.user.role !== "agent") {
      return response(res, 403, "Only agent can submit assignment.");
    }

    const { data: assignment } = await getAssignmentById(id);
    if (!assignment) return response(res, 404, "Assignment not found.");

    if (assignment.agent_id !== req.user.id) {
      return response(res, 403, "You are not the assigned agent for this assignment.");
    }

    const { data, error } = await updateAssignment(id, {
      ...finalData,
      status: "in_progress", // disamakan dengan constraint DB
      submitted_at: new Date(),
    });
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Assignment submitted successfully for approval", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// --- APPROVE / REJECT (admin or approver only) ---
exports.review = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body; // action: 'approve' / 'reject'

    if (!["admin", "approver"].includes(req.user.role)) {
      return response(res, 403, "Only admin or approver can review assignment.");
    }

    if (!["approve", "reject"].includes(action)) {
      return response(res, 400, "Invalid action. Must be 'approve' or 'reject'.");
    }

    const { data: assignment } = await getAssignmentById(id);
    if (!assignment) return response(res, 404, "Assignment not found.");

    if (assignment.status !== "in_progress") {
      return response(res, 400, "Assignment must be in 'in_progress' status before review.");
    }

    const newStatus = action === "approve" ? "success" : "rejected"; // ✅ disamakan dengan constraint DB
    const updateData = {
      status: newStatus,
      reviewed_by: req.user.id,
      reviewed_at: new Date(),
      approval_note: note || null,
    };

    const { data, error } = await updateAssignment(id, updateData);
    if (error) return response(res, 500, error.message);

    return response(res, 200, `Assignment ${newStatus} successfully`, data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// --- LIST ---
exports.list = async (req, res) => {
  try {
    const { agent_id, status } = req.query;
    const { data, error } = await getAssignments({ agent_id, status });

    if (error) return response(res, 500, error.message);

    return response(res, 200, "Assignments fetched successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// --- DETAIL ---
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await getAssignmentById(id);

    if (error || !data) return response(res, 404, "Assignment not found");

    return response(res, 200, "Assignment detail", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// --- DELETE (admin only) ---
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return response(res, 403, "Only admin can delete assignment.");
    }

    const { data: assignment } = await getAssignmentById(id);
    if (!assignment) return response(res, 404, "Assignment not found.");

    const { data, error } = await deleteAssignment(id);
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Assignment deleted successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};
