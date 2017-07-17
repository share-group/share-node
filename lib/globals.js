// share-node framework global functions
const log4js = require('log4js');
const path = require('path');

/**
 * get a file logger object
 * @param category define a category name by yourself or auto generated a category name
 * @example
 * // /srv/youproject/app/controller/user.js
 * const logger = getLogger();
 * logger.info('hellow world!');
 * // the console output:
 * [2017-07-08 09:49:58.029] [INFO] controller.user - hellow world!
 */
global.getLogger = function (category = '') {
  log4js.configure(share.config.log4js);
  const channel = category.replace(share.APP_PATH, '').replace('.js', '').trim();
  return log4js.getLogger(channel.split(path.sep).filter(item => !!item).join('.'));
};

/**
 * get a controller
 * @param name
 */
global.getController = function (name) {
  // if name is empty, require base controller
  const controllerPath = name || `${share.FRAMEWORK_PATH}lib${path.sep}base${path.sep}controller`;
  return require(controllerPath);
};
