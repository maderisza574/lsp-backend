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

    // Default status dan step diatur di model (status: 'pending', step: 0)
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

    // Agent bisa update data termasuk 'step', tapi status dijaga agar tetap 'pending' 
    // jika belum disubmit (atau tidak boleh diubah oleh agent).
    const safeUpdateData = { ...updateData };
    
    // Pastikan agent tidak bisa mengubah status menjadi status final
    if (safeUpdateData.status && ["success", "rejected"].includes(safeUpdateData.status)) {
        delete safeUpdateData.status;
    }
    
    // Status dipertahankan 'pending' jika belum final
    if (assignment.status !== 'success' && assignment.status !== 'rejected') {
        safeUpdateData.status = "pending";
    }

    const { data, error } = await updateAssignment(id, safeUpdateData);
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Assignment draft saved successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// --- SUBMIT (DIHAPUS atau DIUBAH MENJADI BAGIAN DARI updateDraft) ---
// Jika updateDraft sudah mengirim step 4, maka secara logis sudah dianggap submit.
// Oleh karena itu, kita akan fokus pada pengecekan step di review.

// --- APPROVE / REJECT (admin or approver only) ---
exports.review = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body; // action: 'approve' / 'reject'
    const MIN_STEP_FOR_REVIEW = 4; // Menentukan minimum step untuk review

    if (!["admin", "approver"].includes(req.user.role)) {
      return response(res, 403, "Only admin or approver can review assignment.");
    }

    if (!["approve", "reject"].includes(action)) {
      return response(res, 400, "Invalid action. Must be 'approve' or 'reject'.");
    }

    const { data: assignment } = await getAssignmentById(id);
    if (!assignment) return response(res, 404, "Assignment not found.");

    // Pengecekan baru: Pastikan step sudah mencapai minimum yang ditentukan
    if (assignment.step < MIN_STEP_FOR_REVIEW) {
      return response(res, 400, `Assignment must be completed up to Step ${MIN_STEP_FOR_REVIEW} before review.`);
    }

    // Pengecekan status: Pastikan assignment belum di-review/final
    if (["success", "rejected"].includes(assignment.status)) {
        return response(res, 400, `Assignment already reviewed with status: ${assignment.status}.`);
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