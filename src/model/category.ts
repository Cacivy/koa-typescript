import mongoose = require('mongoose')

const CategorySchema = {
	text: String,
	date: Date
};

const Category = mongoose.model('Category', new mongoose.Schema(CategorySchema))

export default Category