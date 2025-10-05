const supabase = require("../config/supabase");

const TABLE = "assignments";

// --- Fungsi untuk membuat Assignment (Diperbarui) ---
async function createAssignment(data) {
    const defaultData = {
        status: "pending", // Status awal saat dibuat Admin
        // Tambahkan default step, meskipun bisa diurus di frontend
        step: 0,
        ...data
    };
    // Hapus id dari data jika ada
    if (defaultData.id) delete defaultData.id;

    return await supabase
        .from(TABLE)
        .insert([defaultData])
        .select("*")
        .single();
}

// --- Fungsi untuk memperbarui Assignment (BARU) ---
async function updateAssignment(id, updateData) {
    // Supaya tidak bisa update id atau created_by
    const safeUpdateData = { ...updateData };
    if (safeUpdateData.id) delete safeUpdateData.id;
    if (safeUpdateData.created_by) delete safeUpdateData.created_by;
    if (safeUpdateData.customer_id) delete safeUpdateData.customer_id; // Customer ID tidak boleh diubah

    return await supabase
        .from(TABLE)
        .update(safeUpdateData)
        .eq("id", id)
        .select("*")
        .single();
}

async function getAssignments(filters = {}) {
    let query = supabase.from(TABLE).select("*").order("created_at", { ascending: false });

    if (filters.agent_id) query = query.eq("agent_id", filters.agent_id);
    if (filters.status) query = query.eq("status", filters.status);

    return await query;
}

async function getAssignmentById(id) {
    return await supabase.from(TABLE).select("*").eq("id", id).single();
}

module.exports = { 
    createAssignment, 
    getAssignments, 
    getAssignmentById,
    updateAssignment, // Export fungsi baru
};