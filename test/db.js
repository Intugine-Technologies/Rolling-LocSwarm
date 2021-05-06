const mongo = require('@intugine-technologies/mongodb');
require('dotenv-json')();

exports.getDB = () =>
  new Promise((resolve, reject) => {
    mongo(process.env.DB_URI, process.env.DB_NAME)
      .then((DB) => {
        resolve(DB);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
