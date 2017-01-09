import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import {resBody, resError, resInfo} from '../../util/response'

router.get('/', async (ctx, next) => {
	ctx.session.user= null
	ctx.body = resBody({}, 0, false, '')
})

module.exports = router;