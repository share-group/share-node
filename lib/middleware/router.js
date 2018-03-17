// auto load router middleware
const LOGGER = getLogger('core.middleware.router');
const timeUtil = require('../utils/time');
const AppError = require('../utils/appError');
const fs = require('fs');
const path = require('path');

function log(...str) {
  if (share.config.requestLog) {
    LOGGER.info(...str);
  }
}

module.exports = () => {
  const prefix = share.config.apiPrefix || '';
  const baseControllerPath = `${share.APP_PATH}app${path.sep}controller${path.sep}`;
  const baseValidatePath = `${share.APP_PATH}app${path.sep}validate${path.sep}`;
  return async function (ctx, next) {
    return next().then(async () => {
      const now = timeUtil.nowMillisecond();
      try {
        if (prefix && !ctx.path.startsWith(prefix)) {
          ctx.status = 404;
          return;
        }
        let ctxPath = ctx.path.replace(prefix, '');
        ctxPath = ctxPath.replace(new RegExp(/(\/){2,}/g), '/');
        ctx.params = Object.assign({}, ctx.request.query, ctx.request.body);
        const arr = ctxPath.split('/').filter(v => !!v);
        const file = arr[arr.length - 2];
        const action = arr[arr.length - 1];
        arr.splice(arr.length - 2, 2);
        const controllerPath = `${baseControllerPath}${arr.join('/')}${file}`;
        if (!fs.existsSync(`${controllerPath}.js`)) {
          ctx.status = 404;
          log(`controller ${controllerPath}.js not exists`);
          return;
        }
        const controller = new (getController(controllerPath))(ctx);

        // validate extsts or not both ok
        const validatePath = `${baseValidatePath}${arr.join('/')}${file}`;
        if (fs.existsSync(`${validatePath}.js`)) {
          const validate = new (getValidate(validatePath))(ctx);
          try {
            ctx.validateResult = typeof validate[action] === 'function' ? await validate[action]() : {};
          } catch (e) {
            log(e);
            ctx.body = {code: e.code || 1, msg: e.message, time: now};
            return;
          }
        }

        if (typeof controller[action] !== 'function') {
          ctx.status = 404;
          log(`action ${action} not exists`);
          return;
        }
        const result = (await controller[action]()) || {};
        ctx.status = 200;
        if (ctx.oneOwn) {
          ctx.body = result;
          return;
        } 
        if (result === undefined || result === null) {
          return {code: 0, data: {}, time: now};
        }
        return {code: 0, data: result, time: now};
      } catch (e) {
        if (e instanceof AppError) {
          LOGGER.warn(e);
          ctx.body = {code: e.code || 1, msg: e.message, time: now};
          ctx.status = 200;
        } else {
          LOGGER.error(e);
          ctx.status = 500;
        }
      }
    });
  };
};

