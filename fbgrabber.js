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
let data = [];
if (results) {
    data = await Promise.allSettled(results.map((result) => {
        if (result.value){
            return result.value.json()
        }
    }));
} 
const feedbacks = data.map(elem => { if (elem.value){
    return elem.value.feedbacks;
}}) || [];
const _idArrayFeedbacksFromBot = [];
const feedBacksForDB = feedbacks
        .flat()
        .filter(feedback => {
            if (feedback){
                return feedback.createdDate>START_PROMO_DAY
            }
        })
        .map(({ id, createdDate, text, wbUserDetails, productDetails, rank })  => { return { 
            chatId: "",
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
            e.chatId = elem.chatId;
            _idArrayFeedbacksFromBot.push(elem._id);
            return;
        }
    })
    
});
await Feedback.insertMany(newFeedbacks);
await FeedbackFromBot.updateMany({_idArrayFeedbacksFromBot}, {checked: true});
await mongoose.connection.close();
};

module.exports = { feedbackGrab };