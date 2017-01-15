import koaRouter = require('koa-router')
const router = new koaRouter()
import url = require('url')
import Data from '../model/data'
import Post from '../model/post'
import {resBody, resError, resInfo} from '../util/response'
import {convertToDate} from '../util/date'

interface Option {
	label?: String
	data?: Array<Number | String>
	labels?: Array<String>
	list?: Array<Array<string | number>>
}

interface DataModel {
	title: String
	type: String
	options: Option
}

enum ChartType {
	pie,
	doughnut,
	line,
	word
}

router.get('/', async (ctx, next) => {
	let arr = []
	await Post.aggregate({
			$group:{_id :"$delivery" ,count:{$sum:1}}
	}).exec((err, res:any) => {
		let obj: DataModel = {
			title: '文章数据',
			type: ChartType[ChartType.pie],
			options: {
				data: res.map(x => x.count),
				labels: res.map(x => x._id ? '已发布' : '未发布')
			}
		}
		arr.push(obj)
	})

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
		let data = res.map(x => x.count)
		let labels = res.map(x => x._id)
		let obj: DataModel = {
			title: '标签数据',
			type: ChartType[ChartType.doughnut],
			options: {
				data: data,
				labels: labels
			}
		}
		// list
		let list:Array<Array<number | string>> = []
		data.forEach((x:number ,i:number) => {
			list.push([labels[i], x * 20])
		})
		let obj2: DataModel = {
			title: '标签云',
			type: ChartType[ChartType.word],
			options: {
				list: list
			}
		}
		arr.push(obj)
		arr.push(obj2)
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