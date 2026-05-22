const express = require("express");
const router = express.Router();
const { login, registerDoctor, verifyNMCRegistration, getStateMedicalCouncils } = require("../controllers/authController");

router.post("/login", login);
router.post("/register/doctor", registerDoctor);
router.get("/nmc/councils", getStateMedicalCouncils);
router.post("/nmc/verify", verifyNMCRegistration);

module.exports = router;
