const crypto = require("crypto");

/**
 * Generates a SHA-256 hash of a file buffer
 * @param {Buffer} buffer 
 * @returns {string} hex hash
 */
const generateHash = (buffer) => {
    if (!buffer) return null;
    return crypto.createHash("sha256").update(buffer).digest("hex");
};

module.exports = { generateHash };
