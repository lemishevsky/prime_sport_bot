const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const Feedback = require('./feedbackModel');
const FeedbackFromBot = require('./feedbackFromBotModel');
const stringComparison = require('string-comparison');
const Tesseract = require('tesseract.js');
const userBlock = require('telegraf-userblock');
const { 
    GREETINGS, 
    FIRST_ANSWER, 
    CORRECT_FEEDBACK, 
    REPEATED_ANSWER, 
    FEEDBACK_NOT_FOUND, 
    UPDATE_DB_PERIOD, 
    ONE_DAY,
    TEXT_DELAY, 
    WORK_IN_PROGRESS, 
    WORK_IS_DONE 
} = require('./_const');
const { feedbackGrab } = require('./fbgrabber');
const { lostFeedbacks } = require('./lostFeedbacks')

require('dotenv').config()

let MongoKey = process.env.MONGO_ONLINE;
let ls = stringComparison.levenshtein;

const bot = new Telegraf(process.env.BOT_TOKEN_START);

bot.use(
    userBlock({
        onUserBlock: (ctx, next, userId) => {
            console.log('This user %s has blocked the bot.', userId);
            return next();
        },
    })
);

bot.start(async(ctx) => {
    // console.log(ctx.message.chat);
    ctx.reply(GREETINGS(ctx.message.from.first_name));
});

bot.on('text', async (ctx) => {
    ctx.reply(FIRST_ANSWER);
    dbChecker(0.8, ctx, ctx.message.text);
});

bot.on('photo', async (ctx) => {
    ctx.reply(FIRST_ANSWER);
    let counter = 2;
    setTimeout(() => ctx.reply(WORK_IN_PROGRESS[0]), TEXT_DELAY);  
    const fileId = ctx.message.photo[2].file_id;
    const { href } = await ctx.telegram.getFileLink(fileId);
    Tesseract.recognize(
        href,
        'rus',
        { logger: m => { 
            const progress = m.progress.toFixed(2);
            if  (progress>0.45 && m.status==='recognizing text'&&counter===2) {
            ctx.reply(WORK_IN_PROGRESS[1]);
            counter-=1;
            }
            if  (progress>0.75 && m.status==='recognizing text'&&counter===1){
                ctx.reply(WORK_IN_PROGRESS[2]);
                counter-=1;
        }
            return console.log(m);
        }})
        .then(({ data: { text } }) => {
        console.log(text);
        ctx.reply(WORK_IS_DONE + ' ' + text);
        return text;
      })
      .then( text => dbChecker(0.6, ctx, text))
});

async function dbChecker(accuracy, ctx, text){
    await mongoose.connect(MongoKey, { useNewUrlParser: true, useUnifiedTopology: true });
    let feedbacks = [];
    feedbacks = await Feedback.find({}, {id:1, feedback:1, checked:1});
    let match = feedbacks.find((el => ls.similarity(el.feedback, text)>accuracy));
    if (match&&!match.checked) {
        setTimeout(() => ctx.replyWithHTML(CORRECT_FEEDBACK), TEXT_DELAY);
        await Feedback.updateOne({id:match.id}, {checked: true, chatId: ctx.from.id})
    }
        else if (match&&match.checked){
            setTimeout(() => ctx.replyWithHTML(REPEATED_ANSWER), TEXT_DELAY);
        }
        else {
            setTimeout(() => ctx.replyWithHTML(FEEDBACK_NOT_FOUND), TEXT_DELAY);
            const feedbackDate = new Date(ctx.message.date*1000);
            const feedback = new FeedbackFromBot({
                chatId:ctx.from.id, 
                date:feedbackDate, 
                feedback: text.split('\n').join(' '),
                username: ctx.username,
                checked: false });
            await feedback.save();
        }
    await mongoose.connection.close();
} 

setInterval(() => feedbackGrab(bot, ls), UPDATE_DB_PERIOD);

setInterval(() => lostFeedbacks(bot), ONE_DAY);
// setInterval(() => lostFeedbacks(bot), 5000 ); 

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
