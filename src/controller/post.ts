import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Post from '../model/post'
import {resBody, resError, resInfo} from '../util/response'

interface PostModel {
	title?: String
	author: String
	content: String
	tag: Array<String>
	category: String
	date: Date
	delivery: Boolean
}

interface Query {
	sort?: string
	currentPage: number
	pageSize: number
	startTime: string
	endTime: string
	title: string
}

router.get('/:id', async (ctx, next) => {
	let id = ctx.params.id

	await Post.findById(id).then((doc) => {
		ctx.body = resBody(doc)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

router.get('/', async (ctx, next) => {
	let path = url.parse(ctx.request.url, true)
	let query:Query = path.query as Query
	let start:number = (+query.currentPage - 1) * +query.pageSize;

	let where:any = {}

	if (query.startTime || query.endTime) {
		where.date = {}
		if (query.startTime)
		where.date.$gte = new Date(query.startTime)
		if (query.endTime)
		where.date.$lte = new Date(query.endTime)
	}
	if (query.title) {
		where.title = new RegExp(query.title)
	}

	let total:number = await Post.find(where).count({}).then((res: number) => {
		return res
	})

	await Post
	.find(where)
	.skip(start)
	.limit(+query.pageSize)
	.sort({date : -1})
	.then((docs) => {
		ctx.body = resBody(docs, total)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url,reason)
	})
});

router.post('/', async (ctx, next) => {
	let body = ctx.request.body
	var post: PostModel = {
		title: body.title,
		author: body.author,
		content: body.content,
		tag: body.tag,
		category: body.category,
		date: body.date,
		delivery: body.delivery
	}

	await new Post(post).save().then((val) => {
		ctx.body = resBody(val)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

router.put('/', async (ctx, next) => {
	let body = ctx.request.body
	let post:PostModel = {
		author: body.author,
		content: body.content,
		tag: body.tag,
		category: body.category,
		date: body.date,
		delivery: body.delivery
	}

	await Post.findByIdAndUpdate(body._id, post).then((res) => {
		ctx.body = resInfo(ctx.request.url, 'success')
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Post.findByIdAndRemove(id).then((res) => {
		ctx.body = resInfo(ctx.request.url, 'success')
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

module.exports = router;