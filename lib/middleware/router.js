// auto load router middleware
const LOGGER = require('../utils/logger');
const path = require('path');
const humanize = require('humanize-number');

function time(start) {
  const delta = Date.now() - start;
  return humanize(delta < 10000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`);
}

/**
 * circulate size
 */
function circulateSize(size) {
  const sizes = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)), 10);
  return `${Math.floor(size / (1024 ** i))} ${sizes[i]}`;
}

module.exports = () => {
  const basePath = `${share.APP_PATH}app${path.sep}controller${path.sep}`;
  return async function (ctx, next) {
    return next().then(async () => {
      try {
        ctx.params = Object.assign({}, ctx.request.query, ctx.request.body);
        const index = ctx.url.indexOf('?');
        const arr = (index > -1 ? ctx.url.substr(0, index) : ctx.url).split('/').filter(v => !!v);
        const file = arr[arr.length - 2];
        const action = arr[arr.length - 1];
        arr.splice(arr.length - 2, 2);
        const controllerPath = `${basePath}${arr.join('/')}${path.sep}${file}`;
        const controller = new (getController(controllerPath))(ctx);

        const start = Date.now();
        const result = (await controller[action]()) || '';
        if (share.config.requestLog) {
          LOGGER.warn(`request url: ${ctx.originalUrl}`);
          LOGGER.warn(`request method: ${ctx.method}`);
          LOGGER.warn(`request: ${JSON.stringify(ctx.params)}`);
          LOGGER.warn(`response, exec: ${time(start)}, size: ${circulateSize(JSON.stringify(result).length)}, data: ${JSON.stringify(result)}`);
        }

        ctx.body = { code: 0, data: result, time: new Date().getTime() };
      } catch (e) {
        LOGGER.error(e);
      }
    });
  };
};
