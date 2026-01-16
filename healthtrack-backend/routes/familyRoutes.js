const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    getFamilyMembers,
    addFamilyMember,
    toggleFamilyEmergency,
} = require("../controllers/familyController");

router.get("/", getFamilyMembers);
router.post("/", addFamilyMember);
router.patch("/:memberId/toggle-emergency", toggleFamilyEmergency);

module.exports = router;
