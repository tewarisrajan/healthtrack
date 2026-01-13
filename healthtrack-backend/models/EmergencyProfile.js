const createDatastore = require("../config/db");

const emergencyProfiles = createDatastore("emergencyProfiles");

// Ensure user is unique (one profile per user)
emergencyProfiles.ensureIndex({ fieldName: "user", unique: true }, (err) => {
    if (err) console.error("Index error on emergencyProfiles:", err);
});

module.exports = emergencyProfiles;
