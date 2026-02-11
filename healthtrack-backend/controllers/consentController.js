const Consent = require("../models/Consent");
const User = require("../models/User");

// GET /api/consent/pending
// Returns all PENDING requests for the logged-in patient
const getPendingRequests = async (req, res) => {
    try {
        const requests = await Consent.findAsync({
            patientId: req.user._id,
            status: "PENDING"
        });

        // Enrich with doctor details
        const enrichedRequests = await Promise.all(requests.map(async (request) => {
            const doctor = await User.findOneAsync({ _id: request.doctorId });
            return {
                id: request._id,
                doctorId: request.doctorId,
                doctorName: doctor ? doctor.name : "Unknown Doctor",
                status: request.status,
                createdAt: request.createdAt
            };
        }));

        res.json({ success: true, data: enrichedRequests });
    } catch (error) {
        console.error("Error fetching consent requests:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// PUT /api/consent/:requestId
// Approve or Reject a request
const updateConsentStatus = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body; // APPROVED or REJECTED

    if (!["APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    try {
        const consent = await Consent.findOneAsync({ _id: requestId, patientId: req.user._id });

        if (!consent) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        await Consent.updateAsync(
            { _id: requestId },
            { $set: { status, updatedAt: new Date() } }
        );

        res.json({ success: true, message: `Request ${status}` });
    } catch (error) {
        console.error("Error updating consent:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getPendingRequests,
    updateConsentStatus
};
