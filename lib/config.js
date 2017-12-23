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
  // logger配置
  logger: {
    // 日志等级： log, trace, debug, info, warn, error
    level: 'log',
  },
};
