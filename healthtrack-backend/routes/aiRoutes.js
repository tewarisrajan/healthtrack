const express = require("express");
const router = express.Router();
const { simulateDiagnosis } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// We secure it so only logged-in users (patients) can interact with the AI
router.post("/simulate", protect, simulateDiagnosis);

module.exports = router;
