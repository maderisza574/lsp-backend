const Users = require("../models/users");
const { response } = require("../utils/wrapper");

exports.getAgents = async (req, res) => {
  try {
    const agents = await Users.getAgents();
    return response(res, 200, "List of agents", agents);
  } catch (err) {
    console.error(err);
    return response(res, 500, "Internal server error", null);
  }
};
