const express = require('express');
const keys = require('./config/keys.js');
const app = express();

const mongoose = require('mongoose');
const e = require('express');

mongoose.connect(keys.mongoURI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));
require('./model/PlayerData');

const PlayerData = mongoose.model('PlayerData');

app.listen(keys.port, () => {
  console.log(`Server is running on port ${keys.port}`);
});

app.get('/PlayerData', async (req, res) => {
  const {rtelegramId, rcoins } = req.query;
  if(!rtelegramId || !rcoins)
  {
    return res.status(400).send("Invalid Data");
  }

  const playerData = await PlayerData.findOne({ telegramId: rtelegramId});
  if (!playerData)
  {
    console.log("Creating new user data");

    const newPlayerData = new PlayerData({
      telegramId: rtelegramId,
      coins: rcoins,
      shields: 0,
      village: 1,
      buildingLevel: [0, 0, 0],
      lastEnergyTime: Date.now()
    });
    await newPlayerData.save();
    res.send(`New Account Added ${newPlayerData}`);
  }
  else
  { 
    console.log("Updating user data");
    playerData.coins = rcoins;
    shields = 0,
    village=  1,
    buildingLevel= [0, 0, 0],
    playerData.lastEnergyTime = Date.now();
    await playerData.save();
    res.send(`Account Updated ${playerData}`);
  }

  console.log(rtelegramId, rcoins);
});