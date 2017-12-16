var ShareContentType = function (value, description) {
	return {
		value: value,
		description: description
	}
};

module.exports = {
	/**
	 * 分享品牌专案(1)
	 */
	Case: ShareContentType(1, "分享品牌专案"),
	/**
	 * 分享品牌专案点子(2)
	 */
	CompanyCaseIdea: ShareContentType(2, "分享品牌专案点子"),
	/**
	 * 分享创意圈(3)
	 */
	Market: ShareContentType(3, "分享创意圈"),
	/**
	 * 分享大咖说(4)
	 */
	Superstar: ShareContentType(4, "分享大咖说"),
	/**
	 * 分享提现(5)
	 */
	Checkout: ShareContentType(5, "分享提现"),
	/**
	 * 分享webapp首页分享(6)
	 */
	WebappIndex: ShareContentType(6, "分享webapp首页"),
	/**
	 * 分享抽奖(7)
	 */
	Lottery: ShareContentType(7, "分享抽奖"),
	/**
	 * 个人专案发布成功(8)
	 */
	UserCase: ShareContentType(8, "个人专案分享"),
	/**
	 * 个人执行方分享(9)
	 */
	ExecutiveUser: ShareContentType(9, "个人执行方分享"),
	/**
	 * 企业执行方分享(10)
	 */
	ExecutiveCompany: ShareContentType(10, "企业执行方分享"),
	/**
	 * 分享个人专案点子(11)
	 */
	UserCaseIdea: ShareContentType(11, "分享个人专案点子")
};


let shareContentTypeMap = new Map();
_.forEach(module.exports, function (v, k) {
	shareContentTypeMap.set(_.toInteger(v.value), v);
});

/**
 * 根据传入的值返回对象
 * @param value 值
 */
module.exports.valueOf = function (value) {
	return shareContentTypeMap.get(_.toInteger(value));
};