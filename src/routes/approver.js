// routes/approver.js
const express = require("express");
const router = express.Router();
const approverController = require("../controllers/approver");
const authMiddleware = require("../middleware/auth");

// role guards
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ status: 403, message: "Forbidden: Admin only" });
  }
  next();
}

function userOnly(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(403).json({ status: 403, message: "Forbidden: User only" });
  }
  next();
}

// 📍 Routes
router.get("/", authMiddleware, approverController.list); // semua user bisa lihat
router.post("/", authMiddleware, adminOnly, approverController.create);
router.get("/:id", authMiddleware, adminOnly, approverController.detail);
router.put("/:id", authMiddleware, adminOnly, approverController.update);
router.delete("/:id", authMiddleware, adminOnly, approverController.remove);

// ✅ New approval routes
router.get("/my/approvals", authMiddleware, userOnly, approverController.myApprovals);
router.patch("/:id/approve", authMiddleware, userOnly, approverController.approve);
router.patch("/:id/reject", authMiddleware, userOnly, approverController.reject);

module.exports = router;