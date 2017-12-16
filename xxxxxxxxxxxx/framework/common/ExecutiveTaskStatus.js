var ExecutiveTaskStatus = function (value) {
	return {
		value: value
	}
};

module.exports = {
	/**
	 * 未支付托管资金(0)
	 */
	noPay: new ExecutiveTaskStatus(0),
	/**
	 * 已支付托管资金(1)
	 */
	hasPay: new ExecutiveTaskStatus(1),
	/**
	 * 提交初稿(2)
	 */
	postFirstDrafts: new ExecutiveTaskStatus(2),
	/**
	 * 确认初稿(3)
	 */
	confirmFirstDrafts: new ExecutiveTaskStatus(3),
	/**
	 * 提交终稿(4)
	 */
	postFinalDrafts: new ExecutiveTaskStatus(4),
	/**
	 * 确认终稿(5)
	 */
	confirmFinalDrafts: new ExecutiveTaskStatus(5),
	/**
	 * 任务完成(6)
	 */
	finish: new ExecutiveTaskStatus(6),
	/**
	 * 终止服务(7)
	 */
	stop: new ExecutiveTaskStatus(7),
	/**
	 * 申请退款(8)
	 */
	applyRefund: new ExecutiveTaskStatus(8),
	/**
	 * 退款成功(9)
	 */
	refundSuccess: new ExecutiveTaskStatus(9),
	/**
	 * 发表评价(10)
	 */
	commentPub: new ExecutiveTaskStatus(10),
	/**
	 * 评价完成(11)
	 */
	commentFinish: new ExecutiveTaskStatus(11)
};

let statusMap = new Map();
_.forEach(module.exports, function (v, k) {
	statusMap.set(_.toInteger(v.value), v);
});

/**
 * 根据传入的值返回Platform对象
 * @param value 值
 */
module.exports.valueOf = function (value) {
	return statusMap.get(_.toInteger(value));
};
