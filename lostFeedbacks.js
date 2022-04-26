const mongoose = require('mongoose');
const FeedbackFromBot = require('./feedbackFromBotModel');
const { FEEDBACK_NOT_FOUND_24 } = require('./_const')

require('dotenv').config()

let MongoKey = process.env.MONGO_ONLINE;

async function lostFeedbacks(bot) {
    await mongoose.connect(MongoKey, { useNewUrlParser: true, useUnifiedTopology: true });
    const feedbacks = await FeedbackFromBot.find({checked: false});
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    feedbacks.forEach(async (elem) => {
        if (yesterday >= elem.date){
            bot.telegram.sendMessage(elem.chatId, FEEDBACK_NOT_FOUND_24);
            await FeedbackFromBot.updateOne(elem);
        }
    })
    

    mongoose.connection.close();
};

module.exports = { lostFeedbacks };