// base controller, every business controllers must extends it
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const fsSync = require('fs-sync');
const mime = require('mime-types')
const {rand} = require('../utils/random');
const {format} = require('../utils/time');

module.exports = class {
  /**
   * base controller constructor
   * @Param ctx
   */
  constructor(ctx) {
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
  ip() {
    return this.ctx.header['x-forwarded-for'] || this.ctx.header['x-real-ip'];
  }

  /**
   * upload file
   * @param name the form name
   */
  upload(name) {
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

    const fileName = path.join(basePath, format('yyyyMMddhhmmssS') + rand(10000, 99999) + fileType[file.type]);
    fsSync.copy(file.path, fileName);
    this.logger.trace('uploading %s -> %s', file.name, fileName, file.size);
    return {path: fileName, type: fileType[file.type]};
  }

  /**
   * send file
   * @param file the file absolute path
   */
  async send (file) {
    const stst = fs.statSync(file);
    this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(path.basename(file))}`);
    this.ctx.set('Content-Type', mime.contentType(path.extname(file)));
    this.ctx.set('Content-Length', stst.size);
    this.ctx.body = fs.createReadStream(file);
    return this.ctx.body;
  }
};
