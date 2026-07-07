const mongoose = require("mongoose");

// ─── MongoDB connection ─────────────────────────────────────────────────────
// Reads MONGO_URI from .env. Never hardcode real credentials here — see
// .env.example for the variable name and README for setup instructions.
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "\n❌ MONGO_URI is not set. Copy .env.example to .env and fill in your connection string.\n"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;