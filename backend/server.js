require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const descriptionsRouter = require("./routes/descriptions");
const aiRouter = require("./routes/ai");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) => {
  res.status(200).json({ app: "ProductScribe API", status: "running" });
});

app.use("/api/auth", authRouter);
app.use("/api/descriptions", descriptionsRouter);
app.use("/api/ai", aiRouter);

app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 ProductScribe API running on http://localhost:${PORT}`);
});