var CheckoutType = function (value, description) {
	return {
		value: value,
		description: description
	}
};

module.exports = {
	/**
	 * 微信(1)
	 */
	wechat: new CheckoutType(1, "微信"),
	/**
	 * 支付宝(2)
	 */
	alipay: new CheckoutType(2, "支付宝")
};

let checkoutTypeMap = new Map();
_.forEach(module.exports, function (v, k) {
	checkoutTypeMap.set(_.toInteger(v.value), v);
});

/**
 * 根据传入的值返回对象
 * @param value 值
 */
module.exports.valueOf = function (value) {
	return checkoutTypeMap.get(_.toInteger(value));
};
