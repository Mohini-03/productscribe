const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();
const Seller = require("../models/Seller");
const Description = require("../models/Description");
const requireAuth = require("../middleware/auth");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");

const TOKEN_EXPIRY = "7d";
const SALT_ROUNDS = 12;

function signToken(sellerId) {
  return jwt.sign({ sellerId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.array().map((e) => e.msg),
    });
  }
  next();
}

const registerValidation = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("businessName is required")
    .isLength({ max: 120 })
    .withMessage("businessName must be under 120 characters"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isLength({ max: 128 })
    .withMessage("Password is too long"),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

async function registerHandler(req, res, next) {
  try {
    const { businessName, email, password } = req.body;

    const existing = await Seller.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const seller = await Seller.create({
      businessName: businessName.trim(),
      email,
      passwordHash,
      authProvider: "local",
    });

    const token = signToken(seller._id);
    res.status(201).json({ message: "Account created", token, seller });
  } catch (err) {
    next(err);
  }
}

router.post("/register", registerLimiter, registerValidation, handleValidation, registerHandler);
router.post("/signup", registerLimiter, registerValidation, handleValidation, registerHandler);

router.post("/login", loginLimiter, loginValidation, handleValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller || !seller.passwordHash) {
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

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.sellerId);
    if (!seller) return res.status(404).json({ error: "Seller not found" });
    res.status(200).json({ seller });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/auth/me ─────────────────────────────────────────────────────
// Permanently deletes the logged-in seller's account and every description
// they own. This is destructive and irreversible — there's no soft-delete or
// recovery here, so the frontend must confirm with the user before calling it.
//
// For local (email/password) accounts, the current password must be sent in
// the body as an extra confirmation that the person deleting the account is
// actually the account owner, not just someone with a stolen/leaked token.
// Google-only accounts have no password to check, so the confirmation there
// relies entirely on requireAuth (a valid, unexpired JWT) plus the frontend's
// confirmation dialog.
router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.sellerId);
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    if (seller.passwordHash) {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: "Password is required to delete your account" });
      }
      const match = await bcrypt.compare(password, seller.passwordHash);
      if (!match) {
        return res.status(401).json({ error: "Incorrect password" });
      }
    }

    await Description.deleteMany({ seller: seller._id });
    await Seller.deleteOne({ _id: seller._id });

    res.status(200).json({ message: "Account and all associated data deleted" });
  } catch (err) {
    next(err);
  }
});

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const pendingStates = new Set();

router.get("/google", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  pendingStates.add(state);
  setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000);

  const url = googleClient.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
  });

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${frontendOrigin}/oauth/callback?error=${encodeURIComponent(error)}`);
  }
  if (!code || !state || !pendingStates.has(state)) {
    return res.redirect(`${frontendOrigin}/oauth/callback?error=invalid_state`);
  }
  pendingStates.delete(state);

  try {
    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    if (!email) {
      return res.redirect(`${frontendOrigin}/oauth/callback?error=no_email`);
    }

    let seller = await Seller.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (!seller) {
      seller = await Seller.create({
        businessName: name || email.split("@")[0],
        email: email.toLowerCase(),
        googleId,
        authProvider: "google",
      });
    } else if (!seller.googleId) {
      seller.googleId = googleId;
      await seller.save();
    }

    const token = signToken(seller._id);
    res.redirect(`${frontendOrigin}/oauth/callback?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    res.redirect(`${frontendOrigin}/oauth/callback?error=oauth_failed`);
  }
});

module.exports = router;