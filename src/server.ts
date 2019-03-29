/// <reference path="../typings/koa-session.d.ts" />
const Koa = require('koa')
const app = new Koa()
app.keys = ['secret', 'key'];
import { resBody, resError, resInfo } from './util/response'
app.on('error', (err, ctx) => {
	resError(ctx.request.url, err)
	console.log(err)
	// logger.error('server error', err, ctx)
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
const upload = multer({ storage })
var session = require('koa-session'); // session
var CONFIG = {
	key: 'cacivy', /** (string) cookie key (default is koa:sess) */
	maxAge: 1000 * 60 * 60 * 12, /** (number) maxAge in ms (default is 1 days) */
	overwrite: true, /** (boolean) can overwrite or not (default true) */
	httpOnly: true, /** (boolean) httpOnly or not (default true) */
	signed: true, /** (boolean) signed or not (default true) */
};
app.use(convert(session(CONFIG, app)));
app.use(convert(bodyparser()))
app.use(convert(json()))
app.use(cors({ credentials: true }))
app.use(convert(logger()))
const restc = require('restc');
app.use(restc.koa2());
var koaStatic = require('koa-static');
app.use(koaStatic(__dirname + '/../static'))
app.use(koaStatic(__dirname + '/../doc'))

// user valid
app.use(async (ctx: koarouter.IRouterContext, next) => {
	if (ctx.request.method !== 'GET') {
		if (ctx.session.isNew || !ctx.session.user) {
			if (ctx.request.url.indexOf('/api/user') === -1) {
				ctx.response.status = 403
				ctx.body = resError(ctx.request.url, '未登录')
			}
		}
	}
	await next()
});

// db
import mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://mongodb:27017/blog')

// router
import fs = require('fs')
import koarouter = require('koa-router')
const router = new koarouter()

// 递归读取controller,目前只支持二级目录
function readdirToRouter(child = '') {
	let path = `${__dirname}/controller${child ? `/${child}` : ''}`
	fs.readdirSync(path).forEach((file) => {
		let path = file.split('.')
		let name = path[0]
		if (path.length > 1) {
			if (path[path.length - 1] === 'js') {
				let child_path = child ? `${child}/` : ''
				let route = require(`./controller/${child_path}${name}`)
				if (name === 'index') {
					router.use(`/api/${child}`, route.routes(), route.allowedMethods())
				} else {
					router.use(`/api/${child_path}${name}`, route.routes(), route.allowedMethods())
				}
			}
		} else {
			readdirToRouter(file)
		}
	})
}
readdirToRouter()
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
