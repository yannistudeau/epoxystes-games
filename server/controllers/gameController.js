// controllers/gameController.js
const Game = require('../models/Game');
const Player = require('../models/Player');

// Controller pour créer une partie
async function createGame(req, res) {
  const { username, initialAmount } = req.body;

  try {
    // Créer un joueur initial
    const creator = await Player.create({ username, amount: initialAmount });

    // Créer une partie avec le créateur et le lien d'invitation
    const invitationLink = generateInvitationLink(); // À implémenter
    const game = await Game.create({ creator, initialAmount, invitationLink, players: [creator] });

    res.status(201).json({ message: 'Partie créée avec succès', game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller pour rejoindre une partie
async function joinGame(req, res) {
  const { username, gameId } = req.body;

  try {
    // Créer un joueur qui rejoint la partie
    const player = await Player.create({ username, amount: initialAmount });

    // Ajouter le joueur à la partie existante
    const game = await Game.findByIdAndUpdate(gameId, { $push: { players: player } }, { new: true })
      .populate('creator')
      .populate('players');

    res.json({ message: 'Joueur rejoint la partie avec succès', game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getGameStatus(req, res) {
  // Logique pour obtenir l'état du jeu
}

// Ajoutez d'autres fonctions nécessaires

module.exports = {
  createGame,
  joinGame,
  getGameStatus,
  // Ajoutez d'autres fonctions nécessaires
};