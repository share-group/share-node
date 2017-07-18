if (share.config.mysql) {
  const logger = getLogger('share.mysql');
  const mysql = require('mysql');
  const pool = mysql.createPool({
    host: share.config.mysql.host || '127.0.0.1',
    port: share.config.mysql.port || 3306,
    user: share.config.mysql.user,
    password: share.config.mysql.password,
    database: share.config.mysql.database,
    charset: share.config.mysql.charset || 'utf8',
    collate: share.config.mysql.collate || 'utf8_unicode_ci',
    connectionLimit: share.config.mysql.connectionLimit || 5,
    supportBigNumbers: true,
    bigNumberStrings: false,
    multipleStatement: false,
  });

  pool.getConnection((err, connection) => {
    const host = connection.config.host;
    const port = connection.config.port;
    const database = connection.config.database;
    logger.info(`connect mysql://${host}:${port}/${database} successfully`);
  });
}
