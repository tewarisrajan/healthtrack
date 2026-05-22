const express = require("express");
const router = express.Router();
const { simulateDiagnosis, extractStructuredData } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// We secure it so only logged-in users (patients) can interact with the AI
router.post("/simulate", protect, simulateDiagnosis);
router.post("/extract-structured/:recordId", protect, extractStructuredData);

module.exports = router;
