const crypto = require('crypto');
/**
 * 加密模块
 */
module.exports = {
  /**
   * md5加密
   * @param str 字符串
   */
  md5(str) {
    return crypto.createHash('md5').update(str).digest('hex').trim();
  },
  /**
   * sha1加密
   * @param str 字符串
   */
  sha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex').trim();
  },
  /**
   * sha256加密
   * @param str 字符串
   * @param key 钥匙
   */
  sha256(str, key) {
    return crypto.createHmac('sha256', key).update(str).digest('hex').trim();
  },
  /**
   * sha512加密
   * @param str 字符串
   * @param key 钥匙
   */
  sha512(str, key) {
    return crypto.createHmac('sha512', key).update(str).digest('hex').trim();
  },
  /**
   * pbkdf2加密
   * @param str 字符串
   * @param key 钥匙
   */
  pbkdf2(str, key) {
    return crypto.pbkdf2Sync(str, key, 64, 64, 'sha512').toString('hex').trim();
  },
  /**
   * base64编码
   * @param data 待编码数据
   */
  base64Encode(data) {
    return Buffer.from(data, 'binary').toString('base64').trim();
  },
  /**
   * base64解码
   * @param data 待解码数据
   */
  base64Decode(data) {
    return Buffer.from(data, 'base64').toString().trim();
  },
};
