const mongooseMap = new Map();

if (Array.isArray(share.config.mongodb)) {
  const logger = getLogger('share.mongoose');
  const mongoose = require('mongoose');
  mongoose.Promise = require('bluebird');

  const createConnection = function (url, options = {}) {
    const db = mongoose.createConnection(url, options);

    db.on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });

    db.on('disconnected', () => {
      logger.error(`disconnected ${url}`);
    });

    db.on('connected', () => {
      logger.info(`connect ${url} successfully`);
    });

    db.on('reconnected', () => {
      logger.info(`reconnect ${url} successfully`);
    });

    return db;
  };

  share.config.mongodb.filter((mongodb) => {
    mongooseMap.set(mongodb.name, createConnection(mongodb.url, mongodb.options));
    return true;
  });
}

module.exports = mongooseMap;
