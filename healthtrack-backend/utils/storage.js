const fs = require("fs");
const path = require("path");

/**
 * Storage Adapter Interface/Base Class
 */
class StorageAdapter {
    async save(file) {
        throw new Error("Method 'save()' must be implemented");
    }
    async getUrl(filename) {
        throw new Error("Method 'getUrl()' must be implemented");
    }
}

/**
 * Local Filesystem Adapter
 */
class LocalStorageAdapter extends StorageAdapter {
    constructor(uploadDir = "uploads") {
        super();
        this.uploadDir = uploadDir;
        // Ensure directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async save(file) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + "-" + file.originalname;
        const filePath = path.join(this.uploadDir, filename);

        // Write buffer to disk
        await fs.promises.writeFile(filePath, file.buffer);

        return {
            filename,
            path: filePath,
            url: `/uploads/${filename}`,
        };
    }

    async getUrl(filename) {
        return `/uploads/${filename}`;
    }
}

/**
 * S3 Adapter (Placeholder for future scale)
 */
class S3StorageAdapter extends StorageAdapter {
    async save(file) {
        console.log("S3 Storage Mock: Uploading", file.originalname);
        // Future implementation: AWS.S3.upload(...)
        return {
            filename: file.originalname,
            url: `https://mock-s3-bucket.s3.amazonaws.com/${file.originalname}`,
        };
    }
}

/**
 * Storage Service Factory
 */
class StorageService {
    constructor() {
        const provider = process.env.STORAGE_PROVIDER || "local";

        if (provider === "s3") {
            this.adapter = new S3StorageAdapter();
        } else {
            this.adapter = new LocalStorageAdapter();
        }
    }

    async uploadFile(file) {
        if (!file || !file.buffer) {
            throw new Error("Invalid file object. Buffer is required.");
        }
        return await this.adapter.save(file);
    }
}

module.exports = new StorageService();
