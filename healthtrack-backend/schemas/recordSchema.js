const { z } = require("zod");

const createRecordSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        type: z.enum(["PRESCRIPTION", "LAB_REPORT", "SCAN", "CERTIFICATE", "VACCINATION", "BILL"]),
        providerName: z.string().min(2, "Provider name is required"),
        tags: z.array(z.string()).optional(),
        fileUrl: z.string().nullable().optional(),
        fileHash: z.string().nullable().optional(),
        blockchainVerified: z.boolean().optional(),
    }),
});

module.exports = { createRecordSchema };
