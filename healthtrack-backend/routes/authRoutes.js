const express = require("express");
const router = express.Router();
const { login, registerDoctor } = require("../controllers/authController");

router.post("/login", login);
router.post("/register/doctor", registerDoctor);

module.exports = router;
