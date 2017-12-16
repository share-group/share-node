module.exports = {
	/**
	 * 判断是否是邮箱
	 * @param email
	 */
	isEmail: function (email) {
		return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
	},
	/**
	 * 判断是否为超链接
	 * @param link
	 */
	isLink: function (link) {
		return /^(http(s)?:\/\/)?(\w+\.)?\w+\.(\w+\.)?\w+\/?(\?)?.*$/.test(link);
	}
};