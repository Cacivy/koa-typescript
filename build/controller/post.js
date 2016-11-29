"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var router = require('koa-router')();
const post_1 = require('../model/post');
router.get('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let id = ctx.params.id;
    yield post_1.default.findById(id, (err, res) => {
        ctx.body = res;
    });
}));
router.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield post_1.default.find({}, (err, res) => {
        ctx.body = res;
    });
}));
router.post('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let body = ctx.request.body;
    var post = {
        name: body.name,
        author: body.author,
        content: body.content
    };
    yield new post_1.default(post).save((err, res) => {
        if (res) {
            ctx.body = res;
        }
    });
    yield ctx.redirect('/post');
}));
router.put('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let id = ctx.params.id;
    let body = ctx.request.body;
    let post = {
        author: body.author,
        content: body.content
    };
    yield post_1.default.findByIdAndUpdate(id, post, (err, res) => {
        ctx.body = 'ok';
    });
}));
module.exports = router;
//# sourceMappingURL=post.js.map