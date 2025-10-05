const { createAssignment, getAssignments, getAssignmentById, updateAssignment } = require("../models/assignments");
const { response } = require("../utils/wrapper");

// CREATE (admin only) - Diperbarui untuk menerima data lengkap
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
        
        // Pastikan agent_id dan customer_id ada
        if (!agent_id || !customer_id) {
            return response(res, 400, "customer_id and agent_id are required.");
        }

        const assignmentData = {
            customer_id, agent_id, created_by: req.user.id,
            jenis_identitas, no_identitas, nama_lengkap,
            tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_telepon,
            status_layak_bayar, total_simpanan, nominal_layak_bayar,
            batas_akhir_pengajuan, nama_bank, no_cif,
            // Semua field Agent akan diisi null/kosong di awal
            // Misalnya: verifikasi_foto_nasabah: null, token_input: null, dll.
        };

        const { data, error } = await createAssignment(assignmentData);
        if (error) return response(res, 500, error.message);

        return response(res, 201, "Assignment created successfully", data);
    } catch (err) {
        return response(res, 500, err.message);
    }
};

// --- Agent Controller ---

// UPDATE/DRAFT (agent only) - BARU
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
        
        // Agent tidak boleh mengubah status di sini, kecuali menjadi 'pending' (draft)
        const safeUpdateData = { ...updateData };
        if (safeUpdateData.status && safeUpdateData.status !== 'pending') {
            delete safeUpdateData.status;
        }

        const { data, error } = await updateAssignment(id, { ...safeUpdateData, status: 'pending' });
        if (error) return response(res, 500, error.message);

        return response(res, 200, "Assignment draft saved successfully", data);
    } catch (err) {
        return response(res, 500, err.message);
    }
};

// SUBMIT (agent only) - BARU
exports.submit = async (req, res) => {
    try {
        const { id } = req.params;
        // Data final dari Step 4 bisa dikirim di body, tapi di sini kita hanya fokus pada perubahan status
        const finalData = req.body; 

        if (req.user.role !== "agent") {
            return response(res, 403, "Only agent can submit assignment.");
        }

        const { data: assignment } = await getAssignmentById(id);
        if (!assignment) return response(res, 404, "Assignment not found.");

        if (assignment.agent_id !== req.user.id) {
            return response(res, 403, "You are not the assigned agent for this assignment.");
        }
        
        // Lakukan validasi minimal (misal, cek apakah dokumen penting sudah di-upload)
        // if (!finalData.dokumen_buku_tabungan) { return response(res, 400, "Buku tabungan is required for submission."); }

        const { data, error } = await updateAssignment(id, { ...finalData, status: 'submitted', submitted_at: new Date() });
        if (error) return response(res, 500, error.message);

        return response(res, 200, "Assignment submitted successfully for approval", data);
    } catch (err) {
        return response(res, 500, err.message);
    }
};

// --- Admin/Approver Controller ---

// APPROVE/REJECT (admin/approver only) - BARU
exports.review = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, note } = req.body; // action: 'approve' atau 'reject'

        if (!['admin', 'approver'].includes(req.user.role)) {
            return response(res, 403, "Only admin or approver can review assignment.");
        }

        if (!['approve', 'reject'].includes(action)) {
            return response(res, 400, "Invalid action. Must be 'approve' or 'reject'.");
        }

        const { data: assignment } = await getAssignmentById(id);
        if (!assignment) return response(res, 404, "Assignment not found.");

        if (assignment.status !== 'submitted') {
            return response(res, 400, "Assignment is not ready for review (status must be 'submitted').");
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';
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


// LIST (tetap sama)
exports.list = async (req, res) => {
// ... kode yang sama
    try {
        const { agent_id, status } = req.query;
        const { data, error } = await getAssignments({ agent_id, status });

        if (error) return response(res, 500, error.message);

        return response(res, 200, "Assignments fetched successfully", data);
    } catch (err) {
        return response(res, 500, err.message);
    }
};

// DETAIL (tetap sama)
exports.detail = async (req, res) => {
// ... kode yang sama
    try {
        const { id } = req.params;
        const { data, error } = await getAssignmentById(id);

        if (error || !data) return response(res, 404, "Assignment not found");

        return response(res, 200, "Assignment detail", data);
    } catch (err) {
        return response(res, 500, err.message);
    }
};