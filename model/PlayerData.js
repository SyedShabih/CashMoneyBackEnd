const mongoose = require('mongoose');;
const { Schema } = mongoose;

const playerDataSchema = new Schema({
    telegramId: String,
    telegramUserName: String,
    coins: Number,
    shields: Number,
    village: Number,
    buildingLevel: [Number],
    lastEnergyTime: String,
    lastEnergy: Number
});
    
mongoose.model('PlayerData', playerDataSchema);