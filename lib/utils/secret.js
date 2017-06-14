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
    return crypto.createHash("md5").update(str).digest("hex").trim();
  },
  /**
   * 哈希加密
   * @param str 字符串
   */
  sha1(str) {
    return crypto.createHash("sha1").update(str).digest("hex").trim();
  },
  /**
   * base64编码
   * @param data 待编码数据
   */
  base64Encode(data){
    return Buffer.from(data, 'binary').toString('base64').trim();
  },
  /**
   * base64解码
   * @param data 待解码数据
   */
  base64Decode(data){
    return new Buffer(data, 'base64').toString().trim();
  }
};
