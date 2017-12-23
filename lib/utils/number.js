module.exports = {
  humanize(n, options) {
    const _options = options || {};
    const d = _options.delimiter || ',';
    const s = _options.separator || '.';
    const _n = n.toString().split('.');
    _n[0] = _n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${d}`);
    return _n.join(s);
  },
};
