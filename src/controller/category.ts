import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Category from '../model/category'
import {resBody, resError, resInfo} from '../util/response'

interface CategoryModel {
	text: String
	date: Date
}

/**
 * @api {GET} http://localhost:8085/api/category [获取所有分类]
 * @apiGroup Category
 * @apiDescription 获取所有分类
 * @apiUse CODE_200
 * @apiUse CODE_500
 * @apiSuccessExample {json} Success Data Example
	[
			{
				"_id": "58574961e41d873604a59e8c",
				"text": "技术",
				"date": "2016-12-19T02:43:45.951Z",
				"__v": 0
			},
			{
				"_id": "58574982e41d873604a59e8d",
				"text": "笔记",
				"date": "2016-12-19T02:44:18.629Z",
				"__v": 0
			},
			{
				"_id": "585749aaeb1b95321856d9af",
				"text": "其它",
				"date": "2016-12-19T02:44:58.389Z",
				"__v": 0
			},
			{
				"_id": "585749b4eb1b95321856d9b0",
				"text": "测试",
				"date": "2016-12-19T02:45:08.094Z",
				"__v": 0
			},
			{
				"_id": "585ce1bde74aec51ec2d191a",
				"text": "gg",
				"date": "2016-12-23T08:35:09.550Z",
				"__v": 0
			}
		]
*/
router.get('/', async (ctx, next) => {
	let path = url.parse(ctx.request.url, true)

	let total:number = await Category.find().count({}).then((res: number) => {
		return res
	})

	await Category
	.find()
	.then((docs) => {
		ctx.body = resBody(docs, total)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url,reason)
	})
})

/**
 * @api {POST} http://localhost:8085/api/category [添加分类]
 * @apiGroup Category
 * @apiDescription 添加分类
 * @apiUse CODE_200
 * @apiUse CODE_500
*/
router.post('/', async (ctx, next) => {
	let body = ctx.request.body
	var category: CategoryModel = {
		text: body.text,
		date: body.date || new Date()
	}

	await new Category(category).save().then((val) => {
		ctx.body = resBody(val)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})

/**
 * @api {DELETE} http://localhost:8085/api/category/:id [删除分类]
 * @apiParam {Number} id Category unique ID.
 * @apiGroup Category
 * @apiDescription 删除分类
 * @apiUse CODE_200
 * @apiUse CODE_500
*/
router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Category.findByIdAndRemove(id).then((res) => {
		ctx.body = resInfo(ctx.request.url, 'success')
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})


module.exports = router;
