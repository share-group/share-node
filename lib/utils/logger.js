const applicationName = require(`${share.APP_PATH}/package.json`).name || 'application';
const fs = require('fs');
const log4js = require('log4js');

const path = `${share.APP_PATH}/log`;
if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}
log4js.configure(share.config.log4js);
module.exports = log4js;
