global.Promise = require('bluebird'); // use bluebird instead of native Promise
const pkg = require('../package.json');
const http = require('http');
const path = require('path');
const Koa = require('koa');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const helmet = require('koa-helmet');
const cors = require('koa-cors');

// private method
const print = Symbol('print');
const show = Symbol('show');

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
    global.share.FRAMEWORK_PATH = `${share.APP_PATH}node_modules${path.sep}share-node${path.sep}`;
    global.share.ENV = appPath.substr(appPath.lastIndexOf(path.sep) + 1).trim().replace('.js', '');

    // config file name rule: [appPath]/config/config.[env].js
    // use app's config as framework's config
    // init log4js config if developer has not set
    const defaultConfig = require('./config');
    const defaulLogLevel = defaultConfig.log4js.categories.default.level;
    global.share.config = require(`${share.APP_PATH}${path.sep}config${path.sep}config.${share.ENV}.js`);
    share.config.env = share.ENV;
    share.config.port = share.config.port || defaultConfig.port;
    share.config.logLevel = share.config.logLevel.trim().toUpperCase() || defaulLogLevel;
    share.config.websocket = !!share.config.websocket;
    share.config.requestLog = !!share.config.requestLog;
    share.config.log4js = share.config.log4js || defaultConfig.log4js;

    // require necessary components
    require('./globals');
  }

  /**
   * start http server
   */
  start() {
    // get a logger
    const app = new Koa();

    // load npm's middlewares
    app.use(bodyParser());
    app.use(json());
    app.use(convert(cors()));
    app.use(helmet());

    // load share's middlewares
    app.use(require('./middleware/router')());

    // start
    const server = http.createServer(app.callback());
    server.listen(share.config.port);
    this[print]();

    // emit some event after server start
    const event = require('./event');
    event.emit('bootstrap');
  }

  /**
   * print logs
   */
  [print]() {
    const LOGGER = getLogger('share.http');

    const appPkg = require(`${share.APP_PATH}${path.sep}package.json`) || {};
    const _app = `project name: ${appPkg.name || 'shaFre-node framework project'}@${appPkg.version || '1.0.0'}`;
    const _version = `share node version: ${pkg.version}, node version: ${process.version}, env: ${share.ENV}, log level: ${share.config.log4js.categories.default.level}`;
    const _instance = `cpu cores: ${process.env.NUMBER_OF_PROCESSORS}, server instances: 1, pid: ${process.pid}`;
    const _server = `http server start success, running at http://127.0.0.1${share.config.port.toString() === '80' ? '' : `:${share.config.port}`}`;
    this.long = Math.max(_version.length, _server.length) + 14;
    this.side = 5;
    this.char = '@';
    const base = this.char.repeat(this.long);

    LOGGER.warn(base);
    LOGGER.warn(this[show](_app));
    LOGGER.warn(this[show](_version));
    LOGGER.warn(this[show](_instance));
    if (share.config.websocket) {
      const _websocket = `websocket status: true, running at ws://127.0.0.1:${share.config.port}`;
      LOGGER.warn(this[show](_websocket));
    }
    LOGGER.warn(this[show](_server));
    LOGGER.warn(base);
  }

  [show](str) {
    return `${this.char.repeat(this.side)} ${str} ${' '.repeat(this.long - (this.side * 2) - str.length - 2)}${this.char.repeat(this.side)}`;
  }
};