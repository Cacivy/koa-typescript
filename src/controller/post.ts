var router = require('koa-router')()
import Post from '../model/post'
import {resBody, resError, resInfo} from '../util/response'

interface PostModel {
	name?: String
	author: String
	content: String
}

router.get('/:id', async (ctx, next) => {
	let id = ctx.params.id

	await Post.findById(id).then((doc) => {
		ctx.body = resBody(doc)
	}).catch((reason) => {
		ctx.body = resError(reason)
	})
})

router.get('/', async (ctx, next) => {
	await Post.find({}).then((docs) => {
		ctx.body = resBody(docs)
	}).catch((reason) => {
		ctx.body = resError(reason)
	})
});

router.post('/', async (ctx, next) => {
	let body = ctx.request.body
	var post: PostModel = {
		name: body.name,
		author: body.author,
		content: body.content
	}

	await new Post(post).save().then((val) => {
		ctx.body = resBody(val)
	}).catch((reason) => {
		ctx.body = resError(reason)
	})
})

router.put('/:id', async (ctx, next) => {
	let id = ctx.params.id
	let body = ctx.request.body
	let post:PostModel = {
		author: body.author,
		content: body.content
	}

	await Post.findByIdAndUpdate(id, post).then((res) => {
		ctx.body = resInfo('success')
	}).catch((reason) => {
		ctx.body = resError(reason)
	})
})

router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Post.findByIdAndRemove(id).then((res) => {
		ctx.body = resInfo('success')
	}).catch((reason) => {
		ctx.body = resError(reason)
	})
})

module.exports = router;