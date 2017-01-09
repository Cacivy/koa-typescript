import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import {resBody, resError, resInfo} from '../../util/response'

interface UserModel {
	username: string
	password: string
}

router.post('/', async (ctx, next) => {
	let body = ctx.request.body
	let user:UserModel = {
		username: body.username,
		password: body.password
	}
	if (user.username === 'admin' && user.password === 'admin') {
		delete user.password
		ctx.session.user = JSON.stringify(user)
		ctx.body = resBody(user, 0, false, '')
	} else {
		ctx.response.status = 401
		ctx.body = resBody({}, 0, true, '用户名或密码不正确')
	}
})

module.exports = router;