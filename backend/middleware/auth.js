const jwt = require("jsonwebtoken");

// ─── requireAuth ─────────────────────────────────────────────────────────────
// Expects header: Authorization: Bearer <token>
// On success, attaches req.sellerId for downstream routes to use.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.sellerId = payload.sellerId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;