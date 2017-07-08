const events = require('events');
const path = require('path');
const fs = require('fs');

const emitter = new events.EventEmitter();
emitter.on('bootstrap', () => {
  const bootstrapPath = `${share.APP_PATH}app${path.sep}bootstrap`;
  if (!fs.existsSync(bootstrapPath)) {
    return;
  }
  // auto load some bootstrap after server start
  fs.readdirSync(bootstrapPath).filter((v) => require(`${bootstrapPath}${path.sep}${v}`));
});
module.exports = emitter;