// midddleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Les routes non protégées par le token (par exemple, /login, /users) peuvent être exclues ici
  if (req.path === '/refresh-token' || req.path === '/login' || (req.path === '/users' && req.method === 'POST')) {
    return next();
  }

  const token = req.header('Authorization');

  // Vérifier si le token est présent et s'il commence par "Bearer "
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token d\'accès manquant ou invalide' });
  }

  // Récupérer le token sans la partie "Bearer "
  const tokenWithoutBearer = token.slice(7);

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token d\'accès invalide' });
    }

    req.user = decoded;  // Ajoute les informations de l'utilisateur décodées à la demande
    next();
  });
};

module.exports = verifyToken;
