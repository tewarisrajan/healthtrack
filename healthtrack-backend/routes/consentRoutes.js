const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getPendingRequests, updateConsentStatus } = require("../controllers/consentController");

// All routes here are for PATIENTS to manage their consents
router.use(protect);
router.use(authorize("PATIENT"));

router.get("/pending", getPendingRequests);
router.put("/:requestId", updateConsentStatus);

module.exports = router;
