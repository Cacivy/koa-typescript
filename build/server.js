"use strict";
const Koa = require('koa');
const app = new Koa();
app.on('error', (err, ctx) => {
    console.log(err);
    logger.error('server error', err, ctx);
});
// views
const views = require('koa-views');
app.use(views(__dirname + '/../views', {
    extension: 'jade'
}));
// 中间件
const convert = require('koa-convert'); // 转换为2.0
const json = require('koa-json'); // ctx.body = {a: 1}
const bodyparser = require("koa-bodyparser"); // ctx.request.body
const logger = require('koa-logger'); // print console
app.use(convert(bodyparser()));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/../static'));
const restc = require('restc');
app.use(restc.koa2());
// db
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blog');
// router
const fs = require("fs");
const koarouter = require("koa-router");
const router = new koarouter();
fs.readdirSync(__dirname + '/controller').forEach((file) => {
    let path = file.split('.');
    let name = path[0];
    if (name !== 'index' && path[path.length - 1] === 'js') {
        let route = require('./controller/' + name);
        router.use(`/${name}`, route.routes(), route.allowedMethods());
    }
});
const index = require("./controller/index");
router.use('/', index.routes(), index.allowedMethods());
app.use(router.routes(), router.allowedMethods());
// server
const http = require("http");
var port = process.env.PORT || '8080';
var server = http.createServer(app.callback());
server.listen(port);
server.on('listen', () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});
//# sourceMappingURL=server.js.map