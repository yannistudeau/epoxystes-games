// models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;