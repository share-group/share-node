const path = require('path');
const fs = require('fs');

const logger = getLogger('core.websocket');

module.exports = function (server, auth) {
  const io = require('socket.io').listen(
    server,
    {origins: '*:*', transports: ['websocket', 'polling']},
  );
  logger.info(`websocket server start success, running at ws://127.0.0.1:${share.config.port}`);

  io.on('connection', (socket) => {
    logger.info('a user connected', socket.id);
  });

  // load config's middlewares
  share.config.websocketMiddleware.forEach((m) => {
    let who = 'app';
    let mFile = `${share.APP_PATH}app${path.sep}middleware${path.sep}${m}.js`;
    if (!fs.existsSync(mFile)) {
      who = 'framework';
      mFile = `${share.FRAMEWORK_PATH}lib${path.sep}middleware${path.sep}${m}.js`;
    }
    io.use(require(mFile)(io));
    logger.info(`require ${who} middleware: ${m}`);
    return m;
  });

  io.on('connect', (socket) => {
    if (typeof auth === 'function') {
      console.log('1');
    }

    socket.on('disconnect', () => {
      logger.info(`client ${socket.id} disconnected`);
    });
    logger.info(`client ${socket.id} connected`);
  });

  global.getWebsocket = function () {
    return io;
  };
};
