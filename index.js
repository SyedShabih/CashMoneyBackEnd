const express = require('express');
const keys = require('./config/keys.js');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { Bot, InlineKeyboard } = require("grammy");

// Create a bot object
const bot = new Bot(keys.botToken);

bot.on("message", (ctx) => {
  const keyboard = new InlineKeyboard().game("Play Game");
  ctx.reply("Check out our game:", { reply_markup: keyboard });
});

bot.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data === "play_game") {
    const username = ctx.from.username || ctx.from.first_name;
    console.log(`Link clicked by: ${username}`);
    await ctx.answerCallbackQuery();
    await ctx.replyWithGame(keys.gameShortName);
  }
});

bot.start();

app.use(bodyParser.urlencoded({ extended: true }));

//Init DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

//Init Model
require('./model/PlayerData');

//Init Routes
require('./route/authenticationRoutes')(app);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(keys.port, () => {
  console.log(`Server is running on port ${keys.port}`);
});

bot.catch((err) => console.error(err));