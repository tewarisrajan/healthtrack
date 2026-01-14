const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Assuming this is run from the root, but let's be safe relative to cwd
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "No file uploaded" });
    }
    // Return URL relative to server root
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ success: true, fileUrl });
});

module.exports = router;
