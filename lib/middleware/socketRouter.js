const LOGGER = getLogger('core.middleware.socketRouter');
const fs = require('fs');
const path = require('path');

module.exports = () => {
  const socketHandlerPath = `${share.APP_PATH}app${path.sep}websocket${path.sep}`;
  const exists = fs.existsSync(socketHandlerPath);
  if (!exists) {
    LOGGER.error(`can not find app websocket sandlers path: ${socketHandlerPath}`);
    process.exit(1);
  }

  function registerEventName(socket) {
    // 扫描控制层，自动注册所有控制层的方法，作为websocket的事件
    const controllers = fs.readdirSync(socketHandlerPath);
    for (const controller of controllers) {
      const Loader = require(`${socketHandlerPath}${controller}`);
      const functions = Loader.toString().trim();
      const handlers = functions.split('async');
      handlers.shift();
      for (const handler of handlers) {
        let funcName = handler.substr(0, handler.indexOf('{')).trim();
        funcName = funcName.substr(0, funcName.indexOf('(')).trim();
        const eventName = `${controller.replace('.js', '')}.${funcName}`;
        socket.on(eventName, async (data) => {
          const instance = new (Loader)(eventName);
          const result = await instance[funcName](socket, data);
          if (result) {
            socket.emit(eventName, result);
          }
        });
        LOGGER.trace(`register event name: ${eventName}`);
      }
    }
  }

  return async function (socket, next) {
    registerEventName(socket);
    // LOGGER.info('log.save', socket.id);
    // socket.on('log.save', async (data) => {
    //   LOGGER.info('log.save', data);
    // });
    await next();
  };
};
