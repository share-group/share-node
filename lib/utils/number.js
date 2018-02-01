module.exports = {
  /**
   * 科学记数法
   * @param n 数字
   * @param options 选项
   */
  humanize(n, options) {
    const _options = options || {};
    const d = _options.delimiter || ',';
    const s = _options.separator || '.';
    const _n = n.toString().split('.');
    _n[0] = _n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${d}`);
    return _n.join(s);
  },
  /**
   * 四舍五入保留n位小数
   * @param number 数字
   * @param byte 保留的数字个数
   */
  fixedFloat(number, byte = 2) {
    if (!number) {
      return 0;
    }
    return parseFloat(number.toFixed(parseInt(byte)));
  },
  /**
   * 浮点数溢出的时候，四舍五入保留n位小数
   * @param number 数字
   * @param byte 保留的数字个数
   */
  fixedFloatPro(number, byte = 2) {
    const left = Math.abs(number - this.fixedFloat(number, byte));
    // 是 0.34999999999 的情况才 fix
    if (left < 0.00001) {
      return this.fixedFloat(number, byte);
    }
    return number;
  },
  /**
   * 四舍五入cut掉多余的数字保留n位小数
   * @param number 数字
   * @param digits 保留的数字个数
   */
  cutFloat(number, digits = 2) {
    if (!number || digits < 0) {
      return number;
    }
    let _number = this.fixedFloatPro(number);
    const isMinus = (_number < 0);
    if (isMinus) {
      _number *= -1;
    }
    const result = this.fixedFloatPro(Math.floor(_number, digits));
    return result * (isMinus ? -1 : 1);
  },
};
