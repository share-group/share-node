var UserPointsSubEvent = function (event, description) {
	return {
		event: event,
		description: description
	}
};

module.exports = {
	/**
	 * 提现(20001)
	 */
	checkOutGPoint: new UserPointsSubEvent(20001, "提现"),
	/**
	 * 打赏给大咖(20002)
	 */
	awardSuperstar: new UserPointsSubEvent(20002, "打赏给大咖"),
	/**
	 * 创意被删除(20003)
	 */
	delIdea: new UserPointsSubEvent(20003, "创意被删除"),
	/**
	 * 发布悬赏项目(20004)
	 */
	postCase: new UserPointsSubEvent(20004, "发布悬赏项目")
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
