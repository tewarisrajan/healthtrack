const createDatastore = require("../config/db");

const auditLogs = createDatastore("auditLogs");

// Index by recordId to see all access for a specific document
auditLogs.ensureIndex({ fieldName: "recordId" }, (err) => {
    if (err) console.error("Index error on auditLogs:", err);
});

module.exports = auditLogs;
