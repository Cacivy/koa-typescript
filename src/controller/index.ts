import koaRouter = require('koa-router')
const router = new koaRouter()

router.get('/', async (ctx:any, next) => {
	await ctx.render('index')
})

export = router