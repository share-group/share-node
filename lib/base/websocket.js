// base websocket, every business websocket handlers must extends it

module.exports = class {
  /**
   * base websocket constructor
   */
  constructor(category) {
    this.logger = getLogger(`app.websocket.${category}`);
  }

  /**
   * get client ip
   */
  ip() {
    return this.ctx.header['x-forwarded-for'] || this.ctx.header['x-real-ip'];
  }
};
