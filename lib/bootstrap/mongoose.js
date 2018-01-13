const mongooseMap = new Map();

if (share.config.mongodb) {
  const logger = getLogger('core.bootstrap.mongoose');
  const mongoose = require('mongoose');
  mongoose.Promise = require('bluebird');
  mongoose.set('debug', share.config.mongodb.debug);

  const createConnection = function (url, options = {}) {
    const db = mongoose.createConnection(url, options);

    let _url = url;
    const index = _url.indexOf('@');
    if (index > -1) {
      _url = `mongodb://${_url.substring(index + 1)}`;
    }
    
    db.on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });

    db.on('disconnected', () => {
      logger.error(`disconnected ${_url}`);
    });

    db.on('connected', () => {
      logger.info(`connect ${_url} successfully`);
    });

    db.on('reconnected', () => {
      logger.info(`reconnect ${_url} successfully`);
    });

    return db;
  };

  // init all mongo connection
  share.config.mongodb.dbs.filter((mongodb) => {
    mongooseMap.set(mongodb.name, createConnection(mongodb.url, mongodb.options));
    return true;
  });
}

module.exports = mongooseMap;
