const LOGGER = getLogger('core.middleware.socket');
const fs = require('fs');
const path = require('path');

function log(...str) {
  if (share.config.requestLog) {
    LOGGER.info(...str);
  }
}

module.exports = () => {
  const socketHandlerPath = `${share.APP_PATH}app${path.sep}socket${path.sep}`;
  const exists = fs.existsSync(socketHandlerPath);
  log(socketHandlerPath);
  log(exists);
  log(fs.existsSync(socketHandlerPath));

  return async function (socket, next) {
    log('moddleware - 1', socket.id);
    next();
  };
};
