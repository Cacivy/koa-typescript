var router = require('koa-router')()

router.get('/', async function (ctx, next) {
	await ctx.render('index');
});

module.exports = router;