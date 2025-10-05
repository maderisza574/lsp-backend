const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/assignments");
const authMiddleware = require("../middleware/auth");

// semua endpoint assignment wajib login

// Admin/Public Routes
router.post("/", authMiddleware, assignmentsController.create);
router.get("/", authMiddleware, assignmentsController.list);
router.get("/:id", authMiddleware, assignmentsController.detail);

// Agent Routes (PATCH untuk update data/draft, POST untuk submit final)
router.patch("/:id/draft", authMiddleware, assignmentsController.updateDraft); // Agent untuk Simpan Draft
router.post("/:id/submit", authMiddleware, assignmentsController.submit); // Agent untuk Kirim Final

// Admin/Approver Routes
router.post("/:id/review", authMiddleware, assignmentsController.review); // Admin/Approver untuk Approve/Reject

module.exports = router;