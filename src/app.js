const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// import routes
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");
const assignmentRoutes = require("./routes/assignments");
const submissionRoutes = require("./routes/submissions");
const approvalRoutes = require("./routes/approvals");
const usersRoutes = require("./routes/users");

app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

// register routes
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/submissions", submissionRoutes);
app.use("/approvals", approvalRoutes);
app.use("/users", usersRoutes);

// ❌ Jangan ada app.listen di sini
module.exports = app;
