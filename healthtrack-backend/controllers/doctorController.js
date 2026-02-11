const User = require("../models/User");
const Record = require("../models/Record");
const Consent = require("../models/Consent");

// GET /api/doctor/patients?search=query
const getPatients = async (req, res) => {
    const { search } = req.query;
    let query = { role: "PATIENT" };

    if (search) {
        // Simple regex search on name or email
        const searchRegex = new RegExp(search, "i");
        query = {
            role: "PATIENT",
            $or: [{ name: searchRegex }, { email: searchRegex }]
        };
    }

    try {
        // NeDB doesn't support projection in findAsync easily if not wrapped, 
        // so we fetch and map.
        const patients = await User.findAsync(query);

        // For each patient, check if there's an existing consent status for this doctor
        const patientsWithStatus = await Promise.all(patients.map(async (p) => {
            const consent = await Consent.findOneAsync({
                doctorId: req.user._id,
                patientId: p._id
            });

            return {
                id: p._id,
                name: p.name,
                email: p.email,
                consentStatus: consent ? consent.status : "NONE"
            };
        }));

        res.json({ success: true, data: patientsWithStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// POST /api/doctor/patients/:patientId/request-access
const requestAccess = async (req, res) => {
    const { patientId } = req.params;

    try {
        const patient = await User.findOneAsync({ _id: patientId, role: "PATIENT" });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        // Check if request already exists
        const existing = await Consent.findOneAsync({
            doctorId: req.user._id,
            patientId: patientId
        });

        if (existing) {
            // If it was rejected, maybe we want to allow re-request? 
            // For now, if it's PENDING or APPROVED, return existing status.
            if (existing.status === 'PENDING' || existing.status === 'APPROVED') {
                return res.status(400).json({
                    success: false,
                    message: `Request already exists with status: ${existing.status}`
                });
            }
            // If REJECTED, we update to PENDING (re-request)
            await Consent.updateAsync(
                { _id: existing._id },
                { $set: { status: "PENDING", updatedAt: new Date() } }
            );
            return res.json({ success: true, message: "Access request sent (Re-requested)" });
        }

        // Create new request
        await Consent.insertAsync({
            doctorId: req.user._id,
            patientId: patientId,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.json({ success: true, message: "Access request sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET /api/doctor/patients/:patientId/records
// STRICTLY PROTECTED BY CONSENT
const getPatientRecords = async (req, res) => {
    const { patientId } = req.params;

    try {
        // 1. Verify Consent
        const consent = await Consent.findOneAsync({
            doctorId: req.user._id,
            patientId: patientId,
            status: "APPROVED"
        });

        if (!consent) {
            return res.status(403).json({
                success: false,
                message: "Access Denied. You do not have approved consent to view this patient's records."
            });
        }

        // 2. Fetch Records
        const records = await Record.findAsync({ user: patientId }).sort({ createdAt: -1 });
        const transformed = records.map((r) => ({ ...r, id: r._id }));

        res.json({ success: true, data: transformed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET /api/doctor/stats
const getDashboardStats = async (req, res) => {
    try {
        const doctorId = req.user._id;

        // 1. Total Unique Patients (from Consents)
        // NeDB doesn't have distinct(), so we fetch all consents for this doctor
        const allConsents = await Consent.findAsync({ doctorId });

        // Count unique patientIds
        const uniquePatients = new Set(allConsents.map(c => c.patientId)).size;

        // 2. Active Consents
        const activeConsents = allConsents.filter(c => c.status === 'APPROVED').length;

        // 3. Pending Requests
        const pendingRequests = allConsents.filter(c => c.status === 'PENDING').length;

        // 4. Recent Activity (Last 5 updates)
        // We need to fetch patient details for these
        const recentConsents = await Consent.findAsync({ doctorId })
            .sort({ updatedAt: -1 })
            .limit(5);

        const recentActivity = await Promise.all(recentConsents.map(async (c) => {
            const patient = await User.findOneAsync({ _id: c.patientId });
            return {
                id: c._id,
                patientName: patient ? patient.name : 'Unknown',
                status: c.status,
                updatedAt: c.updatedAt || c.createdAt
            };
        }));

        res.json({
            success: true,
            data: {
                totalPatients: uniquePatients,
                activeConsents,
                pendingRequests,
                todaysAppointments: 0, // Mock for now
                recentActivity
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getPatients,
    requestAccess,
    getPatientRecords,
    getDashboardStats
};
