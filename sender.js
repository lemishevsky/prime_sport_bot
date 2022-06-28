const { Telegraf } = require('telegraf');
const { CORRECT_FEEDBACK } = require('./_const_start_bot')

require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN_START);

async function sender() {
   const answer = await bot.telegram.sendMessage("", CORRECT_FEEDBACK);
   console.log(answer);
};

sender()