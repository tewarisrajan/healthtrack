const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getPatients, requestAccess, getPatientRecords, getDashboardStats } = require("../controllers/doctorController");

// All routes here are for DOCTORS
router.use(protect);
router.use(authorize("DOCTOR"));

router.get("/stats", getDashboardStats);
router.get("/patients", getPatients);
router.post("/patients/:patientId/request-access", requestAccess);
router.get("/patients/:patientId/records", getPatientRecords);

module.exports = router;
