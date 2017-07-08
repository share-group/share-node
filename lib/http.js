global.Promise = require('bluebird'); // use bluebird instead of native Promise
const http = require('http');
const Koa = require('koa');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const cors = require('koa-cors');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');

module.exports = class {
  /**
   * share-node framework constructor
   */
  constructor() {
    // create 'share' global variable
    global.share = {};

    // auto calculate APP_PATH
    const appPath = path.resolve(process.mainModule.children[0].parent.filename);
    global.share.APP_PATH = appPath.substr(0, appPath.lastIndexOf(path.sep)).trim().replace('start', '');
    global.share.ENV = appPath.substr(appPath.lastIndexOf(path.sep) + 1).trim().replace('.js', '');

    // config file name rule: [appPath]/config/config.[env].js
    // use app's config as framework's config
    global.share.config = require(`${share.APP_PATH}${path.sep}config${path.sep}config.${share.ENV}.js`);
    share.config.env = share.config.env ? config.env.trim() : 'production';
    share.config.port = share.config.port || 44001;
    share.config.logLevel = share.config.logLevel ? share.config.logLevel.trim().toUpperCase() : 'ALL';
    share.config.websocket = share.config.websocket || false;
  }

  /**
   * start http server
   */
  start() {
    const app = new Koa();
    app.use(bodyParser());
    app.use(json());
    app.use(convert(cors()));
    app.use(helmet());
    app.use(logger());

    const router = new Router();
    router.get('/', (ctx) => {
      ctx.body = 1;
    });

    require('./globals');
    app.use(router.routes()).use(router.allowedMethods());
    const server = http.createServer(app.callback());
    server.listen(share.config.port);
    getLogger('aaaaaaa');
  }
};

