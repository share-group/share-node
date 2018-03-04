// base controller, every business controllers must extends it
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const {rand} = require('../utils/random');
const {format} = require('../utils/time');

module.exports = class {
  /**
   * base controller constructor
   * @Param ctx
   */
  constructor (ctx) {
    this.ctx = ctx;

    const prefix = share.config.apiPrefix || '';
    ctx.path = ctx.path.replace(prefix, '');
    ctx.path = ctx.path.replace(new RegExp(/(\/){2,}/g), '/');
    let category = ctx.path.split('/').filter(item => !!item).join('.').trim();
    category = `app.controller.${category}`;
    this.logger = getLogger(category);
  }

  /**
   * get client ip
   */
  ip () {
    return this.ctx.req.headers['x-forwarded-for'] || this.ctx.req.headers['x-real-ip'];
  }

  /**
   * upload file
   * @param name the form name
   */
  upload (name) {
    const {files} = this.ctx.params;
    if (!files || Object.keys(files).length <= 0) {
      return '';
    }

    const fileType = {
      'image/png': '.png',
      'image/jpg': '.jpg',
      'image/jpeg': '.jpeg',
      'image/x-icon': '.ico',
    };

    const file = files[name];
    const basePath = `${share.APP_PATH}temp/upload/${format('yyyy')}/${format('MM')}/${format('dd')}`;
    if (!fs.existsSync(basePath)) {
      mkdirp.sync(basePath);
    }

    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join(basePath, format('yyyyMMddhhmmssS') + rand(10000, 99999) + fileType[file.type]));
    reader.pipe(stream);
    this.logger.trace('uploading %s -> %s', file.name, stream.path, file.size);
    return {path: stream.path, type: fileType[file.type]};
  }
};
