import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Data from '../model/data'
import Post from '../model/post'
import {resBody, resError, resInfo} from '../util/response'
import {convertToDate} from '../util/date'

interface Option {
	label?: String
	data: Array<Number | String>
	labels: Array<String>
}

interface DataModel {
	title: String
	type: String
	options: Option
}

enum ChartType {
	pie,
	doughnut,
	line
}

router.get('/', async (ctx, next) => {
	let arr = []
	await Post.aggregate({
			$group:{_id :"$category" ,count:{$sum:1}}
	}).exec((err, res:any) => {
		let obj: DataModel = {
			title: '分类数据',
			type: ChartType[ChartType.pie],
			options: {
				data: res.map(x => x.count),
				labels: res.map(x => x._id)
			}
		}
		arr.push(obj)
	})

	await Post.aggregate([
		{$unwind: "$tag" },{
			$group:{_id :"$tag" ,count:{$sum:1}}
	}]).exec((err, res:any) => {
		let obj: DataModel = {
			title: '标签数据',
			type: ChartType[ChartType.doughnut],
			options: {
				data: res.map(x => x.count),
				labels: res.map(x => x._id)
			}
		}
		arr.push(obj)
	})

	await Post.aggregate([
		{$group:{_id :"$date", count:{$sum:1}}},
		{$sort: {_id: 1}}
	]).exec((err, res:any) => {
		let obj: DataModel = {
			title: '文章日期趋势',
			type: ChartType[ChartType.line],
			options: {
				label: 'post',
				data: res.map(x => parseInt(x.count)),
				labels: res.map(x => convertToDate(x._id))
			}
		}
		arr.push(obj)
	})

	ctx.body = resBody(arr)
})

module.exports = router;