import mongoose = require('mongoose')

const PostSchema = {
	name: {
		type: String,
		required: true
	},
	author: String,
	content: String
};

const Post = mongoose.model('Post', new mongoose.Schema(PostSchema))

export default Post