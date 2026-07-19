const express = require("express");
const router = express.Router();
const Description = require("../models/Description");
const requireAuth = require("../middleware/auth");

// Every route below requires a logged-in seller. req.sellerId is set by requireAuth.
router.use(requireAuth);

function validate(body) {
  const errors = [];
  if (!body.productName || body.productName.trim() === "")
    errors.push("productName is required");
  if (!body.rawNotes || body.rawNotes.trim() === "")
    errors.push("rawNotes is required");
  const validTones = ["friendly", "professional", "festive"];
  if (body.tone && !validTones.includes(body.tone))
    errors.push(`tone must be one of: ${validTones.join(", ")}`);
  return errors;
}

function mockGenerate(notes, tone) {
  const prefix = {
    friendly: "You'll love",
    professional: "Introducing",
    festive: "Celebrate with",
  }[tone] || "Discover";
  return `${prefix} — ${notes.trim()}. A product your customers will remember.`;
}

router.get("/", async (req, res, next) => {
  try {
    const filter = { seller: req.sellerId };
    if (req.query.tone) filter.tone = req.query.tone;

    const result = await Description.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ count: result.length, data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res
        .status(400)
        .json({ error: "Query parameter `q` is required for search" });
    }

    const regex = new RegExp(q, "i");
    const results = await Description.find({
      seller: req.sellerId,
      $or: [
        { productName: regex },
        { rawNotes: regex },
        { generatedDescription: regex },
        { category: regex },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({ count: results.length, query: q, data: results });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const desc = await Description.findOne({ _id: req.params.id, seller: req.sellerId });
    if (!desc) {
      return res
        .status(404)
        .json({ error: `Description with id '${req.params.id}' not found` });
    }
    res.status(200).json({ data: desc });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const errors = validate(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    const {
      productName,
      category = "",
      tone = "friendly",
      price = "",
      rawNotes,
      generatedDescription, // present only if the seller used "Generate with Gemini" first
    } = req.body;

    // No AI generation step used → the description is just the seller's own
    // notes, verbatim. This is intentionally NOT the old mockGenerate template —
    // if they didn't ask for AI help, they get exactly what they wrote.
    const finalDescription =
      generatedDescription && generatedDescription.trim()
        ? generatedDescription.trim()
        : rawNotes.trim();

    const newDesc = await Description.create({
      seller: req.sellerId,
      productName: productName.trim(),
      category: category.trim(),
      tone,
      price: price.trim(),
      rawNotes: rawNotes.trim(),
      generatedDescription: finalDescription,
    });

    res.status(201).json({ message: "Description created", data: newDesc });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const current = await Description.findOne({ _id: req.params.id, seller: req.sellerId });
    if (!current) {
      return res
        .status(404)
        .json({ error: `Description with id '${req.params.id}' not found` });
    }

    const updates = { ...req.body };
    delete updates.id;
    delete updates._id;
    delete updates.seller; // ownership is immutable

    if (updates.generatedDescription === undefined &&
        (updates.rawNotes !== undefined || updates.tone !== undefined)) {
      // rawNotes or tone changed but no new AI/manual description was supplied
      // alongside it — fall back to the (possibly edited) raw notes verbatim,
      // same rule as creation: no AI used means the notes ARE the description.
      const nextNotes = updates.rawNotes !== undefined ? updates.rawNotes : current.rawNotes;
      updates.generatedDescription = nextNotes.trim();
    }

    Object.assign(current, updates);
    await current.save();

    res.status(200).json({ message: "Description updated", data: current });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Description.findOneAndDelete({
      _id: req.params.id,
      seller: req.sellerId,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ error: `Description with id '${req.params.id}' not found` });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post("/generate", (req, res) => {
  const { rawNotes, tone = "friendly" } = req.body;
  if (!rawNotes || rawNotes.trim() === "") {
    return res.status(400).json({ error: "rawNotes is required to generate" });
  }
  res.status(200).json({
    data: { generatedDescription: mockGenerate(rawNotes, tone), tone },
  });
});

module.exports = router;