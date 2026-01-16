const Record = require("../models/Record");

// GET /api/users/:userId/records
const getRecords = async (req, res) => {
    const { userId } = req.params;
    try {
        const records = await Record.findAsync({ user: userId }).sort({ createdAt: -1 });
        const transformed = records.map((r) => ({ ...r, id: r._id }));
        return res.json({ success: true, data: transformed });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET /api/users/:userId/records/:recordId
const getRecordById = async (req, res) => {
    const { userId, recordId } = req.params;
    try {
        const record = await Record.findOneAsync({ _id: recordId, user: userId });

        if (!record) {
            return res
                .status(404)
                .json({ success: false, message: "Record not found" });
        }
        return res.json({ success: true, data: { ...record, id: record._id } });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// POST /api/users/:userId/records
const createRecord = async (req, res) => {
    const { userId } = req.params;
    const body = req.body || {};

    if (!body.title || !body.type || !body.providerName) {
        return res.status(400).json({
            success: false,
            message: "title, type and providerName are required",
        });
    }

    try {
        const newRecord = await Record.insertAsync({
            user: userId,
            title: body.title,
            type: body.type,
            providerName: body.providerName,
            tags: body.tags || [],
            fileUrl: body.fileUrl || null,
            fileHash: body.fileHash || null,
            blockchainVerified: !!body.blockchainVerified,
            createdAt: new Date(),
        });

        return res
            .status(201)
            .json({ success: true, data: { ...newRecord, id: newRecord._id } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE /api/users/:userId/records/:recordId
const deleteRecord = async (req, res) => {
    const { userId, recordId } = req.params;

    try {
        const record = await Record.findOneAsync({ _id: recordId, user: userId });
        if (!record) {
            return res
                .status(404)
                .json({ success: false, message: "Record not found" });
        }

        await Record.removeAsync({ _id: recordId, user: userId }, {});

        return res.json({ success: true, data: { ...record, id: record._id } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getRecords,
    getRecordById,
    createRecord,
    deleteRecord,
};
