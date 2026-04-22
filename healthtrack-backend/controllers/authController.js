const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/authMiddleware");

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

// POST /api/register/doctor
const registerDoctor = async (req, res) => {
    const { name, email, password, specialization, hospital, licenseNumber } = req.body || {};

    if (!name || !email || !password || !licenseNumber) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Option A: Regex validation for Verified ID (e.g. MED-12345)
    const licensePattern = /^MED-\d+$/;
    if (!licensePattern.test(licenseNumber)) {
        return res.status(400).json({ success: false, message: "Invalid Medical License Number format. Must start with 'MED-' followed by digits." });
    }

    try {
        const existingUser = await User.findOneAsync({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const newUser = {
            name,
            email,
            password,
            role: "DOCTOR",
            profile: {
                specialization: specialization || "General Practitioner",
                hospital: hospital || "Independent",
                licenseNumber
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

module.exports = { login, registerDoctor };
