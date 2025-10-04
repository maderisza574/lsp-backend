const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/auth");
const { response } = require("../utils/wrapper");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;

    // cek kalau sudah ada
    const { data: existingUser } = await findUserByEmail(email);
    if (existingUser) {
      return response(res, 400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { error } = await createUser(email, hashedPassword, full_name, role);

    if (error) return response(res, 500, error.message);

    return response(res, 201, "User registered successfully");
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await findUserByEmail(email);
    if (error || !user) {
      return response(res, 400, "Invalid credentials");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return response(res, 400, "Invalid credentials");

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // buang password sebelum dikirim
    const { password: _, ...userWithoutPassword } = user;

    return response(res, 200, "Login successful", {
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    return response(res, 500, err.message);
  }
};
