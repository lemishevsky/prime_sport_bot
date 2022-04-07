const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
    id: String,
    date: Date,
    nomenclature: String,
    rate: Number,
    brand: String,
    feedback: String,
    customerName: String,
    checked: Boolean,
});

module.exports = model("Feedback", feedbackSchema);