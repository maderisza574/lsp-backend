const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/assignments");
const authMiddleware = require("../middleware/auth");

// Semua endpoint harus login
router.post("/", authMiddleware, assignmentsController.create);
router.get("/", authMiddleware, assignmentsController.list);
router.get("/:id", authMiddleware, assignmentsController.detail);

// Agent routes
// Endpoint ini digunakan untuk menyimpan draft dan mengupdate 'step'
router.patch("/:id/draft", authMiddleware, assignmentsController.updateDraft);
// router.post("/:id/submit", authMiddleware, assignmentsController.submit); // <= DIHAPUS

// Admin/Approver routes
// Review dilakukan jika 'step' sudah memenuhi syarat (>= 4)
router.post("/:id/review", authMiddleware, assignmentsController.review);

// Delete (admin only)
router.delete("/:id", authMiddleware, assignmentsController.remove);

module.exports = router;