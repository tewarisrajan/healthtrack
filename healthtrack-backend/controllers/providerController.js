const User = require("../models/User");
const Record = require("../models/Record");

// GET /api/provider/stats
const getProviderStats = async (req, res) => {
    try {
        const providerName = req.user.name;

        // Count records issued by this provider
        const recordsIssued = await Record.countAsync({ providerName });

        // Count doctors associated with this provider
        const activeStaff = await User.countAsync({ 
            role: "DOCTOR", 
            "profile.hospital": providerName 
        });

        // Some mock metrics for the remaining stats
        const dataIntegrity = "99.9%";
        const blockchainGas = "2.4 eth";

        return res.json({
            success: true,
            data: {
                recordsIssued,
                activeStaff,
                dataIntegrity,
                blockchainGas
            }
        });
    } catch (err) {
        console.error("Provider Stats Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET /api/provider/staff
const getProviderStaff = async (req, res) => {
    try {
        const providerName = req.user.name;

        const staff = await User.findAsync(
            { role: "DOCTOR", "profile.hospital": providerName }
        );

        const transformed = staff.map(doctor => ({
            id: doctor._id,
            name: doctor.name,
            specialization: doctor.profile.specialization,
            licenseNumber: doctor.profile.licenseNumber
        }));

        return res.json({
            success: true,
            data: transformed
        });
    } catch (err) {
        console.error("Provider Staff Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// POST /api/provider/issue-record
const issueRecord = async (req, res) => {
    const { patientEmail, title, type, fileUrl, fileHash, extractedText } = req.body || {};

    if (!patientEmail || !title || !type) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const patient = await User.findOneAsync({ email: patientEmail, role: "PATIENT" });

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found with this email" });
        }

        const newRecord = await Record.insertAsync({
            user: patient._id,
            title,
            type,
            providerName: req.user.name,
            fileUrl: fileUrl || null,
            fileHash: fileHash || null,
            extractedText: extractedText || null,
            blockchainVerified: true, // Assuming provider issuance implies verification
            createdAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            data: { ...newRecord, id: newRecord._id }
        });
    } catch (err) {
        console.error("Issue Record Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getProviderStats,
    getProviderStaff,
    issueRecord
};
