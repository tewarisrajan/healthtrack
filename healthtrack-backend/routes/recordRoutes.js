const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access userId
const {
    getRecords,
    getRecordById,
    createRecord,
    deleteRecord,
} = require("../controllers/recordController");

router.get("/", getRecords);
router.post("/", createRecord);
router.get("/:recordId", getRecordById);
router.delete("/:recordId", deleteRecord);

module.exports = router;
