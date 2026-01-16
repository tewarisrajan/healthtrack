const express = require("express");
const router = express.Router();
const { getAuditLogs, logAccess } = require("../controllers/auditController");

router.get("/:recordId", getAuditLogs);
router.post("/:recordId", (req, res) => {
    const { recordId } = req.params;
    const { viewerId, action, username } = req.body;
    logAccess(recordId, viewerId || "anonymous", action || "VIEWED", username);
    res.json({ success: true });
});

module.exports = router;
