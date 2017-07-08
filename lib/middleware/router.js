// auto load router middleware
const LOGGER = getLogger('share.middleware.router');
const path = require('path');

module.exports = () => {
  const basePath = `${share.APP_PATH}app${path.sep}controller${path.sep}`;
  return async function (ctx, next) {
    return next().then(async () => {
      try {
        const arr = ctx.url.split('/').filter((v) => !!v);
        const file = arr[arr.length - 2];
        const action = arr[arr.length - 1];
        arr.splice(arr.length - 2, 2);
        const controllerPath = `${basePath}${arr.join('/')}${path.sep}${file}`;
        const controller = new (getController(controllerPath))(ctx);
        const result = await controller[action]();
        ctx.body = { code: 0, data: JSON.stringify(result) };
      } catch (e) {
        LOGGER.error(e);
      }
    });
  };
};
