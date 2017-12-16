var CompanyPointsSubEvent = function (event, description) {
	return {
		event: event,
		description: description
	}
};

module.exports = {
	/**
	 * 发布专案(40001)
	 */
	pubCase: new CompanyPointsSubEvent(40001, "发布专案"),
	/**
	 * 发布专案(40002)
	 */
	adminSub: new CompanyPointsSubEvent(40002, "管理员减"),
	/**
	 * 支付cpc项目(40003)
	 */
	payCpc: new CompanyPointsSubEvent(40003, "支付cpc项目")
};

let eventMap = new Map();
_.forEach(module.exports, function (v, k) {
	eventMap.set(_.toInteger(v.event), v);
});

/**
 * 根据传入的值返回对象
 * @param value 值
 */
module.exports.valueOf = function (value) {
	return eventMap.get(_.toInteger(value));
};
