// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/games', verifyToken, gameController.createGame);
router.post('/games/:gameId/join', verifyToken, gameController.joinGame);
router.get('/games/:gameId', verifyToken, gameController.getGameStatus);

module.exports = router;
