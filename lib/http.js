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
    share.config.env = share.config.env ? share.config.env.trim() : 'production';
    share.config.port = share.config.port || 44001;
    share.config.logLevel = share.config.logLevel ? share.config.logLevel.trim().toUpperCase() : 'ALL';
    share.config.websocket = share.config.websocket || false;

    // init log4js config if developer has not set
    share.config.log4js = share.config.log4js ? share.config.log4js : {
      appenders: {
        out: { type: 'stdout' },
        app: {
          type: 'dateFile',
          filename: `${share.APP_PATH}/log/log.log`,
          pattern: '.yyyy-MM-dd',
          compress: true,
        },
      },
      categories: {
        default: {
          appenders: ['out', 'app'],
          level: 'ALL',
        },
      },
    };

    // require necessary components
    require('./globals');
  }

  /**
   * start http server
   */
  start() {
    // get a logger
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

    app.use(router.routes()).use(router.allowedMethods());
    const server = http.createServer(app.callback());
    server.listen(share.config.port);

    this.print();
  }

  /**
   * print logs
   */
  print() {
    const LOGGER = getLogger('share.http');
    const long = 100;
    const side = 10;

    const version = `node version: ${process.version}, env: ${share.ENV}, log level: ${share.config.log4js.categories.default.level}`;
    const server = `http server start success, running at http://127.0.0.1:${share.config.port}`;
    LOGGER.warn('#'.repeat(long));
    LOGGER.warn(`${'#'.repeat(side)} ${version} ${' '.repeat(long - side - version.length)}${'#'.repeat(side)}`);
    LOGGER.warn(`${'#'.repeat(side)} ${server} ${' '.repeat(long - side - server.length)}${'#'.repeat(side)}`);
    LOGGER.warn('#'.repeat(long));
  }
};

