// base model, every business models must extends it
const mongoose = require('mongoose');
const dbs = require('../bootstrap/mongoose');
const time = require('../utils/time');

module.exports = class {
  /**
   * base model constructor
   */
  constructor (name) {
    this.db = '';
    this.name = name;
    this.schema = {};
    this.init();

    if (!this.schema.createTime) {
      Object.assign(this.schema, {createTime: {type: Number, default: 0}});
    }

    if (!this.schema.updateTime) {
      Object.assign(this.schema, {updateTime: {type: Number, default: 0}});
    }

    // if not registe a schema it will registe one
    if (!mongoose.modelSchemas[this.name]) {
      const schema = new mongoose.Schema(this.schema);
      schema.set('collection', name);
      schema.set('autoIndex', true);
      schema.set('strict', true);
      schema.set('id', true);
      schema.set('versionKey', false);
      schema.set('minimize', true);
      schema.set('toObject', {getters: true, virtuals: true, minimize: true, id: true});
      schema.set('toJSON', {getters: true, virtuals: true, minimize: true, id: true});

      const connection = dbs.get(this.db);
      if (!connection) {
        throw new Error(`can not find db: ${this.db}`);
      }

      // before save hook
      const that = this;
      schema.pre('save', function (next) {
        that.beforeSave(this);
        next();
      });

      // after save hook
      schema.post('save', function (doc) {
        that.afterSave(doc);
      });

      const model = connection.model(this.name, schema, this.name);
      this.model = model;
      this.model.ObjectId = mongoose.Types.ObjectId;
    }
  }

  /**
   * waiting for subclass rewrite
   */
  init () {
    // waiting for subclass rewrite
  }

  /**
   * you can do some thing before document save
   */
  beforeSave (data) {
    const now = time.nowMillisecond();
    Object.assign(data, {createTime: now});
    Object.assign(data, {updateTime: now});
  }

  /**
   * you can do some thing after document save
   */
  afterSave (data) {
  }
};
