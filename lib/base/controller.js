// base controller, every business controllers must extends it
module.exports = class {
  /**
   * base controller constructor
   * @Param ctx
   */
  constructor (ctx) {
    this.ctx = ctx;

    let category = ctx.path.split('/').filter(item => !!item).join('.').trim();
    category = `app.controller.${category}`;
    this.logger = getLogger(category);
  }

  /**
   * get client ip
   */
  ip () {
    console.log('father');
  }
};
