var Sex = function (sex) {
	return {
		sex: sex
	}
};

module.exports = {
	/**
	 * 男(1)
	 */
	BOY: Sex(1),
	/**
	 * 女(2)
	 */
	GRIL: Sex(2)
};

let sexMap = new Map();
_.forEach(module.exports, function (v, k) {
	sexMap.set(_.toInteger(v.sex), v);
});

/**
 * 根据传入的值返回对象
 * @param value 值
 */
module.exports.valueOf = function (value) {
	return sexMap.get(_.toInteger(value));
};
