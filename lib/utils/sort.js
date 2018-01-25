module.exports = {
  /**
   * 把对象按照属性名的字母顺序进行排列
   * @param obj 对象
   */
  objKeySort(obj) {
    const newkey = Object.keys(obj).sort();
    const newObj = {};
    for (let i = 0; i < newkey.length; i += 1) {
      newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
  },
};
