const createDatastore = require("../config/db");

const consents = createDatastore("consents");

// Index by doctorId and patientId for fast lookups
consents.ensureIndex({ fieldName: "doctorId" });
consents.ensureIndex({ fieldName: "patientId" });

// Compund index to ensure unique request per pair? 
// NeDB doesn't support compound unique indexes easily, so we handle logic in controller.

module.exports = consents;
