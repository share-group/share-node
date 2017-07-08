// base controller, every business controllers must extends it
module.exports = class {
  /**
   * base controller constructor
   * @Param ctx
   */
  constructor(ctx) {
    this.ctx = ctx;

    // global logger
    this.LOG = getLogger(`controller${ctx.url.replace(new RegExp(/\//ig), '.')}`);
  }

  /**
   * get client ip
   */
  ip() {
    console.log('father');
  }
};
