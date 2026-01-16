const storageService = require("../utils/storage");
const hasher = require("../utils/hasher");
const fs = require("fs");
const path = require("path");

async function testStorage() {
    console.log("🧪 Testing Storage Adapter System...");

    const mockFile = {
        originalname: "test-record.pdf",
        buffer: Buffer.from("mock-pdf-content"),
        mimetype: "application/pdf"
    };

    try {
        // 1. Test Hashing
        const hash = hasher.generateHash(mockFile.buffer);
        console.log("✅ Hashing Success:", hash);
        if (!hash || hash.length !== 64) throw new Error("Invalid hash generated");

        // 2. Test Local Storage Saving
        console.log("Saving file via StorageService...");
        const result = await storageService.uploadFile(mockFile);

        console.log("✅ Save Success:", result);

        // Verify file exists on disk
        if (!fs.existsSync(result.path)) {
            throw new Error(`File not found at ${result.path}`);
        }

        console.log("✅ File Verification Success");

        // Clean up
        fs.unlinkSync(result.path);
        console.log("🧹 Cleanup complete.");

    } catch (err) {
        console.error("❌ Test Failed:", err);
        process.exit(1);
    }
}

testStorage();
