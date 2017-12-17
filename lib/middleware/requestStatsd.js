// requestStatsd middleware
const LOGGER = require('../utils/logger');
const timeUtil = require('../utils/time');
const humanize = require('humanize-number');

function time(start) {
  const delta = timeUtil.nowMillisecond() - start;
  return humanize(delta < 10000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`);
}

function log(...str) {
  LOGGER.info(...str);
}

module.exports = () => async function (ctx, next) {
  const start = timeUtil.nowMillisecond();
  await next();
  const cost = time(start);
  log(`${ctx.status} ${ctx.path} ${cost}`);
};

