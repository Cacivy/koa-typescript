"use strict";
const mongoose = require('mongoose');
const PostSchema = {
    name: {
        type: String,
        required: true
    },
    author: String,
    content: String
};
const Post = mongoose.model('Post', new mongoose.Schema(PostSchema));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Post;
//# sourceMappingURL=post.js.map