
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const userBlock = require('telegraf-userblock');
const stringComparison = require('string-comparison');
const Feedback = require('./feedbackModel');
const FeedbackFromBot = require('./feedbackFromBotModel');
const { CORRECT_FEEDBACK } = require('./_const');

require('dotenv').config()

let ls = stringComparison.levenshtein;
let MongoKey = process.env.MONGO_ONLINE;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(
    userBlock({
        onUserBlock: (ctx, next, userId) => {
            console.log('This user %s has blocked the bot.', userId);
            return next();
        },
    })
);
bot.telegram.sendMessage(3650331, CORRECT_FEEDBACK);

async function mailer(){
    await mongoose.connect(MongoKey, { useNewUrlParser: true, useUnifiedTopology: true });
    const feedbacksFromBot = await FeedbackFromBot.find();
    console.log(feedbacksFromBot);
    feedbacksFromBot.sort((a,b)=> a-b);
    console.log(feedbacksFromBot);
    feedbacksFromBot.forEach(feedback => {
        bot.telegram.sendMessage(feedback.id, CORRECT_FEEDBACK);
        console.log('Отправлено', feedback);
    });
        
    mongoose.connection.close();
};

mailer();
