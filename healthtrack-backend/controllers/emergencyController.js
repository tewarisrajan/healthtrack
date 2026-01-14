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
            data: {
                name: profile.name,
                bloodGroup: profile.bloodGroup,
                allergies: profile.allergies,
                chronicConditions: profile.chronicConditions,
                medications: profile.medications,
                emergencyContacts: profile.emergencyContacts,
                lastUpdated: profile.updatedAt,
            },
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

    if (!body.bloodGroup) {
        return res
            .status(400)
            .json({ success: false, message: "bloodGroup is required" });
    }

    try {
        const profileData = {
            user: userId,
            name: body.name || "Unknown User",
            bloodGroup: body.bloodGroup,
            allergies: body.allergies || [],
            chronicConditions: body.chronicConditions || [],
            medications: body.medications || [],
            emergencyContacts: body.emergencyContacts || [],
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
    updateEmergencyProfile,
};
