const express = require('express');
const keys = require('./config/keys.js');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { Bot } = require("grammy");

// Create a bot object
const bot = new Bot(keys.botToken);


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

// app.use(express.json());
// app.use(`/${keys.botToken}`, webhookCallback(bot, "express"));
// app.get("/", (req, res) => {
//     res.send("Welcome to the bot server!");
// });

// server.listen(Number(keys.port), async () => {
//     console.log("Server is up and running!");
//     await bot.api.setWebhook(`${keys.domain}/${keys.botToken}`);
// });

bot.command("start", async (ctx) => { await ctx.replyWithGame(keys.gameURL); });

bot.on("callback_query:game_short_name", async (ctx) => {
    const url = keys.gameURL;
    await ctx.answerCallbackQuery({
        url
    });
});

bot.catch((err) => console.error(err));