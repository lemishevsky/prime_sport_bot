const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
    chatId: String,
    id: String,
    date: Date,
    nomenclature: String,
    rate: Number,
    feedback: String,
    customerName: String,
    checked: Boolean,
});

module.exports = model("Feedback", feedbackSchema);
