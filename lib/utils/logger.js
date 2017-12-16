const applicationName = require(`${share.APP_PATH}/package.json`).name || 'application';
const tracer = require('tracer');

let Logger = tracer.colorConsole({ level: 'debug' });

Logger = tracer.dailyfile({
  root: `${share.APP_PATH}/log`,
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
