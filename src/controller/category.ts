import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Category from '../model/category'
import {resBody, resError, resInfo} from '../util/response'

interface CategoryModel {
	text: String
	date: Date
}

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


router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Category.findByIdAndRemove(id).then((res) => {
		ctx.body = resInfo(ctx.request.url, 'success')
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})


module.exports = router;
