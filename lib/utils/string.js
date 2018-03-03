const xml2js = require('xml2js');

const LOGGER = getLogger('core.utils.string');
/**
 * 字符串工具
 */
module.exports = {
  /**
   * 生成指定长度的随机字符串
   * @param n 长度
   */
  randomString (n) {
    function random () {
      return Math.random().toString(36).substr(2).replace(new RegExp(/[0-9]+/g), '');
    }

    let str = random();
    while (str.length < n) {
      str += random();
    }
    str = str.substring(0, n);

    return str;
  },
  /**
   * 转为下划线风格
   * @param str 字符串
   */
  snakeCase (str) {
    return str.replace(/([^A-Z])([A-Z])/g, ($0, $1, $2) => `${$1}_${$2.toLowerCase()}`);
  },
  /**
   * 转为驼峰风格
   * @param str 字符串
   */
  camelCase (str) {
    if (str.indexOf('_') > -1) {
      return str.replace(/_(\w)/g, (a, b) => b.toUpperCase());
    }
    return str;
  },
  /**
   * 首字母小写
   * @param str 字符串
   */
  firstLowerCase (str) {
    return str ? str.substring(0, 1).toLowerCase() + str.substring(1) : '';
  },
  /**
   * 首字母大写
   * @param str 字符串
   */
  firstUpperCase (str) {
    return str ? str.substring(0, 1).toUpperCase() + str.substring(1) : '';
  },
  /**
   * 判断是否为json字符串
   * @param str 字符串或者对象
   */
  isJSON (str) {
    const typeSet = new Set(['object', '[object object]', '[object array]']);
    const type = Object.prototype.toString.call(str).toLowerCase();
    if (typeSet.has(type)) {
      return true;
    }

    if (/^[0-9]+$/g.test(str)) {
      return false;
    }

    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  /**
   * 截取定长开头字段,剩下的用省略号表示(str.length()<=length不处理)
   * @param str 字符串
   * @param length 截取的长度
   */
  cutLengthEllipses (str, length) {
    const strLength = str.length;
    if (strLength <= length) {
      return str;
    }
    return `${str.substring(0, length)}...`;
  },
  /**
   * 把xml字符串转成map
   * @param xml xml字符串
   */
  async xml2json (xml) {
    if (!xml || xml.length <= 0) {
      return {};
    }
    return new Promise(((resolve, reject) => {
      xml2js.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const json = {};
          for (const key of Object.keys(result.xml)) {
            json[key] = result.xml[key].toString().trim();
          }
          resolve(json);
        }
      });
    })).catch((error) => {
      LOGGER.error(error);
    });
  },
  /**
   * 把map转成xml字符串
   * @param json
   */
  json2xml (json) {
    let xml = '<xml>';
    const keys = json ? Object.keys(json) : [];
    if (json && keys.length > 0) {
      for (const key of keys) {
        xml += `<${key}>${json[key]}</${key}>`;
      }
    }
    xml += '</xml>';
    return xml;
  },
  /**
   * 过滤html标签
   * @param html
   */
  stripHTML (html) {
    let str = html.replace(new RegExp(/<script[^>]*>[\s\S]*?<\/[^>]*script>/ig), '');
    str = str.replace(new RegExp(/<!?\/?[a-zA-Z]+[^><]*>/ig), '');
    str = str.replace(new RegExp(/<!--[\s\S]*?--\>/ig), '');
    str = str.replace(new RegExp(/\[\s*if\s+[^\]][\s\w]*\]/ig), '');
    str = str.replace(new RegExp(/\s+/ig), '');
    return str.trim();
  }
};
