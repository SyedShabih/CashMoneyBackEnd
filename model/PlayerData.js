const mongoose = require('mongoose');;
const { Schema } = mongoose;

const playerDataSchema = new Schema({
    telegramId: String,
    coins: Number,
    shields: Number,
    village: Number,
    buildingLevel: [Number],
    lastEnergyTime: Date
});
    
mongoose.model('PlayerData', playerDataSchema);