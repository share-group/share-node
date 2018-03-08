const crypto = require('crypto');

module.exports = class {
  /**
   * bcrypt constructor
   */
  constructor(algorithm, key, iv) {
    this.iv = iv;
    this.key = key;
    this.algorithm = algorithm;
  }

  /**
   * 解密
   */
  decrypt(originData) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decryptData = decipher.update(originData, 'base64', 'utf8');
    decryptData += decipher.final('utf8');
    return decryptData;
  }

  /**
   * 加密
   */
  encrypt(originData) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encryptData = cipher.update(originData, 'utf8', 'base64');
    encryptData += cipher.final('base64');
    return encryptData;
  }
};
