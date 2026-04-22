const express = require("express");
const multer = require("multer");
const storageService = require("../utils/storage");
const { generateHash } = require("../utils/hasher");
const { extractTextFromBuffer } = require("../utils/ocrService");

const router = express.Router();

// Multer configured for Memory Storage
// This allows us to pipe the buffer to our custom StorageService
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload
router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "No file uploaded" });
    }

    try {
        // Generate cryptographic fingerprint (SHA-256)
        const fileHash = generateHash(req.file.buffer);

        // Run Smart Document Parsing (OCR) asynchronously while uploading
        const ocrPromise = extractTextFromBuffer(req.file.buffer, req.file.mimetype);

        // Use the adapter service to handle persistence
        const uploadPromise = storageService.uploadFile(req.file);

        const [extractedText, result] = await Promise.all([ocrPromise, uploadPromise]);

        return res.json({
            success: true,
            fileUrl: result.url,
            filename: result.filename,
            fileHash: fileHash,
            extractedText: extractedText
        });
    } catch (err) {
        console.error("Upload Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to persist file to storage."
        });
    }
});

module.exports = router;
