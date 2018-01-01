process.mainModule.children[0].parent.filename = '';
new (require('../lib/http'))();
module.exports = require('ava');
