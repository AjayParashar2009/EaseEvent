const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      const existing = await Admin.findOne({ email });
      if (existing)
        return res.status(400).json({ msg: "Email already registered" });

      const passwordHash = await bcrypt.hash(password, 10);
      const admin = new Admin({ name, email, passwordHash });
      await admin.save();

      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES_IN || "7d" }
      );
      res.json({
        token,
        admin: { id: admin._id, name: admin.name, email: admin.email },
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES_IN || "7d" }
      );
      res.json({
        token,
        admin: { id: admin._id, name: admin.name, email: admin.email },
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
