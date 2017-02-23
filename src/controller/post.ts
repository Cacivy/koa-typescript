import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Post from '../model/post'
import {resBody, resError, resInfo} from '../util/response'

interface PostModel {
	title?: String
	author: String
	content: String
	html: String
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

/**
 * @api {GET} http://localhost:8085/api/post/:id [获取某篇文章]
 * @apiParam {Number} id Post unique ID.
 * @apiGroup Post
 * @apiDescription 根据文章ID获取某篇文章
 * @apiUse CODE_200
 * @apiUse CODE_500
 * @apiSuccessExample {json} Success Data Example
{
    "_id": "587c2f5539c06d2e689c808c",
    "title": "test",
    "author": "admin",
    "content": "# dsas",
    "category": "笔记",
    "date": "2017-01-16T00:00:00.000Z",
    "delivery": false,
    "__v": 0,
    "tag": [
      "mock",
      "dva",
      "eve"
    ]
  },
  "total": 0,
  "error": false,
  "msg": ""
}
 */
router.get('/:id', async (ctx, next) => {
	let id = ctx.params.id

	await Post.findById(id).then((doc) => {
		ctx.body = resBody(doc)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

/**
 * @api {GET} http://localhost:8085/api/post [获取所有文章]
 * @apiParam (page) {date} [startTime] 开始时间
 * @apiParam (page) {date} [endTime] 结束时间
 * @apiParam (page) {string} [title] 标题
 * @apiGroup Post
 * @apiDescription 获取所有文章
 * @apiUse PAGE
 * @apiUse CODE_200
 * @apiUse CODE_500
 */
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

/**
 * @api {POST} http://localhost:8085/api/post [添加文章]
 * @apiGroup Post
 * @apiDescription 添加文章
 * @apiUse CODE_200
 * @apiUse CODE_500
*/
router.post('/', async (ctx, next) => {
	let body = ctx.request.body
	var post: PostModel = {
		title: body.title,
		author: body.author,
		content: body.content,
		html: body.html,
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

/**
 * @api {PUT} http://localhost:8085/api/post [修改文章]
 * @apiGroup Post
 * @apiDescription 根据文章ID修改当前文章
 * @apiUse CODE_200
 * @apiUse CODE_500
*/
router.put('/', async (ctx, next) => {
	let body = ctx.request.body
	let post:PostModel = {
		author: body.author,
		content: body.content,
		html: body.html,
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

/**
 * @api {DELETE} http://localhost:8085/api/post/:id [删除文章]
 * @apiParam {Number} id Post unique ID.
 * @apiGroup Post
 * @apiDescription 删除文章
 * @apiUse CODE_200
 * @apiUse CODE_500
*/
router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Post.findByIdAndRemove(id).then((res) => {
		ctx.body = resInfo(ctx.request.url, 'success')
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

module.exports = router;