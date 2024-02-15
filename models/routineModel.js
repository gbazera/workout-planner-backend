const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const routineSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		exercises: {
			type: Array,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Routine', routineSchema)