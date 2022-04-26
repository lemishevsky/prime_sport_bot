const { Schema, model } = require('mongoose');


const feedbackFromBotSchema = new Schema({
    chatId: String,
    date: Date,
    feedback: String,
    username: String,
    checked: Boolean,
});

module.exports = model("FeedbackFromBot", feedbackFromBotSchema);
