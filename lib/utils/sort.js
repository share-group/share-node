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
  /**
   * 根据kv结构的key排序
   * @param data kv结构的数据
   * @param compare 排序比较函数
   */
  sortKey(data, compare) {
    const result = {};
    const keys = Object.keys(data);
    keys.sort(compare);
    for (const key of keys) {
      result[key] = data[key];
    }
    return result;
  },
};
