const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.get("/agents", usersController.getAgents);

module.exports = router;
