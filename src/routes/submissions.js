const express = require("express");
const router = express.Router();
const submissionsController = require("../controllers/submissions");
const authMiddleware = require("../middleware/auth");

// agent submit hasil survei
router.post("/", authMiddleware, submissionsController.create);

// ambil submission by assignment_id
router.get("/:assignment_id", authMiddleware, submissionsController.getByAssignment);

module.exports = router;
