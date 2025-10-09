const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/assignments");
const authMiddleware = require("../middleware/auth");

// Semua endpoint harus login
router.post("/", authMiddleware, assignmentsController.create);
router.get("/", authMiddleware, assignmentsController.list);
router.get("/:id", authMiddleware, assignmentsController.detail);

// Agent routes
router.patch("/:id/draft", authMiddleware, assignmentsController.updateDraft);
router.post("/:id/submit", authMiddleware, assignmentsController.submit);

// Step 5 & 6 routes
router.patch("/:id/claim", authMiddleware, assignmentsController.updateClaim);
router.patch("/:id/survey", authMiddleware, assignmentsController.updateSurvey);

// Admin/Approver routes
router.post("/:id/review", authMiddleware, assignmentsController.review);

// Delete (admin only)
router.delete("/:id", authMiddleware, assignmentsController.remove);

module.exports = router;