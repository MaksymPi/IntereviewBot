require('dotenv').config();


const {
  Bot,
  Keyboard,
  InlineKeyboard,
  GrammyError,
  HttpError,
} = require('grammy');

const { getRandomQuestion } = require('./utils')

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {

  const startKeyboard = new Keyboard()
    .text('HTML')
    .text('CSS').row()
    .text('JS')
    .text('React')
    .resized();

  await ctx.reply(
    'Привіт! Я InterviewFrontend_bot \nЯ допоможу тобі підготуватися до співбесіди!'
  );
  await ctx.reply('З чого розпочнемо?', {
    reply_markup: startKeyboard
  })
});

bot.hears(['HTML', 'CSS', 'JS', 'React'], async (ctx) => {

  const topic = ctx.message.text;
  const question = getRandomQuestion(topic);

  const inlineKeyboard = new InlineKeyboard()
    .text('Отримати відповідь', JSON.stringify({
      type: ctx.message.text,
      questionId: question.id,
    })
    );


  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard
  });
})

bot.on('callback_query:data', async (ctx) => {
  if (ctx.callbackQuery.data === 'cancel') {
    await ctx.reply('Відмінено')
    await ctx.answerCallbackQuery();
    return;
  }

  const callBackData = JSON.parse(ctx.callbackQuery.data);
  await ctx.reply(`${callBackData.type} - складова Front end`);
  await ctx.answerCallbackQuery();
})

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
