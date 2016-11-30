import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Post from '../model/post'
import {resBody, resError, resInfo} from '../util/response'

interface PostModel {
	name?: String
	author: String
	content: String
}

interface Query {
	limit: number
	sort?: string
	page: number
	pagesize: number
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
	let path = url.parse(ctx.request.url, true)
	let query:Query = path.query as Query
	let start:number = (+query.page - 1) * +query.pagesize;

	let total:number = await Post.count({}).then((res: number) => {
		return res
	})
	await Post.find()
	.skip(start)
	.limit(+query.limit)
	.sort(query.sort)
	.then((docs) => {
		ctx.body = resBody(docs, total)
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

router.put('/', async (ctx, next) => {
	let body = ctx.request.body
	let post:PostModel = {1
		author: body.author,
		content: body.content
	}

	await Post.findByIdAndUpdate(body.id, post).then((res) => {
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