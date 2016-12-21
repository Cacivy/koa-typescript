import mongoose = require('mongoose')

const DataSchema = {
	title: String,
	type: String,
	options: {
		data: Array,
		labels: Array
	}
};

const Data = mongoose.model('Data', new mongoose.Schema(DataSchema))

export default Data