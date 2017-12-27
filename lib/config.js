// default config
module.exports = {
  // 服务器启动端口
  port: 44001,
  // 是否允许跨域
  cors: false,
  // api前缀
  apiPrefix: '',
  // 是否打印请求日志
  requestLog: true,
  // 是否开启websocket
  websocket: false,
  // log4js配置
  log4js: {
    appenders: {
      out: {type: 'stdout'},
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
  },
};
