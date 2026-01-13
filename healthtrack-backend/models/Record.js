const createDatastore = require("../config/db");

const records = createDatastore("records");

module.exports = records;
