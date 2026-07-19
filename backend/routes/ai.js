const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { aiGenerateLimiter } = require("../middleware/rateLimiter");
const { generateDescription, GeminiError } = require("../services/geminiService");

// Every route below requires a logged-in seller.
router.use(requireAuth);

// ─── POST /api/ai/generate-description ───────────────────────────────────────
// Takes the same fields as the "New product description" form and returns an
// AI-written description. This does NOT save anything — it's a preview the
// frontend shows in the modal; the seller still has to click "Save" (which
// hits POST /api/descriptions separately) to persist it.
router.post("/generate-description", aiGenerateLimiter, async (req, res, next) => {
  try {
    const { productName, category, price, tone, rawNotes } = req.body;

    if (!productName || !productName.trim()) {
      return res.status(400).json({ error: "productName is required" });
    }
    if (!rawNotes || !rawNotes.trim()) {
      return res.status(400).json({ error: "rawNotes is required" });
    }

    const validTones = ["friendly", "professional", "festive"];
    const safeTone = validTones.includes(tone) ? tone : "friendly";

    const generatedDescription = await generateDescription({
      productName: productName.trim(),
      category: (category || "").trim(),
      price: (price || "").trim(),
      tone: safeTone,
      rawNotes: rawNotes.trim(),
    });

    res.status(200).json({ data: { generatedDescription, tone: safeTone } });
  } catch (err) {
    if (err instanceof GeminiError) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

module.exports = router;