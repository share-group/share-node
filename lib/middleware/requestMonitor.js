// requestMonitor middleware
const LOGGER = getLogger('core.middleware.requestMonitor');

function log (...str) {
  if (share.config.requestLog) {
    LOGGER.info(...str);
  }
}

/**
 * circulate size
 */
function circulateSize (size) {
  const sizes = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)), 10);
  return `${Math.floor(size / (1024 ** i))} ${sizes[i]}`;
}

module.exports = () => async function (ctx, next) {
  await next();
  log(`request url: ${ctx.path}`);
  log(`request method: ${ctx.method}`);
  log(`request: ${JSON.stringify(ctx.params)}`);
  log(`response, size: ${circulateSize(JSON.stringify(ctx.body || '').length)}, data: ${JSON.stringify(ctx.body)}`);
};

