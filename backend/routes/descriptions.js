const express = require("express");
const router = express.Router();
const { descriptions, generateId } = require("../data");

function mockGenerate(notes, tone) {
  const prefix = { friendly: "You'll love", professional: "Introducing", festive: "Celebrate with" }[tone] || "Discover";
  return `${prefix} — ${notes.trim()}. A product your customers will remember.`;
}

// GET /api/descriptions
router.get("/", (req, res) => {
  let result = [...descriptions];
  if (req.query.tone) result = result.filter((d) => d.tone === req.query.tone);
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.status(200).json({ count: result.length, data: result });
});

// GET /api/descriptions/search?q=
router.get("/search", (req, res) => {
  const q = (req.query.q || "").trim().toLowerCase();
  if (!q) return res.status(400).json({ error: "Query parameter q is required" });
  const results = descriptions.filter(
    (d) =>
      d.productName.toLowerCase().includes(q) ||
      d.rawNotes.toLowerCase().includes(q) ||
      d.generatedDescription.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
  );
  res.status(200).json({ count: results.length, query: q, data: results });
});

// GET /api/descriptions/:id
router.get("/:id", (req, res) => {
  const desc = descriptions.find((d) => d.id === req.params.id);
  if (!desc) return res.status(404).json({ error: `Description '${req.params.id}' not found` });
  res.status(200).json({ data: desc });
});

// POST /api/descriptions
router.post("/", (req, res) => {
  const { productName, category = "", tone = "friendly", price = "", rawNotes } = req.body;
  if (!productName || !rawNotes)
    return res.status(400).json({ error: "Validation failed", details: ["productName and rawNotes are required"] });
  const now = new Date().toISOString();
  const newDesc = {
    id: generateId(), productName: productName.trim(),
    category: category.trim(), tone, price: price.trim(),
    rawNotes: rawNotes.trim(),
    generatedDescription: mockGenerate(rawNotes, tone),
    createdAt: now, updatedAt: now,
  };
  descriptions.push(newDesc);
  res.status(201).json({ message: "Description created", data: newDesc });
});

// POST /api/descriptions/generate (preview only)
router.post("/generate", (req, res) => {
  const { rawNotes, tone = "friendly" } = req.body;
  if (!rawNotes) return res.status(400).json({ error: "rawNotes is required" });
  res.status(200).json({ data: { generatedDescription: mockGenerate(rawNotes, tone), tone } });
});

// PUT /api/descriptions/:id
router.put("/:id", (req, res) => {
  const idx = descriptions.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: `Description '${req.params.id}' not found` });
  const updated = { ...descriptions[idx], ...req.body, id: descriptions[idx].id,
    createdAt: descriptions[idx].createdAt, updatedAt: new Date().toISOString() };
  if (req.body.rawNotes || req.body.tone)
    updated.generatedDescription = mockGenerate(updated.rawNotes, updated.tone);
  descriptions[idx] = updated;
  res.status(200).json({ message: "Updated", data: updated });
});

// DELETE /api/descriptions/:id
router.delete("/:id", (req, res) => {
  const idx = descriptions.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: `Description '${req.params.id}' not found` });
  descriptions.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;