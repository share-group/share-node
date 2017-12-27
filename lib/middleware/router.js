// auto load router middleware
const LOGGER = getLogger('core.middleware.router');
const timeUtil = require('../utils/time');
const fs = require('fs');
const path = require('path');

function log (...str) {
  if (share.config.requestLog) {
    LOGGER.warn(...str);
  }
}

module.exports = () => {
  const prefix = share.config.apiPrefix || '';
  const baseControllerPath = `${share.APP_PATH}app${path.sep}controller${path.sep}`;
  const baseValidatePath = `${share.APP_PATH}app${path.sep}validate${path.sep}`;
  return async function (ctx, next) {
    return next().then(async () => {
      try {
        if (prefix && !ctx.path.startsWith(prefix)) {
          ctx.status = 404;
          return;
        }
        ctx.path = ctx.path.replace(prefix, '');
        const now = timeUtil.nowMillisecond();
        ctx.params = Object.assign({}, ctx.request.query, ctx.request.body);
        const arr = ctx.path.split('/').filter(v => !!v);
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
            log('validate fail：', e.message);
            ctx.body = {code: 1, data: e.message, time: now};
            return;
          }
        }

        if (typeof controller[action] !== 'function') {
          ctx.status = 404;
          log(`action ${action} not exists`);
          return;
        }
        const result = (await controller[action]()) || {};
        ctx.body = {code: 0, data: result, time: now};
      } catch (e) {
        LOGGER.error(e);
        ctx.status = 500;
      }
    });
  };
};

