// base model, every business models must extends it
const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const dbs = require('../bootstrap/mongoose');

module.exports = class {
  /**
   * base model constructor
   */
  constructor(name) {
    this.db = '';
    this.name = name;
    this.schema = {};
    this.Types = mongoose.Types;
    this.init();
    Object.assign(this.schema, { createTime: { type: this.Types.Long, default: 0, index: true } });
    Object.assign(this.schema, { updateTime: { type: this.Types.Long, default: 0, index: true } });
    const schema = new mongoose.Schema(this.schema, { autoIndex: true, strict: true, versionKey: false });
    const connection = dbs.get(this.db);
    if (!connection) {
      throw new Error(`can not find db: ${this.db}`);
    }

    const model = connection.model(this.name, schema, this.name);
    model.ObjectId = this.Types.ObjectId;
    this.model = model;
  }

  /**
   * waiting for subclass rewrite
   */
  init() {
    // waiting for subclass rewrite
  }
};
