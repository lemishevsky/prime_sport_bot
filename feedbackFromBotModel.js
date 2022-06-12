const { Schema, model } = require('mongoose');


const feedbackFromBotStartSchema = new Schema({
    chatId: String,
    date: Date,
    feedback: String,
    username: String,
    checked: Boolean,
});

module.exports = model("FeedbackFromBotStart", feedbackFromBotStartSchema);
