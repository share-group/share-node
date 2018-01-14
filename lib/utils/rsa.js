const logger = getLogger();
const cryptos = require('cryptos');
const fs = require('fs');

module.exports = class {
  /**
   * rsa constructor
   */
  constructor(publicKey, privateKey) {
    this.publicKey = fs.readFileSync(publicKey).toString();
    this.privateKey = fs.readFileSync(privateKey).toString();
  }

  /**
   * rsa加密
   */
  encrypt(data) {
    try {
      return cryptos.RSAEncrypt(data, this.publicKey, {});
    } catch (e) {
      logger.error('error encrypt data: ', data, e);
      return null;
    }
  }

  /**
   * rsa解密
   */
  decrypt(data) {
    try {
      return cryptos.RSADecrypt(data, this.privateKey, {});
    } catch (e) {
      logger.error('error decrypt data: ', data, e);
      return null;
    }
  }
};
