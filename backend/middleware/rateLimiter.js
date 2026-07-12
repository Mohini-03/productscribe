const rateLimit = require("express-rate-limit");

// ─── loginLimiter ─────────────────────────────────────────────────────────────
// Max 5 login attempts per 15 minutes per IP. This is the tight one — brute
// forcing a specific password is the main risk on /login.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again in a few minutes." },
});

// ─── registerLimiter ──────────────────────────────────────────────────────────
// Looser than login (10/15min) — registration doesn't have the same
// credential-guessing risk, but still needs a cap against automated signup spam.
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many signup attempts. Please try again in a few minutes." },
});

module.exports = { loginLimiter, registerLimiter };