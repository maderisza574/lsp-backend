const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/assignments");
const authMiddleware = require("../middleware/auth");

// semua endpoint assignment wajib login
router.post("/", authMiddleware, assignmentsController.create);
router.get("/", authMiddleware, assignmentsController.list);
router.get("/:id", authMiddleware, assignmentsController.detail);

module.exports = router;
