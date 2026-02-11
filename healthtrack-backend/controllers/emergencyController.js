const crypto = require("crypto");
const EmergencyProfile = require("../models/EmergencyProfile");

// GET /api/emergency/:userId
const getEmergencyProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const profile = await EmergencyProfile.findOneAsync({ user: userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Emergency profile not found",
            });
        }

        return res.json({
            success: true,
            data: profile,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET /api/emergency/public/:publicId
const getPublicProfile = async (req, res) => {
    const { publicId } = req.params;

    try {
        const profile = await EmergencyProfile.findOneAsync({ publicId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Public profile not found",
            });
        }

        // Return only critical, non-sensitive data, filtered by visibility
        const visibility = profile.visibility || {
            bloodGroup: true,
            allergies: true,
            chronicConditions: true,
            medications: true,
            emergencyContacts: true
        };

        const publicData = {
            name: profile.name,
            lastUpdated: profile.updatedAt,
        };

        if (visibility.bloodGroup) publicData.bloodGroup = profile.bloodGroup;
        if (visibility.allergies) publicData.allergies = profile.allergies;
        if (visibility.chronicConditions) publicData.chronicConditions = profile.chronicConditions;
        if (visibility.medications) publicData.medications = profile.medications;
        if (visibility.emergencyContacts) publicData.emergencyContacts = profile.emergencyContacts;

        return res.json({
            success: true,
            data: publicData,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// POST /api/emergency/:userId
const updateEmergencyProfile = async (req, res) => {
    const { userId } = req.params;
    const body = req.body || {};

    try {
        // Find existing to keep the publicId if it exists
        const existing = await EmergencyProfile.findOneAsync({ user: userId });
        const publicId = existing?.publicId || crypto.randomBytes(6).toString("hex");

        const profileData = {
            user: userId,
            publicId,
            name: body.name || "User",
            bloodGroup: body.bloodGroup || "Pending",
            allergies: body.allergies || [],
            chronicConditions: body.chronicConditions || [],
            medications: body.medications || [],
            emergencyContacts: body.emergencyContacts || [],
            visibility: body.visibility || {
                bloodGroup: true,
                allergies: true,
                chronicConditions: true,
                medications: true,
                emergencyContacts: true,
            },
            updatedAt: new Date(),
        };

        const { affectedDocuments } = await EmergencyProfile.updateAsync(
            { user: userId },
            { $set: profileData },
            { upsert: true, returnUpdatedDocs: true }
        );

        return res.json({
            success: true,
            message: "Emergency profile updated",
            data: affectedDocuments,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getEmergencyProfile,
    getPublicProfile,
    updateEmergencyProfile,
};
