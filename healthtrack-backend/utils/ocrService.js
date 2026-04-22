const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

/**
 * Extracts text from a document buffer.
 * Supports image files (via Tesseract.js) and PDFs (via pdf-parse).
 * 
 * @param {Buffer} buffer - The file buffer
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<string|null>} - The extracted text, or null if unsupported/failed
 */
const extractTextFromBuffer = async (buffer, mimeType) => {
    try {
        if (!buffer || buffer.length === 0) {
            console.log("[OCR Service] Empty buffer provided");
            return null;
        }

        console.log(`[OCR Service] Processing file of type: ${mimeType} (${buffer.length} bytes)`);

        if (mimeType === "application/pdf") {
            // Process PDF
            try {
                const data = await pdfParse(buffer);
                const text = data.text ? data.text.trim() : null;
                console.log(`[OCR Service] PDF parsing complete. Length: ${text ? text.length : 0}`);
                return text;
            } catch (pdfErr) {
                console.error("[OCR Service] PDF parsing failed:", pdfErr.message);
                return null;
            }
        } else if (mimeType.startsWith("image/")) {
            // Process Image via OCR
            try {
                const result = await Tesseract.recognize(
                    buffer,
                    "eng",
                    { 
                        logger: m => {
                            if (m.status === "recognizing text") {
                                // Only log periodically to avoid spam
                                if (Math.round(m.progress * 100) % 25 === 0) {
                                    console.log(`[OCR] ${m.status}: ${(m.progress * 100).toFixed(0)}%`);
                                }
                            }
                        } 
                    }
                );
                const text = result.data.text ? result.data.text.trim() : null;
                console.log(`[OCR Service] Image OCR complete. Length: ${text ? text.length : 0}`);
                return text;
            } catch (tessErr) {
                console.error("[OCR Service] Tesseract OCR failed:", tessErr.message);
                return null;
            }
        }

        console.log(`[OCR Service] Unsupported MIME type: ${mimeType}`);
        return null;
    } catch (err) {
        console.error("[OCR Service] Critical error during extraction:", err);
        return null;
    }
};

module.exports = {
    extractTextFromBuffer,
};
