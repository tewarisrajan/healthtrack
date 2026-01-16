require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const seedData = require("./utils/seed");

// Routes
const authRoutes = require("./routes/authRoutes");
const recordRoutes = require("./routes/recordRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const familyRoutes = require("./routes/familyRoutes");
const auditRoutes = require("./routes/auditRoutes");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Run seed on startup
seedData();

// API Routes
app.use("/api", authRoutes); // /api/login
app.use("/api/users/:userId/records", recordRoutes);
app.use("/api/users/:userId/family", familyRoutes);
app.use("/api/emergency/:userId", emergencyRoutes); // emergency routes expects :userId
const { getPublicProfile } = require("./controllers/emergencyController");
app.get("/api/public/emergency/:publicId", getPublicProfile);
app.use("/api/upload", uploadRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/health", healthRoutes);

// 404 Catch-all
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error Handler (must be last)
app.use(errorHandler);

// Root
app.get("/", (req, res) => {
  res.send("HealthTrack backend is running with NeDB (Modular Structure)");
});

app.listen(PORT, () => {
  console.log(`✅ HealthTrack backend running at http://localhost:${PORT}`);
});
