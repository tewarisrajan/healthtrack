const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access userId
const {
    getRecords,
    getRecordById,
    createRecord,
    deleteRecord,
} = require("../controllers/recordController");

const validate = require("../middleware/validate");
const { createRecordSchema } = require("../schemas/recordSchema");

router.get("/", getRecords);
router.post("/", validate(createRecordSchema), createRecord);
router.get("/:recordId", getRecordById);
router.delete("/:recordId", deleteRecord);

module.exports = router;
