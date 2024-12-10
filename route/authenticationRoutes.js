
const mongoose = require('mongoose');
//Init Model
const PlayerData = mongoose.model('PlayerData');

module.exports = app => {

    app.post('/Login', async (req, res) => {
        const { rtelegramId, rUserName } = req.body;
        if (!rtelegramId) {
            return res.status(400).send("Invalid Data");
        }

        const playerData = await PlayerData.findOne({ telegramId: rtelegramId });
        if (!playerData) {
            console.log("Creating new user data");

            const newPlayerData = new PlayerData({
                telegramId: rtelegramId,
                telegramUserName: rUserName,
                coins: 0,
                shields: 0,
                village: 1,
                buildingLevel: [0, 0, 0],
                lastEnergyTime: new Date().toISOString(),
                lastEnergy: 40
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

    app.post('/UpdatePlayerData', async (req, res) => {
        const { telegramId, ...updateData } = req.body;
        if (!telegramId) {
            console.log(`Invalid data received: ${req.body}`);
            return res.status(400).send("Invalid Data");
        }

        const playerData = await PlayerData.findOne({ telegramId: telegramId });
        if (!playerData) {
            console.log(`Data not found`);
            return res.status(400).send("Player not found");
        } else {
            Object.keys(updateData).forEach(key => {
                if (key !== 'telegramId' && key !== 'telegramUserName' && key !== 'lastEnergyTime') {
                    playerData[key] = updateData[key];
                }
            });
            await playerData.save();

            console.log(`Data Updated`);
            res.send(playerData);
        }
    });

    app.post('/UpdateEnergyTime', async (req, res) => {
        const { rtelegramId } = req.body;
        if (!rtelegramId) {
            return res.status(400).send("Invalid Data");
        }

        try {
            const playerData = await PlayerData.findOne({ telegramId: rtelegramId });
            if (!playerData) {
                return res.status(400).send("Player not found");
            } else {
                playerData.lastEnergyTime = new Date().toISOString(); // Use ISO string format
                await playerData.save();
                res.send(playerData);
            }

            console.log(`Updated lastEnergyTime for ${rtelegramId}`);
        } catch (error) {
            console.error(`Error updating lastEnergyTime for ${rtelegramId}:`, error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post('/GetEnergyTime', async (req, res) => {
        const { rtelegramId } = req.body;
        if (!rtelegramId) {
            return res.status(400).send("Invalid Data");
        }

        try {
            const playerData = await PlayerData.findOne({ telegramId: rtelegramId });
            if (!playerData) {
                return res.status(400).send("Player not found");
            } else {
                res.send(playerData.lastEnergyTime);
            }

            console.log(`Retrieved lastEnergyTime for ${rtelegramId}`);
        } catch (error) {
            console.error(`Error retrieving lastEnergyTime for ${rtelegramId}:`, error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get('/GetServerTime', (req, res) => {
        const serverTime = new Date().toISOString(); // Use ISO string format
        res.send({ serverTime });

        console.log(`Retrieved server time: ${serverTime}`);
    });

};