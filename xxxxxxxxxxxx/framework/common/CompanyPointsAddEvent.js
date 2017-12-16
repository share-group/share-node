var CompanyPointsAddEvent = function (event, description) {
	return {
		event: event,
		description: description
	}
};

module.exports = {
	/**
	 * 后台赠送(30001)
	 */
	adminSend: new CompanyPointsAddEvent(30001, "后台赠送"),
	/**
	 * 专案结算剩余G点(30002)
	 */
	caseFinish: new CompanyPointsAddEvent(30002, "专案结算剩余G点"),
	/**
	 * 充值(30003)
	 */
	recharge: new CompanyPointsAddEvent(30003, "充值"),
	/**
	 * 完善资料(30004)
	 */
	fillupInfo: new CompanyPointsAddEvent(30004, "完善资料"),
	/**
	 * 全民营销项目结余(30005)
	 */
	cpcRest: new CompanyPointsAddEvent(30005, "全民营销项目结余")
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
