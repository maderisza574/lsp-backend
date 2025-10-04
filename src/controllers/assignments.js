const { createAssignment, getAssignments, getAssignmentById } = require("../models/assignments");
const { response } = require("../utils/wrapper");

// CREATE (admin only)
exports.create = async (req, res) => {
  try {
    const { customer_id, agent_id } = req.body;

    if (req.user.role !== "admin") {
      return response(res, 403, "Only admin can create assignment");
    }

    const { data, error } = await createAssignment(customer_id, agent_id, req.user.id);
    if (error) return response(res, 500, error.message);

    return response(res, 201, "Assignment created successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// LIST
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

// DETAIL
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
