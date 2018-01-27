module.exports = {
  humanize (n, options) {
    const _options = options || {};
    const d = _options.delimiter || ',';
    const s = _options.separator || '.';
    const _n = n.toString().split('.');
    _n[0] = _n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${d}`);
    return _n.join(s);
  },
  fixedFloat (number, byte) {
    if (!number) {
      return 0;
    }
    if (!byte) {
      byte = 2;
    }
    return parseFloat(number.toFixed(parseInt(byte)));
  },
  fixedFloatPro (number) {
    const left = Math.abs(number - this.fixedFloat(number));
    // 是 0.34999999999 的情况才 fix
    if (left < 0.00001) {
      return this.fixedFloat(number);
    }
    return number;
  },
  cutFloat (number, digits) {
    if (!number || digits < 0) return number;
    digits = digits || 2;
    number = this.fixedFloatPro(number);
    const isMinus = (number < 0);
    if (isMinus) {
      number = number * -1;
    }
    const result = this.fixedFloatPro(Math.floor(number, digits));
    return result * (isMinus ? -1 : 1);
  }
};
