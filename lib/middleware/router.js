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
  const baseControllerPath1 = `${share.APP_PATH}app${path.sep}controller${path.sep}`;
  const baseValidatePath1 = `${share.APP_PATH}app${path.sep}validate${path.sep}`;

  const baseControllerPath2 = `${share.APP_PATH}app${path.sep}`;
  const baseValidatePath2 = `${share.APP_PATH}app${path.sep}`;

  return async function (ctx, next) {
    return next().then(async () => {
      const now = timeUtil.nowMillisecond();
      try {
        if (prefix && !ctx.path.startsWith(prefix)) {
          ctx.status = 404;
          return;
        }
        let ctxPath = ctx.path.replace(prefix, '').trim();
        ctxPath = ctxPath.replace(new RegExp(/(\/){2,}/g), '/');
        ctx.params = Object.assign({}, ctx.request.query, ctx.request.body);
        const arr = ctxPath.split('/').filter(v => !!v).map(v => v.trim());
        if (arr[0] === 'common') {
          log(`invalid request: ${ctx.path.trim()}`);
          ctx.status = 400;
          return;
        }
        const file = arr[arr.length - 2];
        const action = arr[arr.length - 1];
        arr.splice(arr.length - 2, 2);
        let tmpArr = Object.assign([], arr);
        const controllerPath1 = `${baseControllerPath1}${arr.join('/')}${path.sep}${file}`;
        const controllerPath2 = `${baseControllerPath2}${tmpArr.shift()}${path.sep}controller${path.sep}${tmpArr.join('/')}${file}`;
        const realControllerPath = fs.existsSync(`${controllerPath1}.js`) ? controllerPath1 : controllerPath2;
        if (!fs.existsSync(`${realControllerPath}.js`)) {
          ctx.status = 404;
          log(`controller ${realControllerPath}.js not exists`);
          return;
        }

        const controller = new (getController(realControllerPath))(ctx);

        // validate extsts or not both ok
        tmpArr = Object.assign([], arr);
        const validatePath1 = `${baseValidatePath1}${arr.join('/')}${path.sep}${file}`;
        const validatePath2 = `${baseValidatePath2}${tmpArr.shift()}${path.sep}validate${path.sep}${tmpArr.join('/')}${file}`;
        const realValidatePath = fs.existsSync(`${validatePath1}.js`) ? validatePath1 : validatePath2;
        if (fs.existsSync(`${realValidatePath}.js`)) {
          const validate = new (getValidate(realValidatePath))(ctx);
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
        const result = await controller[action]();
        ctx.status = 200;
        if (ctx.oneOwn) {
          ctx.body = result;
          return;
        }
        if (result === undefined || result === null) {
          ctx.body = {code: 0, data: {}, time: now};
          return;
        }
        ctx.body = {code: 0, data: result, time: now};
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

