var EasemobMessageType = function (value) {
	return {
		value: value
	}
};

module.exports = {
	/**
	 * 小红点
	 */
	redDot: EasemobMessageType('redDot'),
	/**
	 * 好友列表更新
	 */
	contactList: EasemobMessageType('contactList'),
	/**
	 * 封号
	 */
	banAccount: EasemobMessageType('banAccount'),
	/**
	 * 刷新用户的钱
	 */
	refreshUserMoney: EasemobMessageType('refreshUserMoney'),
	/**
	 * 刷新执行方信息
	 */
	executive: EasemobMessageType('executive'),
	/**
	 * 刷新kol信息
	 */
	kol: EasemobMessageType('kol'),
	/**
	 * 专案详情
	 */
	caseInfo: EasemobMessageType('caseInfo')
};
