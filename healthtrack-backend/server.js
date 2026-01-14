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
app.use("/api/emergency/:userId", emergencyRoutes); // emergency routes expects :userId
app.use("/api/upload", uploadRoutes);

// Root
app.get("/", (req, res) => {
  res.send("HealthTrack backend is running with NeDB (Modular Structure)");
});

app.listen(PORT, () => {
  console.log(`✅ HealthTrack backend running at http://localhost:${PORT}`);
});
