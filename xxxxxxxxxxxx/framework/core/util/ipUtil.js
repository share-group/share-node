import os from 'os';
module.exports = {
	/**
	 * ip地址转到long
	 * @param ip
	 */
	ip2Long: function (ip) {
		let ipArr = ip.split(".");
		return (_.toNumber(ipArr[0]) << 24) + (_.toNumber(ipArr[1]) << 16) + (_.toNumber(ipArr[2]) << 8) + _.toNumber(ipArr[3]);
	}
};