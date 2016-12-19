import mongoose = require('mongoose')

const TagSchema = {
	text: String,
	date: Date
};

const Tag = mongoose.model('Tag', new mongoose.Schema(TagSchema))

export default Tag