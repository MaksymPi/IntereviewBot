require('dotenv').config();


const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError,} = require('grammy');

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
  await ctx.reply('З чого розпочнемо?',{
    reply_markup:startKeyboard
  })
});

bot.hears(['HTML', 'CSS', 'JS', 'React'], async (ctx) => {

  const inlineKeyboard = new InlineKeyboard().text('Отримати відповідь', 'getAnswer').text('Відмінити', 'cancel')

  await ctx.reply(`Що таке ${ctx.message.text}?`,{
    reply_markup: inlineKeyboard
  });
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
