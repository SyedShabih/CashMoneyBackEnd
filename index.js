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

// Initialize bot before setting handlers
async function initBot() {
  try {
    // Test bot connection
    const botInfo = await bot.api.getMe();
    console.log("Bot initialized:", botInfo.username);

    // Set up message handler
    bot.on("message", async (ctx) => {
      console.log("Received message from:", ctx.from.username);
      try {
        const keyboard = new InlineKeyboard().game("Play Cash Money", keys.gameShortName);
        await ctx.reply("Check out our game:", { reply_markup: keyboard });
        console.log("Sent game button to user");
      } catch (err) {
        console.error("Error sending game button:", err);
      }
    });

    // Handle game callback
    bot.on("callback_query:game_short_name", async (ctx) => {
      console.log("Game callback from:", ctx.from.username);
      try {
        await ctx.answerCallbackQuery({
          url: keys.gameURL,
          game_short_name: ctx.callbackQuery.game_short_name
        });
        console.log("Answered callback query with game URL");
      } catch (err) {
        console.error("Game callback error:", err);
      }
    });

  } catch (err) {
    console.error("Bot initialization failed:", err);
    process.exit(1);
  }
}


// Middleware to handle webhook requests
app.use(express.json());
app.use(webhookPath, webhookCallback(bot, 'express'));
app.use(bodyParser.urlencoded({ extended: true }));


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


bot.on("message", (ctx) => {
  console.log("Received a message");
  // Create game button with proper game short name
  const keyboard = new InlineKeyboard().game("Play Cash Money", keys.gameShortName);
  ctx.reply("Check out our game:", { reply_markup: keyboard });
});

// Handle game callback query
bot.on("callback_query:game_short_name", async (ctx) => {
  console.log("Received a game callback query");
  try {
    const username = ctx.from.username || ctx.from.first_name;
    console.log(`Game launched by: ${username}`);
    await ctx.answerCallbackQuery({
      url: keys.gameURL,
      game_short_name: ctx.callbackQuery.game_short_name // Add this
    });
  } catch (err) {
    console.error("Failed to answer game callback query:", err);
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
