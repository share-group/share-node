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
    this.name = (anotherName || name.substr(name.lastIndexOf('/') + 1)).trim();
    this.schema = {};
    this.index = {};
    this.init();

    let category = (new Error()).stack.split('\n')[2].trim();
    category = category.substring(category.indexOf('(') + 1, category.indexOf(')')).trim();
    category = category.replace(share.APP_PATH, '').replace('.js', '').trim();
    category = category.substring(0, category.indexOf(':')).trim();
    category = category.split(path.sep).filter(item => !!item).map(v => v.trim()).join('.').trim();
    this.module = category.startsWith('app.model') ? '' : category.split('.')[1];
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
      schema.set('toObject', {getters: true, virtuals: true, minimize: true, id: true});
      schema.set('toJSON', {getters: true, virtuals: true, minimize: true, id: true});

      if (Array.isArray(this.index) && this.index.length > 0) {
        this.index.forEach(v => schema.index(v.index, v.option || {}));
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

  ObjectId(id) {
    return this.model.ObjectId(id);
  }

  async dropDatabase() {
    dbs.get(this.db).dropDatabase();
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

  /**
   * create
   * @param data
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * findById
   * @param id
   */
  async findById(id) {
    return this.model.findById(id);
  }

  /**
   * updateById
   * @param id
   * @param update
   * @param operator
   */
  async updateById(id, update, operator = '$set') {
    return this.model.updateById(id, {[operator]: update});
  }

  /**
   * pageList
   * @param page
   * @param pageSize
   * @param condition
   * @param sort
   * @param select
   */
  async pageList(page, pageSize, condition = {}, sort = {}, select = {}) {
    return this.model.find(condition, select).skip((page - 1) * pageSize).sort(sort).limit(pageSize);
  }

  /**
   * cursorList
   * @param cursor
   * @param pageSize
   * @param condition
   * @param sort
   * @param select
   */
  async cursorList(cursor, pageSize, condition = {}, sort = {}, select = {}) {
    if (cursor) {
      Object.assign(condition, {_id: {$lt: cursor}});
    }
    return this.model.find(condition, select).sort(sort).limit(pageSize);
  }
};
