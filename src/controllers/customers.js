const { createCustomer, getCustomers, getCustomerById } = require("../models/customers");
const { response } = require("../utils/wrapper");

// CREATE
exports.create = async (req, res) => {
  try {
    const { name, nik, address, phone } = req.body;

    if (req.user.role !== "admin") {
      return response(res, 403, "Only admin can create customer");
    }

    const { data, error } = await createCustomer(name, nik, address, phone, req.user.id);
    if (error) return response(res, 500, error.message);

    return response(res, 201, "Customer created successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};


// LIST
exports.list = async (req, res) => {
  try {
    const { data, error } = await getCustomers();
    if (error) return response(res, 500, error.message);

    return response(res, 200, "Customers fetched successfully", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// DETAIL
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await getCustomerById(id);
    if (error) return response(res, 404, error.message);

    return response(res, 200, "Customer detail", data);
  } catch (err) {
    return response(res, 500, err.message);
  }
};
