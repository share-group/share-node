function ChargeChannel(value, description) {
	this.value = value;
	this.description = description;
}
module.exports = {
	/**
	 * 余额支付(0)
	 */
	balance: new ChargeChannel(0, "余额支付"),
	/**
	 * 微信扫码支付(1)
	 */
	wechatQRCode: new ChargeChannel(1, "微信支付"),
	/**
	 * 支付宝(2)
	 */
	alipay: new ChargeChannel(2, "支付宝"),
	/**
	 * 银行卡(3)
	 */
	bankCard: new ChargeChannel(3, "银行卡")
};


let channelMap = new Map();
_.forEach(module.exports, function (v, k) {
	channelMap.set(_.toInteger(v.value), v);
});

/**
 * 根据传入的值返回OpenPlatform对象
 * @param value 值
 */
module.exports.valueOf = function (value) {
	return channelMap.get(_.toInteger(value));
};