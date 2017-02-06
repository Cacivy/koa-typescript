import koaRouter = require('koa-router')
const router = new koaRouter()

/**
 * @apiDefine CODE_500
 * @apiSuccessExample {json} Response 500 Example
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "message": "服务器错误"
 *   }
 */

/**
 * @apiDefine CODE_400
 * @apiSuccessExample {json} Response 400 Example
 *   HTTP/1.1 400 Internal Server Error
 *   {
	*     "message": "未找到路径"
	*   }
 */

/**
 * @apiDefine CODE_403
 * @apiSuccessExample {json} Response 400 Example
 *   HTTP/1.1 403 Internal Server Error
 *   {
	 *     "message": "无权限"
	 *   }
 */

/** js
 * @apiDefine CODE_200
 * @apiSuccessExample {json} Response 200 Example
 *   HTTP/1.1 200 Interface Error
 *   {
 *     "code": 200,
 *     "message": "请求成功",
 *     "data": {
 *       "result": [],
 *       "total": 10,
 *       "error": "error",
 *       "msg": "msg"
 *     }
 */
/** js
 * @apiDefine PAGE
 * @apiParam (page) {string} [sort] 排序字段名称
 * @apiParam (page) {number} [currentPage=1] 当前页
 * @apiParam (page) {number} [pageSize] 每页显示数量
 */
router.get('/', async (ctx, next) => {
	await ctx.render('index')
})

export = router