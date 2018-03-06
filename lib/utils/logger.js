const fs = require('fs');
const mkdirp = require('mkdirp');
const log4js = require('log4js');

const path = `${share.APP_PATH}/log`;
if (!fs.existsSync(path)) {
  mkdirp.sync(path);
}
log4js.configure(share.config.log4js);
const logger = log4js.getLogger('core.console');
console.log = logger.info.bind(logger);
console.error = logger.error.bind(logger);
module.exports = log4js;
