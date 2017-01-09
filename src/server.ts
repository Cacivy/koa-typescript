const Koa = require('koa')
const app = new Koa()
app.keys = ['secret', 'key'];
import {resBody, resError, resInfo} from './util/response'
app.on('error', (err, ctx) => {
	resError(ctx.request.url, err)
	console.log(err)
	logger.error('server error', err, ctx)
})

// views
const views = require('koa-views')
app.use(views(__dirname + '/../views', {
	extension: 'jade'
}))

// 中间件
const convert = require('koa-convert') // 转换为2.0
const json = require('koa-json') // ctx.body = {a: 1}
var cors = require('koa-cors'); // cors
import bodyparser = require('koa-bodyparser') // ctx.request.body
const logger = require('koa-logger') // print console
const multer = require('koa-multer'); // upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({storage})
var session = require('koa-session'); // session
var CONFIG = {
  key: 'cacivy', /** (string) cookie key (default is koa:sess) */
  maxAge: 1000*60*60*12, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};
app.use(convert(session(CONFIG, app)));
app.use(convert(bodyparser()))
app.use(convert(json()))
app.use(cors({credentials: true}))
app.use(convert(logger()))
app.use(require('koa-static')(__dirname + '/../static'))
const restc = require('restc');
app.use(restc.koa2());

// user valid
app.use(async (ctx, next) => {
	if (['/api/login', '/api/upload'].indexOf(ctx.request.url) > -1) {
	  await next()
	} else if (ctx.request.url === '/api/user' && ctx.session.user) {
			ctx.body = resBody(JSON.parse(ctx.session.user))
	} else if (ctx.session.isNew || !ctx.session.user) {
			ctx.response.status = 403
			ctx.body = resError(ctx.request.url, '未登录')
  } else {
		await next();
	}
});

// db
import mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/blog')

// router
import fs = require('fs')
import koarouter = require('koa-router')
const router = new koarouter()
fs.readdirSync(__dirname + '/controller').forEach((file) => {
	let path = file.split('.')
	let name = path[0]
	if (name !== 'index' && path[path.length - 1] === 'js') {
		let route = require('./controller/' + name)
		router.use(`/api/${name}`, route.routes(), route.allowedMethods())
	}
})
import index = require('./controller/index');
router.use('/', index.routes(), index.allowedMethods());
app.use(router.routes(), router.allowedMethods());
router.post('/api/upload', upload.single('upfiles'), async (ctx, next) => {
	  const {originalname, path, mimetype} = ctx.req.file;
    ctx.body = resBody(path)
});

// server
import http = require('http')
var port = process.env.PORT || '8085'
var server = http.createServer(app.callback())
server.listen(port)
server.on('listen', () => {
	var addr = server.address()
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port
	console.log('Listening on ' + bind)
})
