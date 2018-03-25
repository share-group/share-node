const logger = getLogger('core.utils.bcrypt');
const crypto = require('crypto');

module.exports = class {
  /**
   * bcrypt constructor
   */
  constructor (algorithm, key, iv) {
    this.iv = iv;
    this.key = key;
    this.algorithm = algorithm;
  }

  /**
   * 解密
   */
  decrypt (originData) {
    try {
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
      let decryptData = decipher.update(originData, 'base64', 'utf8');
      decryptData += decipher.final('utf8');
      return decryptData;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  /**
   * 加密
   */
  encrypt (originData) {
    try {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encryptData = cipher.update(originData, 'utf8', 'base64');
      encryptData += cipher.final('base64');
      return encryptData;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
};
