import logger from "../util/logUtil";
import filesystem from "../util/filesystem";
import fs from "fs";
var LOGGER = logger.getLogger(module.filename);

/**
 * 扫描controller包，构建路由列表
 */
module.exports = function () {
	try {
		var path = AppDir + '/controller';
		var fileList = filesystem.ls(path);
		var route = {};
		var urlMap = {};//防止url重复

		// 定义白名单
		global.whiteList = {};

		fileList.forEach(function (item) {
			var file = path + "/" + item;
			var stats = fs.statSync(file);
			if (!stats.isDirectory()) {
				var controller = require(file);
				_.forEach(controller, function (v_map, k_funcName) {
					var funObj = v_map.func;
					if (_.isFunction(funObj)) {
						let url = "/" + item.replace("Controller.js", "") + funcNameToUrl(k_funcName);
						// 约定一条规则，如果不指定method，则既可以post也可以get
						let methodList = [];
						let method = _.toString(v_map.method).toLowerCase().trim();
						if (!method) {
							methodList.push('post');
							methodList.push('get');
							v_map.method = 'all';
						} else {
							methodList.push(method);
						}

						//检查url不能为空
						if (!url) {
							process.exit();
						}
						if (urlMap[url] == url) {
							process.exit();
						}

						// 安按照定义加入白名单
						if (v_map.white) {
							global.whiteList[url] = v_map.white;
						}

						for (let _method of methodList) {
							route[url] = v_map;
							urlMap[url] = url;
							LOGGER.info('request mapping url: [%s], method: [%s] on %s function %s()', url, _method, file, k_funcName);
						}
					}
				});
			}
		});
		return route;
	} catch (e) {
		LOGGER.error(e);
		process.exit();
	}
};

/**
 * 方法名->链接(getById->/get/by/id)
 * @param funcName
 */
function funcNameToUrl(funcName) {
	var url = "/";
	var l = funcName.length;
	for (let i = 0; i < l; i++) {
		let c = funcName.charAt(i);
		if (i > 0 && c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) {
			url = url + "/";
			url = url + c;
		} else {
			url = url + c;
		}
	}
	return url.toLowerCase();
}