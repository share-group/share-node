global.Promise = require('bluebird'); // use bluebird instead of native Promise
const pkg = require('../package.json');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Koa = require('koa');
const convert = require('koa-convert');
const koaBody = require('koa-body');
const helmet = require('koa-helmet');
const cors = require('koa-cors');

const category = 'core.http';

// private method
const print = Symbol('print');
const bootstrap = Symbol('bootstrap');

module.exports = class {
  /**
   * share-node framework constructor
   */
  constructor() {
    // create 'share' global variable
    global.share = {};
    global.share.startTime = Date.now();

    // auto calculate APP_PATH
    const appPath = path.resolve(process.mainModule.children[0].parent.filename);
    global.share.APP_PATH = appPath.substr(0, appPath.lastIndexOf(path.sep)).trim().replace('start', '');
    global.share.FRAMEWORK_PATH = `${share.APP_PATH}node_modules${path.sep}share-node${path.sep}`;
    global.share.ENV = appPath.substr(appPath.lastIndexOf(path.sep) + 1).trim().replace('.js', '');

    // config file name rule: [appPath]/config/config.[env].js
    // use app's config as framework's config
    // init log4js config if developer has not set
    const defaultConfig = require('./config');
    const configFile = `${share.APP_PATH}config${path.sep}config.${share.ENV}.js`;
    global.share.config = fs.existsSync(configFile) ? require(configFile) : {};
    share.config.env = share.ENV;
    share.config.port = share.config.port || defaultConfig.port;
    share.config.middleware = share.config.middleware || defaultConfig.middleware;
    share.config.apiPrefix = share.config.apiPrefix || defaultConfig.apiPrefix;
    share.config.websocket = !!share.config.websocket;
    share.config.requestLog = !!share.config.requestLog;
    share.config.log4js = share.config.log4js || defaultConfig.log4js;

    // require necessary components
    require('./globals');
    this.LOG = getLogger(category);
    this.LOG.info(`config file: ${configFile}`);

    // run bootstrap
    this[bootstrap]();
  }

  /**
   * start http server
   */
  start() {
    // get a logger
    const app = new Koa();

    // load npm's middlewares
    app.use(koaBody({multipart: true}));
    app.use(helmet());
    if (share.config.cors) {
      app.use(convert(cors()));
    }

    // load config's middlewares
    share.config.middleware.forEach((m) => {
      let who = 'app';
      let mFile = `${share.APP_PATH}app${path.sep}middleware${path.sep}${m}.js`;
      if (!fs.existsSync(mFile)) {
        who = 'framework';
        mFile = `${share.FRAMEWORK_PATH}lib${path.sep}middleware${path.sep}${m}.js`;
      }
      app.use(require(mFile)(share.config[m]));
      this.LOG.info(`require ${who} middleware: ${m}`);
      return m;
    });

    // global exception catch
    const logger = getLogger(category);
    process.on('uncaughtException', (err) => {
      logger.error(err);
    });

    // start
    const server = http.createServer(app.callback());
    server.listen(share.config.port);
    this[print]();
    return server;
  }

  /**
   * before server start, run bootstrap
   */
  [bootstrap]() {
    // auto load framework bootstrap before server start
    const bootstrapPath = `${share.FRAMEWORK_PATH}lib${path.sep}bootstrap`;
    if (fs.existsSync(bootstrapPath)) {
      fs.readdirSync(bootstrapPath).filter(v => require(`${bootstrapPath}${path.sep}${v}`));
    }

    // auto load app's bootstrap before server start
    const appBootstrapPath = `${share.APP_PATH}app${path.sep}bootstrap`;
    if (fs.existsSync(appBootstrapPath)) {
      fs.readdirSync(appBootstrapPath).filter(v => require(`${appBootstrapPath}${path.sep}${v}`));
    }
  }

  /**
   * print logs
   */
  [print]() {
    const appPkg = require(`${share.APP_PATH}${path.sep}package.json`) || {};
    const _app = `project name: ${appPkg.name || 'share-node framework project'} ${appPkg.version || '1.0.0'}`;
    const _version = `share node version: ${pkg.version}, node version: ${process.version}, env: ${share.ENV}, log level: ${share.config.log4js.categories.default.level}`;
    const _instance = `cpu cores: ${os.cpus().length}, server instances: 1, pid: ${process.pid}`;
    const _server = `http server start in ${((Date.now() - share.startTime) / 1000.0).toFixed(2)} s, running at http://127.0.0.1${share.config.port.toString() === '80' ? '' : `:${share.config.port}`}`;
    this.LOG.info(_app);
    this.LOG.info(_version);
    this.LOG.info(_instance);
    if (share.config.websocket) {
      const _websocket = `websocket status: true, running at ws://127.0.0.1:${share.config.port}`;
      this.LOG.info(_websocket);
    }
    this.LOG.info(_server);
  }
};
