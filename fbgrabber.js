const { IMT_ID, FEEDBACK_API } = require('./_const');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Feedback = require('./feedbackModel');
const FeedbackFromBot = require('./feedbackFromBotModel')
const { START_PROMO_DAY } = require('./_const');

require("dotenv").config();

let MongoKey = process.env.MONGO_ONLINE;

async function feedbackGrab(bot, ls) {
await mongoose.connect(MongoKey, { useNewUrlParser: true, useUnifiedTopology: true });
const fetches = IMT_ID.map(elem => {
    const body = { 
        imtId: elem,
        skip: 0,
        take: 20,
        order: "dateDesc"
        };
    return fetch(FEEDBACK_API, 
        {
            method: 'POST', 
            body: JSON.stringify(body)});
});
const results = await Promise.allSettled(fetches);
const data = await Promise.allSettled(results.map((result) => result.value.json()));
const feedbacks = data.map(elem => elem.value.feedbacks).flat();
const feedBacksForDB = feedbacks
        .filter(feedback => feedback.createdDate>START_PROMO_DAY)
        .map(({ id, createdDate, text, wbUserDetails, productDetails, rank })  => { return { 
            id,
            date: createdDate,
            nomenclature: productDetails.supplierArticle,
            rate: rank,
            feedback: text.split('\n').join(' '),
            customerName: wbUserDetails.name,
            checked: false,
        }})
const feedbacksFromDB = await Feedback.find({}, {id:1});
const newFeedbacks = feedBacksForDB.filter(elem => !feedbacksFromDB.some(e=>e.id===elem.id));
const feedbacksFromBot = await FeedbackFromBot.find({checked:false});
feedbacksFromBot.forEach(elem => {
    newFeedbacks.forEach(e => {
        if (!e.checked && !elem.checked && ls.similarity(e.feedback, elem.feedback)>0.8) {
            bot.telegram.sendMessage(elem.chatId, CORRECT_FEEDBACK);
            e.checked = true;
            elem.checked = true;
            return;
        }
    })
    
});
await FeedbackFromBot.updateMany(feedbacksFromBot);
await Feedback.insertMany(newFeedbacks);
mongoose.connection.close();
}

module.exports = { feedbackGrab };