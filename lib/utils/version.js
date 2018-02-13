module.exports = {
  /**
   * 版本号转成数字
   * @param version 版本号(xxxx.xxxx.xxxx)
   */
  versionToNumber(version) {
    const arr = String(version).trim().replace(new RegExp(/[^0-9]+/ig), '').split('.');
    const number1 = parseInt(arr[0]) || 0;
    const number2 = parseInt(arr[1]) || 0;
    const number3 = parseInt(arr[2]) || 0;
    return number1 * 100000000 + number2 * 10000 + number3;
  },
  /**
   * 判断左边的版本号是否比右边的版本号新
   * @param version1 版本1
   * @param version2 版本2
   */
  gt(version1, version2) {
    const number1 = this.versionToNumber(version1);
    const number2 = this.versionToNumber(version2);
    return number1 > number2;
  },
  /**
   * 判断左边的版本号是否比右边的版本号旧
   * @param version1 版本1
   * @param version2 版本2
   */
  lt(version1, version2) {
    const number1 = this.versionToNumber(version1);
    const number2 = this.versionToNumber(version2);
    return number1 < number2;
  },
  /**
   * 判断左边的版本号是否比右边的版本号相等
   * @param version1 版本1
   * @param version2 版本2
   */
  eq(version1, version2) {
    const number1 = this.versionToNumber(version1);
    const number2 = this.versionToNumber(version2);
    return number1 === number2;
  },
};
