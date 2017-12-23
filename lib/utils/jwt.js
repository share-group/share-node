const logger = getLogger();
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = class {
  /**
   * 构造函数
   * @param publicKey 公钥文件
   * @param privateKey 私钥文件
   */
  constructor(publicKey, privateKey) {
    this.publicKey = fs.readFileSync(publicKey, 'utf-8');
    this.privateKey = fs.readFileSync(privateKey, 'utf-8');
  }

  /**
   * jwt加密
   * @param data 要加密的数据
   * @param options 选项
   */
  async encrypt(data, options = {algorithm: 'RS256', expiresIn: 86400}) {
    return jwt.sign(data || {}, this.privateKey, options);
  }

  /**
   * jwt解密
   * @param data 待解密数据
   */
  async decrypt(data) {
    try {
      return jwt.verify(data, this.publicKey);
    } catch (e) {
      logger.error('jwt decrypt error: ', data, e);
      return '';
    }
  }
};
