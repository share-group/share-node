var OpenPlatform = function (platformId, description) {
	this.value = platformId;
	this.description = description;
};

module.exports = {
	/**
	 * QQ(1)
	 */
	QQ: new OpenPlatform(1, "QQ"),
	/**
	 * 朋友圈(2)
	 */
	PengYouQuan: new OpenPlatform(2, "朋友圈"),
	/**
	 * 微信好友(3)
	 */
	WeChatFriend: new OpenPlatform(3, "微信好友"),
	/**
	 * 微博(4)
	 */
	Weibo: new OpenPlatform(4, "微博"),
	/**
	 * QQ空间(5)
	 */
	QZone: new OpenPlatform(5, "QQ空间")
};

let platformMap = new Map();
_.forEach(module.exports, function (v, k) {
	platformMap.set(_.toInteger(v.value), v);
});

/**
 * 根据传入的值返回OpenPlatform对象
 * @param value 值
 */
module.exports.valueOf = function (value) {
	return platformMap.get(_.toInteger(value));
};