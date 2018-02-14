// base model, every business models must extends it
const path = require('path');
const mongoose = require('mongoose');
const dbs = require('../bootstrap/mongoose');

module.exports = class {
  /**
   * base model constructor
   */
  constructor(name, anotherName) {
    this.db = '';
    this.strict = true;
    this.timestamps = false;
    this.name = anotherName || name;
    this.schema = {};
    this.index = {};
    this.init();

    let category = (new Error()).stack.split('\n')[2].trim();
    category = category.substring(category.indexOf('(') + 1, category.indexOf(')')).trim();
    category = category.replace(share.APP_PATH, '').replace('.js', '').trim();
    category = category.substring(0, category.indexOf(':')).trim();
    category = category.split(path.sep).filter(item => !!item).join('.').trim();
    this.logger = getLogger(category);

    const connection = dbs.get(this.db);
    if (!connection) {
      throw new Error(`can not find db: ${this.db}`);
    }

    // if not registe a schema it will registe one
    if (!mongoose.modelSchemas[this.name]) {
      const schema = new mongoose.Schema(this.schema);
      schema.set('collection', name);
      schema.set('timestamps', this.timestamps);
      schema.set('autoIndex', true);
      schema.set('strict', this.strict);
      schema.set('id', true);
      schema.set('_id', false);
      schema.set('versionKey', false);
      schema.set('minimize', true);
      schema.set('toObject', {
        getters: true, virtuals: true, minimize: true, id: true,
      });
      schema.set('toJSON', {
        getters: true, virtuals: true, minimize: true, id: true,
      });

      if (Object.keys(this.index).length > 0) {
        schema.index(this.index);
      }

      // before save hook
      const that = this;
      schema.pre('save', async (next) => {
        await that.beforeSave();
        next();
      });

      // before update hook
      schema.pre('update', async (next) => {
        await that.beforeUpdate();
        next();
      });

      // after save hook
      schema.post('save', async () => {
        await that.afterSave();
      });

      // after update hook
      schema.post('update', async () => {
        await that.afterUpdate();
      });

      this.model = connection.model(this.name, schema, this.name);
    } else {
      this.model = connection.model(this.name);
    }
    this.model.ObjectId = mongoose.Types.ObjectId;
  }

  instance() {
    return this.model;
  }

  /**
   * waiting for subclass rewrite
   */
  init() {
    throw new Error('please implement init() function');
  }

  /**
   * you can do some thing before document save
   */
  beforeSave() {
    // waiting for subclass rewrite
  }

  /**
   * you can do some thing after document save
   */
  afterSave() {
    // waiting for subclass rewrite
  }

  /**
   * you can do some thing before document update
   */
  beforeUpdate() {
    // waiting for subclass rewrite
  }

  /**
   * you can do some thing after document update
   */
  afterUpdate() {
    // waiting for subclass rewrite
  }
};
