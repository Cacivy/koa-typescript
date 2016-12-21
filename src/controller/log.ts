import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Log from '../model/log'
import {resBody, resError, resInfo} from '../util/response'

interface Query {
	sort?: string
	currentPage: number
	pageSize: number
	startTime: string
	endTime: string
	filterText: string
	filterType: string
}

router.get('/', async (ctx, next) => {
	let path = url.parse(ctx.request.url, true)
	let query:Query = path.query as Query
	let start:number = (+query.currentPage - 1) * +query.pageSize;

	let where:any = {}

	if (query.startTime || query.endTime) {
		where.time = {}
		if (query.startTime)
		where.time.$gte = new Date(query.startTime)
		if (query.endTime)
		where.time.$lte = new Date(query.endTime)
	}
	if (query.filterType && query.filterText) {
		where[query.filterType] = new RegExp(query.filterText)
	}

	let total:number = await Log.find(where).count({}).then((res: number) => {
		return res
	})

	await Log
	.find(where)
	.skip(start)
	.limit(+query.pageSize)
	.sort({time : -1})
	.then((docs) => {
		ctx.body = resBody(docs, total)
	}).catch((reason) => {
		ctx.body = resError(ctx.request.url,reason)
	})
})

module.exports = router;
