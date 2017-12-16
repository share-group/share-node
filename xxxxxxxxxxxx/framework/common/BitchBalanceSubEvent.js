var BitchBalanceSubEvent = function (event, description) {
	this.event = event;
	this.description = description;
};

module.exports = {
	/**
	 * 提现(60001)
	 */
	checkout: new BitchBalanceSubEvent(60001, "提现")
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
