
const mongoose = require('mongoose');
//Init Model
const PlayerData = mongoose.model('PlayerData');

module.exports = app => {
    

    app.post('/Login', async (req, res) => {
        const { rtelegramId } = req.body;
        if (!rtelegramId) {
            return res.status(400).send("Invalid Data");
        }

        const playerData = await PlayerData.findOne({ telegramId: rtelegramId });
        if (!playerData) {
            console.log("Creating new user data");

            const newPlayerData = new PlayerData({
                telegramId: rtelegramId,
                coins: 0,
                shields: 0,
                village: 1,
                buildingLevel: [0, 0, 0],
                lastEnergyTime: Date.now()
            });
            await newPlayerData.save();
            res.send(`New Account Added ${newPlayerData}`);
        }
        else {
            res.send(playerData);
        }

        console.log(rtelegramId + " logged in");
    });

    app.post('/UpdateCoins', async (req, res) => {
        const { rtelegramId, rcoins } = req.body;
        if (!rtelegramId || !rcoins || rcoins < 0) {
            return res.status(400).send("Invalid Data");
        }

        const playerData = await PlayerData.findOne({ telegramId: rtelegramId });
        if (!playerData) {
            return res.status(400).send("Player not found");
        }
        else {
            playerData.coins = rcoins;
            await playerData.save();
            res.send(playerData);
        }

        console.log(rtelegramId, rcoins);
    });

    app.post('/UpdateShields', async (req, res) => {
        const { rtelegramId, rshields } = req.body;
        if (!rtelegramId || !rshields || rshields < 0) {
            return res.status(400).send("Invalid Data");
        }

        const playerData = await PlayerData.findOne({ telegramId: rtelegramId });
        if (!playerData) {
            return res.status(400).send("Player not found");
        }
        else {
            playerData.shields = rshields;
            await playerData.save();
            res.send(playerData);
        }

        console.log(rtelegramId, rshields);
    });
    
};