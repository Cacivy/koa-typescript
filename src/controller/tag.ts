import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Tag from '../model/tag'
import {resBody, resError, resInfo} from '../util/response'

interface TagModel {
	text: String
	date: Date
}

/**
 * @api {GET} http://localhost:8085/api/tag [获取所有标签]
 * @apiGroup Tag
 * @apiDescription 获取所有标签
 * @apiUse CODE_200
 * @apiUse CODE_500
 * @apiSuccessExample {json} Success Data Example
[
    {
      "_id": "585743f87dab573ef45f4841",
      "text": "js",
      "date": "2016-12-19T02:20:40.613Z",
      "__v": 0
    },
    {
      "_id": "5857445e7dab573ef45f4842",
      "text": "css",
      "date": "2016-12-19T02:22:22.337Z",
      "__v": 0
    },
    {
      "_id": "585744627dab573ef45f4843",
      "text": "vue",
      "date": "2016-12-19T02:22:26.133Z",
      "__v": 0
    },
    {
      "_id": "585744fd7dab573ef45f4844",
      "text": "angular2",
      "date": "2016-12-19T02:25:01.811Z",
      "__v": 0
    },
    {
      "_id": "585744ff7dab573ef45f4845",
      "text": "react",
      "date": "2016-12-19T02:25:03.463Z",
      "__v": 0
    }
]
 */
router.get('/', async (ctx, next) => {
	let path = url.parse(ctx.request.url, true)

	let total:number = await Tag.find().count({}).then((res: number) => {
		return res
	})

	await Tag
	.find()
	.then((docs) => {
		ctx.body = resBody(docs, total)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url,reason)
	})
})

/**
 * @api {POST} http://localhost:8085/api/category [添加标签]
 * @apiGroup Tag
 * @apiDescription 添加标签
 * @apiUse CODE_200
 * @apiUse CODE_500
*/
router.post('/', async (ctx, next) => {
	let body = ctx.request.body
	var tag: TagModel = {
		text: body.text,
		date: body.date || new Date()
	}

	await new Tag(tag).save().then((val) => {
		ctx.body = resBody(val)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

/**
 * @api {DELETE} http://localhost:8085/api/category/:id [删除标签]
 * @apiParam {Number} id Tag unique ID.
 * @apiGroup Tag
 * @apiDescription 删除标签
 * @apiUse CODE_200
 * @apiUse CODE_500
*/
router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Tag.findByIdAndRemove(id).then((res) => {
		ctx.body = resInfo(ctx.request.url, 'success')
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})


module.exports = router;
