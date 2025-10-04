const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/approvals");
const authMiddleware = require("../middleware/auth");

// hanya approver role
function approverOnly(req, res, next) {
  if (req.user.role !== "approver") {
    return res.status(403).json({ status: 403, message: "Forbidden: Approver only" });
  }
  next();
}

router.post("/", authMiddleware, approverOnly, approvalController.create);
router.get("/", authMiddleware, approverOnly, approvalController.list);
router.get("/:id", authMiddleware, approverOnly, approvalController.detail);

module.exports = router;
