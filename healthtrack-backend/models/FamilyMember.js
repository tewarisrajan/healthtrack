const createDatastore = require("../config/db");

const familyMembers = createDatastore("familyMembers");

// Index by user to quickly fetch a user's family
familyMembers.ensureIndex({ fieldName: "user" }, (err) => {
    if (err) console.error("Index error on familyMembers:", err);
});

module.exports = familyMembers;
