if (share.config.log4js.replaceConsole) {
  const logger = getLogger('core.console');
  console.log = logger.info.bind(logger);
  console.error = logger.error.bind(logger);
}