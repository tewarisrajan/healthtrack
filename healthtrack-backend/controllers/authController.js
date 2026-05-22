const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/authMiddleware");
const { verifyDoctor, STATE_MEDICAL_COUNCILS } = require("../services/nmcVerification");

// POST /api/login
const login = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res
            .status(400)
            .json({ success: false, message: "Email and password required" });
    }

    try {
        const user = await User.findOneAsync({ email, password });

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        // Generate actual JWT
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "30d",
        });

        return res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "PATIENT",
                profile: user.profile || {},
                abhaId: user.abhaId,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET /api/nmc/councils - Return list of State Medical Councils
const getStateMedicalCouncils = (req, res) => {
    return res.json({ success: true, data: STATE_MEDICAL_COUNCILS });
};

// POST /api/nmc/verify - Verify a doctor's registration against the IMR
const verifyNMCRegistration = async (req, res) => {
    const { registrationNumber, stateMedicalCouncil } = req.body || {};

    if (!registrationNumber || !stateMedicalCouncil) {
        return res.status(400).json({
            success: false,
            message: "Registration number and State Medical Council are required."
        });
    }

    try {
        const result = await verifyDoctor(registrationNumber, stateMedicalCouncil);

        if (!result.verified) {
            return res.status(400).json({
                success: false,
                message: result.reason,
                doctorDetails: result.doctorDetails || null
            });
        }

        return res.json({
            success: true,
            message: "Doctor verified successfully against the Indian Medical Register.",
            data: result.doctorDetails
        });
    } catch (err) {
        console.error("NMC Verification Error:", err);
        return res.status(500).json({ success: false, message: "Verification service unavailable. Please try again later." });
    }
};

// POST /api/register/doctor
const registerDoctor = async (req, res) => {
    const { name, email, password, specialization, hospital, registrationNumber, stateMedicalCouncil, qualification } = req.body || {};

    if (!name || !email || !password || !registrationNumber || !stateMedicalCouncil) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // Step 1: Verify against the Indian Medical Register
        const verification = await verifyDoctor(registrationNumber, stateMedicalCouncil);
        if (!verification.verified) {
            return res.status(400).json({
                success: false,
                message: verification.reason
            });
        }

        // Step 2: Check if a doctor with this registration already exists
        const existingDoctor = await User.findOneAsync({ "profile.registrationNumber": registrationNumber });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "A doctor with this registration number is already registered on HealthTrack." });
        }

        // Step 3: Check if email is already in use
        const existingUser = await User.findOneAsync({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        // Step 4: Create the verified doctor account
        const newUser = {
            name,
            email,
            password,
            role: "DOCTOR",
            nmcVerified: true,
            profile: {
                specialization: specialization || verification.doctorDetails.qualification || "General Practitioner",
                hospital: hospital || "Independent",
                registrationNumber,
                stateMedicalCouncil,
                qualification: qualification || verification.doctorDetails.qualification,
                yearOfRegistration: verification.doctorDetails.yearOfRegistration,
                // Keep the old field for backward compatibility
                licenseNumber: registrationNumber
            }
        };

        const user = await User.insertAsync(newUser);

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "30d",
        });

        return res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { login, registerDoctor, verifyNMCRegistration, getStateMedicalCouncils };
