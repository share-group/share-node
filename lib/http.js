global.Promise = require('bluebird'); // 用bluebird取代全局的Promise
const http = require('http');
const Koa = require('koa');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const cors = require('koa-cors');

const app = new Koa();
const port = 12344;

app.use(bodyParser());
app.use(json());
app.use(convert(cors()));
app.use(helmet());
app.use(logger());
const server = http.createServer(app.callback());
server.listen(port);

