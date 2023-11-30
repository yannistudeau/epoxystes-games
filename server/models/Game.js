// modesl/Games.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  initialAmount: { type: Number, required: true },
  invitationLink: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;