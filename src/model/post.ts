import mongoose = require('mongoose')

const PostSchema = {
	title: {
		type: String,
		required: true
	},
	author: String,
	content: String,
	html: String,
	tag: Array,
	category: String,
	date: Date,
	delivery: Boolean
};

const Post = mongoose.model('Post', new mongoose.Schema(PostSchema))

export default Post