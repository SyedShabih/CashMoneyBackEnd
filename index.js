const express = require('express');
const keys = require('./config/keys.js');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { Bot, InlineKeyboard, webhookCallback } = require("grammy");
const http = require('http');


// Create a bot object
const bot = new Bot(keys.botToken);
// Set up webhook
const webhookPath = `/webhook/${keys.botToken}`;

// Middleware to handle webhook requests
app.use(express.json());
app.use(webhookPath, webhookCallback(bot, 'express'));

const server = http.createServer(app);

bot.on("message", (ctx) => {
  console.log("Received a message");
  const keyboard = new InlineKeyboard().text("Play Game", "play_game");
  ctx.reply("Check out our game:", { reply_markup: keyboard });
});

bot.on("callback_query:data", async (ctx) => {
  console.log("Received a callback query");
  if (ctx.callbackQuery.data === "play_game") {
    const username = ctx.from.username || ctx.from.first_name;
    console.log(`Link clicked by: ${username}`);
    try {
      await ctx.answerCallbackQuery(); // Answer the callback query
      await ctx.replyWithGame(keys.gameShortName); // Send the game using the game short name
    } catch (err) {
      console.error("Failed to answer callback query or send game link:", err);
    }
  }
});

app.use(bodyParser.urlencoded({ extended: true }));

// Init DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Init Model
require('./model/PlayerData');

// Init Routes
require('./route/authenticationRoutes')(app);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(keys.port, async () => {
  console.log(`Server is running on port ${keys.port}`);
  await bot.api.setWebhook(`${keys.domain}${webhookPath}`);
});

bot.catch((err) => console.error(err));