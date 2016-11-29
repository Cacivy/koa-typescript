import koaRouter = require('koa-router')
const router = new koaRouter()

router.get('/', async function (ctx: koaRouter.IRouterContext, next) {
	await ctx.render('index')
})

export = router