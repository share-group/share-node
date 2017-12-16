// base controller, every business controllers must extends it
module.exports = class {
  /**
   * base controller constructor
   * @Param ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * get client ip
   */
  ip() {
    console.log('father');
  }
};
