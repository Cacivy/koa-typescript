import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Tag from '../model/tag'
import {resBody, resError, resInfo} from '../util/response'

interface TagModel {
	text: String
	date: Date
}

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


router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id
	await Tag.findByIdAndRemove(id).then((res) => {
		ctx.body = resInfo(ctx.request.url, 'success')
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url, reason)
	})
})


module.exports = router;
