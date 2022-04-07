const { config } = require('dotenv');
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const Feedback = require('./model');
const stringComparison = require('string-comparison');
const { createWorker } = require('tesseract.js');

require('dotenv').config()

let MongoKey = process.env.MONGO_ONLINE;
let ls = stringComparison.levenshtein;

const PROMO = 'PRIME_SPORT_PROMO';
const SEND_TEXT = 'send_text';
const SEND_SCREENSHOT = 'send_screenshot';

const bot = new Telegraf(process.env.BOT_TOKEN);

let feedbacks = [];

bot.start(async (ctx) => {
    await ctx.reply(`${ctx.message.from.first_name}, добро пожаловать в Telegram Bot Prime Sport! Отправь свой отзыв текстом или скриншот и получишь промокод!`, {
        reply_markup: {
            inline_keyboard: [
                [ { text: "Отправить текст", callback_data: SEND_TEXT } ], 
                [ { text: "Отправить скриншот", callback_data: SEND_SCREENSHOT } ],
            ]
        }
    });

});

bot.on('text', async (ctx) => {
    await mongoose.connect(MongoKey, { useNewUrlParser: true, useUnifiedTopology: true });
    feedbacks = await Feedback.find({}, {id:1, feedback:1, checked:1});
    let match = feedbacks.find((el => ls.similarity(el.feedback, ctx.message.text)>0.8));
    if (match&&!match.checked) {
        await ctx.reply('Держи свой промокод!');
        await ctx.reply(PROMO);
        await Feedback.updateOne({id:match.id}, {checked: true})
    }
        else (match&&match.checked)?ctx.reply('Для данного отзыва промокод уже отправлен!'):ctx.reply('Нет такого отзыва:(');
    await mongoose.connection.close();
});

bot.on('photo', async (ctx) => {
    await mongoose.connect(MongoKey, { useNewUrlParser: true, useUnifiedTopology: true });
    const worker = createWorker({
        logger: m => console.log(m)
      });
    const fileId = ctx.message.photo[2].file_id;
    const { href } = await ctx.telegram.getFileLink(fileId);
    await worker.load();
    await worker.loadLanguage('rus');
    await worker.initialize('rus');
    const { data: { text } } = await worker.recognize(href);
    console.log(text);
    await worker.terminate();
    feedbacks = await Feedback.find({}, {id:1, feedback:1, checked:1});
    let match = feedbacks.find((el => ls.similarity(el.feedback, text)>0.6));
    if (match&&!match.checked) {
        await ctx.reply('Держи свой промокод!');
        await ctx.reply(PROMO);
        await Feedback.updateOne({id:match.id}, {checked: true})
    }
        else (match&&match.checked)?ctx.reply('Для данного отзыва промокод уже отправлен!'):ctx.reply('Нет такого отзыва:(');
        await mongoose.connection.close();
});

// bot.action(SEND_TEXT, async (ctx) => {
//     return ctx.reply('Отправь текст своего отзыва в сообщении!');
// });

// bot.action(SEND_SCREENSHOT, async (ctx) => {
//     return ctx.reply('Отправь скриншот!');
// });

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
