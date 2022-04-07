const mongoose = require('mongoose');
const Feedback = require('./model');
const readXlsxFile = require('read-excel-file/node');

require("dotenv").config();

async function dbSeeder(fileName) {
    const rows = await readXlsxFile(`${fileName}.xlsx`);
    await mongoose.connect('mongodb://localhost:27017/prime_sport_bot', { useNewUrlParser: true, useUnifiedTopology: true });
    const feedbacks = await Feedback.find({}, {id:1});
    const newFeedbacks = rows
    .slice(1)
    .filter(element => !feedbacks.some(feedback => element[0] === feedback.id))
    .map(element => {
        const feedbackElem = {
        id: element[0],
        date: new Date( element[1].split('/').reverse()),
        nomenclature: element[3],
        rate: element[4],
        brand: element[5],
        feedback: element[6],
        customerName: element[7],
        checked: false
        };
        return feedbackElem;

    });;
    await Feedback.insertMany(newFeedbacks);
    mongoose.connection.close();
    console.log(newFeedbacks.length, newFeedbacks);
  }

  dbSeeder(process.argv[2])