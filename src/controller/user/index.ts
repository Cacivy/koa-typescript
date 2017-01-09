import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import {resBody, resError, resInfo} from '../../util/response'

router.get('/', async (ctx, next) => {
	if (ctx.session.isNew || !ctx.session.user) {
			ctx.response.status = 403
			ctx.body = resError(ctx.request.url, '未登录')
  } else {
			ctx.body = resBody(JSON.parse(ctx.session.user))
	}
})

module.exports = router;