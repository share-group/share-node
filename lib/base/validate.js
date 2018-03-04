const base = getController();
const joi = require('../utils/joi');

module.exports = class extends base {
  constructor(ctx) {
    super(ctx);
    this.joi = joi;

    let category = ctx.path.split('/').filter(item => !!item).join('.').trim();
    category = `app.validate.${category}`;
    this.logger = getLogger(category);
  }

  /**
   * validate header
   * @param schema
   */
  header(schema) {
    this.joi.validate(this.ctx.header, schema);
  }

  /**
   * validate method
   * @param methods
   */
  method(...methods) {
    let expectMethods = methods.map(m => m.toLowerCase());
    expectMethods = expectMethods.length > 0 ? expectMethods : [];
    if (expectMethods.length <= 0) {
      return {};
    }
    return this.joi.validate({method: this.ctx.method.toLowerCase()}, {
      method: this.joi.string().required().valid(expectMethods).strict()
        .error(new Error(`url '${this.ctx.url}' method error, expect '${expectMethods.join('|')}' but actual '${this.ctx.method.toLowerCase()}'`)),
    });
  }

  /**
   * validate params
   * @param schema
   */
  params(schema) {
    if (this.ctx.headers['content-type'].startsWith('multipart/form-data')) {
      this.joi.validate(this.ctx.params.files, schema);
    } else {
      this.ctx.params = this.joi.validate(this.ctx.params, schema);
    }
  }
};
