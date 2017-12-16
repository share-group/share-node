// 随机数

module.exports = {
	/**
	 * 从set随机取出一个元素出来
	 * @param _set
	 */
	set: function (_set) {
		let multiple = 1000; // 放大位数
		// 求和
		let sum = _set.size * multiple;

		// 产生0-sum的整数随机
		let luckNum = _.random(0, sum - 1);
		let tmp = 0;
		for (let one of _set) {
			tmp += multiple;
			if (luckNum <= tmp) {
				return one;
			}
		}
		return null;
	}
};