// 数据库配置文件
var config = function (database) {
	if (_.toInteger(database.indexOf('gu_')) > -1) {
		database = database.replace('gu_', '');
	}
	database = 'jdbc.' + database.replace('_', '.') + '.url';
	let url = properties[database].toString();
	url = url.substring(url.indexOf('//') + 2, url.indexOf('?'));
	let arr = url.split('/');
	database = database.replace('jdbc.', '').replace('.url', '').replace('.', '_');
	arr = arr[0].split(':');
	let host = arr[0];
	let port = arr[1] ? arr[1] : 3306;
	return {
		host: host,
		port: port,
		user: properties['jdbc.username'],
		password: properties['jdbc.password'],
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		supportBigNumbers: true, // 数据库支持bigint或decimal类型列时，需要设此option为true
		bigNumberStrings: false, // supportBigNumbers和bigNumberStrings启用 强制bigint或decimal列以JavaScript字符串类型返回
		multipleStatement: true, // 是否许一个query中有多个MySQL语句
		connectionLimit: 2, // 连接数限制
		database: _.toInteger(database.indexOf('gu')) > -1 ? database : 'gu_' + database
	}
};

module.exports = {
	gu: config("gu"),
	guSlave: config("gu"),
	guLog: config("gu_log"),
	guAdmin: config("gu_admin"),
	guConfig: config("gu_config"),
	guData: config("gu_data"),
	guHot: config("gu_hot")
};