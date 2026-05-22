const express = require("express");
const router = express.Router();
const { getProviderStats, getProviderStaff, issueRecord } = require("../controllers/providerController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All provider routes are protected and restricted to PROVIDER role
router.use(protect);
router.use(authorize("PROVIDER"));

router.get("/stats", getProviderStats);
router.get("/staff", getProviderStaff);
router.post("/issue-record", issueRecord);

module.exports = router;
