"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const koaRouter = require("koa-router");
const router = new koaRouter();
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
router.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield ctx.render('index');
}));
module.exports = router;
//# sourceMappingURL=index.js.map