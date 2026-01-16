const express = require("express");
const router = express.Router();

// GET /api/health
router.get("/", (req, res) => {
    res.json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
        services: {
            database: "connected", // Simplified for NeDB
            storage: process.env.STORAGE_PROVIDER || "local"
        }
    });
});

module.exports = router;
