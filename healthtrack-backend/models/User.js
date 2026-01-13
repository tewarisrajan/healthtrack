const createDatastore = require("../config/db");

const users = createDatastore("users");

// Ensure email is unique
users.ensureIndex({ fieldName: "email", unique: true }, (err) => {
    if (err) console.error("Index error on users:", err);
});

module.exports = users;
