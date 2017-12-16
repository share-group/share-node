import moment from "moment";

let atomicInteger = 0;

module.exports = {
	/**
	 * 生成唯一id
	 */
	genUniqueId: function () {
		atomicInteger += 1;
		if (atomicInteger > 99) {
			atomicInteger = 1;
		}
		let base = _.toString(moment().format('YYYYMMDDHHmmssSSS'));
		let tmp = atomicInteger;
		if (atomicInteger < 10) {
			tmp = '0' + atomicInteger;
		}
		return base + tmp;
	}
};