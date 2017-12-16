// 时间类
// 标准格式：YYYY-MM-DD HH:mm:ss
import moment from 'moment';
module.exports = {
	/**
	 * 获取当前纳秒
	 */
	nanoTime: function () {
		var nano = process.hrtime();
		return _.toNumber(nano[0] + "" + nano[1]);
	},
	/**
	 * 获取当前时间(秒)
	 */
	now: function () {
		return _.toInteger(this.nowMillis() / 1000);
	},
	/**
	 * 获取当前时间(毫秒)
	 */
	nowMillis: function () {
		return moment.now();
	},
	/**
	 * 把当前时间按照指定格式输出
	 * @param format 格式
	 */
	date: function (format) {
		return moment().format(format);
	},
	/**
	 * 把时间戳按照指定格式输出
	 * @param timestamp 时间戳
	 * @param format 格式
	 */
	time2str: function (timestamp, format) {
		return moment.unix(timestamp).format(format);
	},
	/**
	 * 时间字符串转时间戳
	 * @param str 时间字符串
	 */
	str2Time: function (str) {
		return _.toInteger(moment(str).toDate().getTime() / 1000);
	},
	/**
	 * 天数转成秒
	 * @param day
	 */
	day2Second: function (day) {
		return moment.duration(day, "day").asSeconds()
	},
	/**
	 * 寻找最合适的单位来显示时间
	 * @param time 时间
	 */
	showTime: function (time) {
		var str = "";
		if (time > 0 && time <= 1000) {
			str = time + " ns";
		} else if (time > 1000 && time <= 1000000) {
			str = (time / 1000.0).toFixed(2) + " μs";
		} else if (time > 1000000 && time <= 1000000000) {
			str = (time / 1000000.0).toFixed(2) + " ms";
		} else if (time > 1000000000 && time < 60000000000) {
			str = (time / 1000000000.0).toFixed(2) + " s";
		} else if (time >= 60000000000 && time < 3600000000000) {
			str = (time / 60000000000).toFixed(2) + " min";
		} else {
			str = (time / 3600000000000).toFixed(2) + " h";
		}
		return str;
	},
	/**
	 * 获取当前时间是今年的第几周
	 */
	getWeekOfYear: function () {
		let totalDays = 0;
		let now = new Date();
		let days = new Array(12);
		days[0] = 31;
		days[2] = 31;
		days[3] = 30;
		days[4] = 31;
		days[5] = 30;
		days[6] = 31;
		days[7] = 31;
		days[8] = 30;
		days[9] = 31;
		days[10] = 30;
		days[11] = 31;

		//判断是否为闰年，针对2月的天数进行计算
		if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
			days[1] = 29
		} else {
			days[1] = 28
		}

		if (now.getMonth() == 0) {
			totalDays = totalDays + now.getDate();
		} else {
			let curMonth = now.getMonth();
			for (let count = 1; count <= curMonth; count++) {
				totalDays = totalDays + days[count - 1];
			}
			totalDays = totalDays + now.getDate();
		}
		//得到第几周
		return Math.round(totalDays / 7);
	}

};
