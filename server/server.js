// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { mongoURI } = require('./config');
const usersRoute = require('./routes/users');
const session = require('express-session');
const verifyToken = require('./middlewares/verifyToken'); 
const gameRoutes = require('./routes/gameRoutes');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;

// Utilisez cors pour autoriser les requêtes provenant d'autres domaines
app.use(cors());

// Utilisez le middleware pour protéger toutes vos routes
app.use(verifyToken);

// Middleware pour parser les données JSON
app.use(express.json());

// Middleware pour gérer les CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // On autorise l'accès à notre API depuis n'importe quelle origine ( '*' ) 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // On autorise les headers mentionnés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // On autorise les méthodes mentionnées
  next();
});

// Middlware pour gérer la session utilisateur
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Connexion à la base de données MongoDB
mongoose.connect(mongoURI)
  .then((success) => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((error) => {
    console.log('Connexion à MongoDB échouée');
    console.log(error);
  });

// Routes
app.use(usersRoute);
app.use(gameRoutes);

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
