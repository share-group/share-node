const logger = getLogger('core.utils.jwt');
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
  async encrypt(data, options = {}) {
    const _options = options || {};
    _options.algorithm = options.algorithm || 'RS256';
    _options.expiresIn = !options.expiresIn && options.expiresIn !== 0 ? 86400 : options.expiresIn;
    return jwt.sign(data || {}, this.privateKey, _options);
  }

  /**
   * jwt解密
   * @param data 待解密数据
   */
  async decrypt(data) {
    try {
      const result = jwt.verify(data, this.publicKey);
      delete result.iat;
      delete result.exp;
      return result;
    } catch (e) {
      logger.error('jwt decrypt error: ', data, e);
      return null;
    }
  }
};
