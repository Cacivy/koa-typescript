"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const koaRouter = require("koa-router");
const router = new koaRouter();
const url = require("url");
const post_1 = require("../model/post");
const response_1 = require("../util/response");
router.get('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let id = ctx.params.id;
    yield post_1.default.findById(id).then((doc) => {
        ctx.body = response_1.resBody(doc);
    }).catch((reason) => {
        ctx.body = response_1.resError(ctx.request.url, reason);
    });
}));
router.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let path = url.parse(ctx.request.url, true);
    let query = path.query;
    let start = (+query.currentPage - 1) * +query.pageSize;
    let where = {};
    if (query.startTime || query.endTime) {
        where.date = {};
        if (query.startTime)
            where.date.$gte = new Date(query.startTime);
        if (query.endTime)
            where.date.$lte = new Date(query.endTime);
    }
    if (query.title) {
        where.title = new RegExp(query.title);
    }
    let total = yield post_1.default.find(where).count({}).then((res) => {
        return res;
    });
    yield post_1.default
        .find(where)
        .skip(start)
        .limit(+query.pageSize)
        .sort({ date: -1 })
        .then((docs) => {
        ctx.body = response_1.resBody(docs, total);
    }).catch((reason) => {
        ctx.body = response_1.resError(ctx.request.url, reason);
    });
}));
router.post('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let body = ctx.request.body;
    var post = {
        title: body.title,
        author: body.author,
        content: body.content,
        tag: body.tag,
        category: body.category,
        date: body.date,
        delivery: body.delivery
    };
    yield new post_1.default(post).save().then((val) => {
        ctx.body = response_1.resBody(val);
    }).catch((reason) => {
        ctx.body = response_1.resError(ctx.request.url, reason);
    });
}));
router.put('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let body = ctx.request.body;
    let post = {
        author: body.author,
        content: body.content,
        tag: body.tag,
        category: body.category,
        date: body.date,
        delivery: body.delivery
    };
    yield post_1.default.findByIdAndUpdate(body._id, post).then((res) => {
        ctx.body = response_1.resInfo(ctx.request.url, 'success');
    }).catch((reason) => {
        ctx.body = response_1.resError(ctx.request.url, reason);
    });
}));
router.delete('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let id = ctx.params.id;
    yield post_1.default.findByIdAndRemove(id).then((res) => {
        ctx.body = response_1.resInfo(ctx.request.url, 'success');
    }).catch((reason) => {
        ctx.body = response_1.resError(ctx.request.url, reason);
    });
}));
module.exports = router;
//# sourceMappingURL=post.js.map