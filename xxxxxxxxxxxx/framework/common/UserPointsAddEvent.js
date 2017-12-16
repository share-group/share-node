var UserPointsAddEvent = function (event, description) {
	this.event = event;
	this.description = description;
};

module.exports = {
	/**
	 * 专案结算加钱(10001)
	 */
	caseFinish: new UserPointsAddEvent(10001, "专案结算加钱"),
	/**
	 * 预留手机号送G(10002)
	 */
	storeMobile: new UserPointsAddEvent(10002, "预留手机号送G点"),
	/**
	 * 被打赏(10003)
	 */
	Reward: new UserPointsAddEvent(10003, "被打赏"),
	/**
	 * 注册奖励(10004)
	 */
	registerAward: new UserPointsAddEvent(10004, "注册奖励"),
	/**
	 * 管理员送赠送(10005)
	 */
	adminSendGPoints: new UserPointsAddEvent(10005, "管理员赠送"),
	/**
	 * 人民币礼包(10006)
	 */
	gPackage: new UserPointsAddEvent(10006, "人民币礼包"),
	/**
	 * 优惠码邀请(10007)
	 */
	codeInvite: new UserPointsAddEvent(10007, "邀请用户奖励"),
	/**
	 * 输入优惠码(10008)
	 */
	inputCode: new UserPointsAddEvent(10008, "输入优惠码"),
	/**
	 * 提现分享(10009)
	 */
	shareChechout: new UserPointsAddEvent(10009, "提现分享"),
	/**
	 * 专案参与奖(10010)
	 */
	joinCase: new UserPointsAddEvent(10010, "专案参与奖"),
	/**
	 * 企业选中创意(10011)
	 */
	companySelect: new UserPointsAddEvent(10011, "企业选中创意"),
	/**
	 * 项目结算加钱(10012)
	 */
	projectFinish: new UserPointsAddEvent(10012, "项目结算加钱"),
	/**
	 * cpc项目结算加钱(10013)
	 */
	cpcProjectFinish: new UserPointsAddEvent(10013, "cpc项目结算加钱"),
	/**
	 * 充值(10014)
	 */
	recharge: new UserPointsAddEvent(10014, "充值"),
	/**
	 * 个人专案结算(10015)
	 */
	userCaseFinish: new UserPointsAddEvent(10015, "个人专案结算")
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
