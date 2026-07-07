const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Seller = require("../models/Seller");

const TOKEN_EXPIRY = "7d";

function signToken(sellerId) {
  return jwt.sign({ sellerId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// ─── POST /api/auth/signup ───────────────────────────────────────────────────
router.post("/signup", async (req, res, next) => {
  try {
    const { businessName, email, password } = req.body;

    if (!businessName || !email || !password) {
      return res
        .status(400)
        .json({ error: "businessName, email and password are all required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await Seller.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const seller = await Seller.create({
      businessName: businessName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    const token = signToken(seller._id);
    res.status(201).json({ message: "Account created", token, seller });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const seller = await Seller.findOne({ email: email.toLowerCase().trim() });
    if (!seller) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, seller.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(seller._id);
    res.status(200).json({ message: "Logged in", token, seller });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
// Convenience route so the frontend can restore a session from a saved token.
const requireAuth = require("../middleware/auth");
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.sellerId);
    if (!seller) return res.status(404).json({ error: "Seller not found" });
    res.status(200).json({ seller });
  } catch (err) {
    next(err);
  }
});

module.exports = router;