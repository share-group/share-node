// share-node framework global functions
const path = require('path');
const logger = require('./utils/logger');

/**
 * get a logger
 * @param category
 */
global.getLogger = function (category = '') {
  const channel = category.replace(share.APP_PATH, '').replace('.js', '').trim();
  return logger.getLogger(channel.split(path.sep).filter(item => !!item).join('.'));
};

/**
 * get a controller
 * @param name
 */
global.getController = function (name) {
  // if name is empty, require base controller
  const controllerPath = name || `${share.FRAMEWORK_PATH}lib${path.sep}base${path.sep}controller`;
  return require(controllerPath) || null;
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
 * get a service
 * @param name
 */
global.getService = function (name) {
  if (name) {
    const modelPath = `${share.APP_PATH}app${path.sep}service${path.sep}${name}`;
    const Service = require(modelPath);
    return new Service(name);
  }
  return require(`${share.FRAMEWORK_PATH}lib${path.sep}base${path.sep}service`) || null;
};

/**
 * get a model
 * @param name model name
 * @param anotherName alias model name
 */
global.getModel = function (name, anotherName) {
  if (name) {
    const modelPath = `${share.APP_PATH}app${path.sep}model${path.sep}${name}`;
    const Model = require(modelPath);
    return new Model(name, anotherName);
  }
  return require(`${share.FRAMEWORK_PATH}lib${path.sep}base${path.sep}model`) || null;
};
