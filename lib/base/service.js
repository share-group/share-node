// base service, every business service must extends it
const path = require('path');

module.exports = class {
  /**
   * base service constructor
   */
  constructor() {
    let category = (new Error()).stack.split('\n')[2].trim();
    category = category.substring(category.indexOf('(') + 1, category.indexOf(')')).trim();
    category = category.replace(share.APP_PATH, '').replace('.js', '').trim();
    category = category.substring(0, category.indexOf(':')).trim();
    category = category.split(path.sep).filter(item => !!item).join('.').trim();
    this.logger = getLogger(category);
  }
};
