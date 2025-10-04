const express = require("express");
const router = express.Router();
const customersController = require("../controllers/customers");
const authMiddleware = require("../middleware/auth");

// semua endpoint customer wajib login
router.post("/", authMiddleware, customersController.create);
router.get("/", authMiddleware, customersController.list);
router.get("/:id", authMiddleware, customersController.detail);

module.exports = router;
