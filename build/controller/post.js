"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const koaRouter = require('koa-router');
const router = new koaRouter();
const post_1 = require('../model/post');
const response_1 = require('../util/response');
router.get('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let id = ctx.params.id;
    yield post_1.default.findById(id).then((doc) => {
        ctx.body = response_1.resBody(doc);
    }).catch((reason) => {
        ctx.body = response_1.resError(reason);
    });
}));
router.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield post_1.default.find({}).then((docs) => {
        ctx.body = response_1.resBody(docs);
    }).catch((reason) => {
        ctx.body = response_1.resError(reason);
    });
}));
router.post('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let body = ctx.request.body;
    var post = {
        name: body.name,
        author: body.author,
        content: body.content
    };
    yield new post_1.default(post).save().then((val) => {
        ctx.body = response_1.resBody(val);
    }).catch((reason) => {
        ctx.body = response_1.resError(reason);
    });
}));
router.put('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let id = ctx.params.id;
    let body = ctx.request.body;
    let post = {
        author: body.author,
        content: body.content
    };
    yield post_1.default.findByIdAndUpdate(id, post).then((res) => {
        ctx.body = response_1.resInfo('success');
    }).catch((reason) => {
        ctx.body = response_1.resError(reason);
    });
}));
router.delete('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let id = ctx.params.id;
    yield post_1.default.findByIdAndRemove(id).then((res) => {
        ctx.body = response_1.resInfo('success');
    }).catch((reason) => {
        ctx.body = response_1.resError(reason);
    });
}));
module.exports = router;
//# sourceMappingURL=post.js.map