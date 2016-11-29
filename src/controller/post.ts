var router = require('koa-router')()
import Post from '../model/post'

interface PostModel {
	name?: String
	author: String
	content: String
}

router.get('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Post.findById(id, (err, res) => {
		ctx.body = res
	})
})

router.get('/', async (ctx, next) => {
	await Post.find({}, (err, res) => {
		ctx.body = res
	})
});

router.post('/', async (ctx, next) => {
	let body = ctx.request.body
	var post: PostModel = {
		name: body.name,
		author: body.author,
		content: body.content
	}

	await new Post(post).save((err, res) => {
		if (res) {
			ctx.body = res
		}
	})

	await ctx.redirect('/post')
})

router.put('/:id', async (ctx, next) => {
	let id = ctx.params.id
	let body = ctx.request.body
	let post:PostModel = {
		author: body.author,
		content: body.content
	}
	await Post.findByIdAndUpdate(id, post, (err, res) => {
		ctx.body = 'ok'
	})
})

module.exports = router;