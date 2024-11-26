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

// Add more detailed logging
bot.catch((err) => {
  console.error("Bot error:", err);
});


// Middleware to handle webhook requests
app.use(express.json());
app.use(webhookPath, webhookCallback(bot, 'express'));
app.use(bodyParser.urlencoded({ extended: true }));


console.log("Bot initialized with token:", token);


const server = http.createServer(app);

server.listen(keys.port, async () => {
  console.log(`Server running on port ${keys.port}`);
  
  try {
    // Set webhook
    await bot.api.setWebhook(`${keys.domain}${webhookPath}`);
    console.log(`Webhook set to ${keys.domain}${webhookPath}`);
    
    // Initialize bot
    await initBot();
    console.log("Bot setup completed");
  } catch (err) {
    console.error("Failed to set webhook:", err);
    process.exit(1);
  }
});

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

const keyboard = new InlineKeyboard().game("Start Cash Money");

bot.command("start", async (ctx) => {
    console.log("Received /start command from:", ctx.from.username);
    try {
        await ctx.replyWithGame(process.env.GAME_SHORT_NAME, { reply_markup: keyboard });
        console.log("Sent game button to user");
    } catch (err) {
        console.error("Error sending game button:", err);
    }
});

bot.on("callback_query:game_short_name", async (ctx) => {
    console.log("Received game callback query from:", ctx.from.username);
    const url = process.env.GAME_URL;
    try {
        await ctx.answerCallbackQuery({
            url
        });
        console.log("Answered callback query with game URL");
    } catch (err) {
        console.error("Error answering callback query:", err);
    }
});

bot.catch((err) => {
    console.error("Bot error:", err);
});
