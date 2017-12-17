const applicationName = require(`${share.APP_PATH}/package.json`).name || 'application';
const fs = require('fs');
const tracer = require('tracer');

const path = `${share.APP_PATH}/log`;
if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}

let Logger = tracer.colorConsole({ level: 'all'});

Logger = tracer.dailyfile({
  root: path,
  maxLogFiles: 10,
  allLogsFileName: `${applicationName}-${share.config.port}-all`,
  level: share.config.logger.level,
  dateformat: 'yyyy-mm-dd HH:MM:ss',
  inspectOpt: {
    showHidden: false,
    depth: 3,
  },
  transport(data) {
    console.log(data.output);
  },
});

module.exports = Logger;
