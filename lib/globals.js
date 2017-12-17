// share-node framework global functions
const path = require('path');
const logger = require('./utils/logger');

/**
 * get a controller
 * @param name
 */
global.getController = function (name) {
  // if name is empty, require base controller
  const controllerPath = name || `${share.FRAMEWORK_PATH}lib${path.sep}base${path.sep}controller`;
  return require(controllerPath);
};

/**
 * get a validate
 * @param name
 */
global.getValidate = function (name) {
  // if name is empty, require base validate
  const validatePath = name || `${share.FRAMEWORK_PATH}lib${path.sep}base${path.sep}validate`;
  return require(validatePath) || null;
};

/**
 * get logger instance
 */
global.getLogger = function () {
  return logger;
};
