const Nedb = require("@seald-io/nedb");
const path = require("path");

const createDatastore = (name) => {
  const db = new Nedb({
    filename: path.join(__dirname, `../data/${name}.db`),
    autoload: true,
  });

  return db;
};

module.exports = createDatastore;
