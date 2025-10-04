const jwt = require("jsonwebtoken");
const { response } = require("../utils/wrapper");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return response(res, 401, "No token provided");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return response(res, 403, "Invalid token");
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
