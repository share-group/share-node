// requestStatsd middleware
const LOGGER = getLogger('core.middleware.requestStatsd');
const timeUtil = require('../utils/time');
const number = require('../utils/number');

function time(start) {
  const delta = timeUtil.nowMillisecond() - start;
  return number.humanize(delta < 10000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`);
}

module.exports = () => async function (ctx, next) {
  const start = timeUtil.nowMillisecond();
  await next();
  const cost = time(start);
  LOGGER.info(`${ctx.status} ${ctx.method} ${ctx.path} ${cost}`);
};

