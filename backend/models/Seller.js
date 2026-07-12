const mongoose = require("mongoose");

// ─── Seller schema ───────────────────────────────────────────────────────────
// A seller is the account that logs in and owns a set of product descriptions.
// Passwords are always stored as bcrypt hashes — never plaintext.
//
// A seller can sign up either with email+password, or via Google OAuth.
// - Local accounts: passwordHash is set, googleId is null.
// - Google accounts: googleId is set, passwordHash is null.
// authProvider tracks which flow created the account, mainly for UI/debugging.
const sellerSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "businessName is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "email must be a valid email address"],
    },
    passwordHash: {
      type: String,
      default: null, // null for Google-only accounts
    },
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true, // allows many docs with googleId: null
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// Never send the password hash back in API responses.
sellerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("Seller", sellerSchema);