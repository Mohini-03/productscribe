const mongoose = require("mongoose");

// ─── Description schema ─────────────────────────────────────────────────────
// Each description belongs to exactly one Seller (one-to-many: Seller -> Descriptions).
const descriptionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: [true, "productName is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    tone: {
      type: String,
      enum: ["friendly", "professional", "festive"],
      default: "friendly",
    },
    price: {
      type: String,
      trim: true,
      default: "",
    },
    rawNotes: {
      type: String,
      required: [true, "rawNotes is required"],
      trim: true,
    },
    generatedDescription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("Description", descriptionSchema);