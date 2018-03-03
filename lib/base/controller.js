// base controller, every business controllers must extends it
module.exports = class {
  /**
   * base controller constructor
   * @Param ctx
   */
  constructor(ctx) {
    this.ctx = ctx;

    ctx.path = ctx.path.replace(new RegExp(/(\/){2,}/g), '/');
    let category = ctx.path.split('/').filter(item => !!item).join('.').trim();
    category = `app.controller.${category}`;
    this.logger = getLogger(category);
  }

  /**
   * get client ip
   */
  ip() {
    return this.ctx.req.headers['x-forwarded-for'] || this.ctx.req.headers['x-real-ip'];
  }
};
