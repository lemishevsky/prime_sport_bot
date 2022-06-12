const mongoose = require('mongoose');
const FeedbackFromBotStart = require('./feedbackFromBotModel');
const { FEEDBACK_NOT_FOUND_24 } = require('./_const_start_bot')

require('dotenv').config()

let MongoKey = process.env.MONGO_ONLINE;

async function lostFeedbacks(bot) {
    await mongoose.connect(MongoKey, { useNewUrlParser: true, useUnifiedTopology: true });
    const feedbacks = await FeedbackFromBot.find({checked: false});
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const _idArray = [];
    feedbacks.forEach(async (elem) => {
        if (yesterday >= elem.date){
            elem.checked = true;
            bot.telegram.sendMessage(elem.chatId, FEEDBACK_NOT_FOUND_24);
            _idArray.push(elem._id);
        }
    })
    await FeedbackFromBotStart.updateMany({_idArray}, {checked: true});
    await mongoose.connection.close();
};


module.exports = { lostFeedbacks };