const auditLogs = require("../models/AuditLog");

// GET /api/audit/:recordId
exports.getAuditLogs = (req, res) => {
    const { recordId } = req.params;
    auditLogs.find({ recordId }).sort({ timestamp: -1 }).exec((err, docs) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: docs });
    });
};

// Internal function to log access
exports.logAccess = (recordId, viewerId, action, username) => {
    const entry = {
        recordId,
        viewerId,
        username: username || "System",
        action, // "VIEWED", "DOWNLOADED", etc.
        timestamp: new Date().toISOString(),
    };

    auditLogs.insert(entry, (err, doc) => {
        if (err) console.error("Failed to log audit entry:", err);
    });
};
