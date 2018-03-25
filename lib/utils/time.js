/**
 * 时间工具类
 */
module.exports = {
  /**
   * 获取当前时间(毫秒)
   */
  nowMillisecond() {
    return new Date().getTime();
  },
  /**
   * 获取当前时间(秒)
   */
  now() {
    return parseInt(new Date().getTime() / 1000, 10);
  },
  /**
   * 时间格式化
   * @param format 格式(默认：yyyy-MM-dd hh:mm:ss)
   * @param timestamp 时间戳(毫秒，默认当前时间)
   */
  format(format = 'yyyy-MM-dd hh:mm:ss', timestamp = null) {
    let _format = format;
    const date = new Date(timestamp || new Date().getTime());
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    _format = /(y+)/.test(_format) ? _format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length)) : _format;
    Object.keys(o).filter((k) => {
      _format = new RegExp(`(${k})`).test(_format) ? _format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))) : _format;
      return true;
    });
    return _format;
  },
  /**
   * 获取指定日期凌晨的时间戳
   * @param date 日期(不传默认今天)
   * @param day 日期偏移(正数向前+1天，负数向后-1天，默认0)
   */
  getDayStart(date, day) {
    const _date = new Date(date || new Date().getTime());
    const _day = day || 0;
    const dateStr = this.format('yyyy-MM-dd', _date.getTime() + (_day * 86400000));
    return this.str2time(`${dateStr} 00:00:00`);
  },
  /**
   * 日期格式转时间戳
   * @param str 日期字符串(必须是：yyyy-MM-dd hh:mm:ss，否则结果有偏差)
   */
  str2time(str) {
    return Date.parse(str.trim());
  },


  /**
   * 获取今天是本年第几周
   * @param date 日期(不传默认今天)
   */
  getYearWeek(date) {
    const _date = new Date(date || new Date().getTime());
    const date2 = new Date(_date.getFullYear(), 0, 1);
    let day1 = _date.getDay();
    if (day1 === 0) day1 = 7;
    let day2 = date2.getDay();
    if (day2 === 0) day2 = 7;
    const marginDay = day2 - day1;
    const seconds = marginDay * (24 * 60 * 60 * 1000);
    const marginYearFirstDay = _date.getTime() - date2.getTime();
    const d = Math.round((marginYearFirstDay + seconds) / 86400000);
    return Math.ceil(d / 7) + 1;
  },


};
