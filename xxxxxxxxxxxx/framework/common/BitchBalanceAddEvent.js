var BitchBalanceAddEvent = function (event, description) {
	this.event = event;
	this.description = description;
};

module.exports = {
	/**
	 * 完成直播任务(50001)
	 */
	liveFinish: new BitchBalanceAddEvent(50001, "完成直播任务")
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
