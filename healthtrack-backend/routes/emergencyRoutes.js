const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    getEmergencyProfile,
    updateEmergencyProfile,
} = require("../controllers/emergencyController");

router.get("/", getEmergencyProfile);
router.post("/", updateEmergencyProfile);

module.exports = router;
