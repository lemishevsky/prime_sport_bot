const { Schema, model } = require('mongoose');

const feedbackStartSchema = new Schema({
    chatId: String,
    id: String,
    date: Date,
    nomenclature: String,
    rate: Number,
    feedback: String,
    customerName: String,
    checked: Boolean,
});

module.exports = model("FeedbackStart", feedbackStartSchema);
