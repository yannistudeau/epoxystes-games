// routes/users.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route pour créer un utilisateur
router.post('/users', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Vérifiez d'abord si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Hash du mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créez un nouvel utilisateur avec le mot de passe haché
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Enregistrez l'utilisateur en base de données
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour connecter un utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer un JWT
        const accessToken = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1min' });

        // Générer un refresh token (optionnel)
        const refreshToken = jwt.sign({ email: user.email, userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Stocker les tokens dans la session (ou tout autre mécanisme que vous préférez)
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;

        res.json({ message: 'Connexion réussie', accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer un utilisateur
router.get('/users/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Route pour supprimer un utilisateur
router.delete('/users/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware pour récupérer un utilisateur
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user === null) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.user = user;
    next();
}

// Route pour se déconnecter
router.post('/logout', (req, res) => {
    // Détruire la session
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
        res.json({ message: 'Déconnexion réussie' });
    });
});

// Route pour récupérer l'utilisateur connecté
router.get('/current-user', (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Utilisateur non connecté' });
    }
    res.json(currentUser);
});

// Route pour raffraichir le token
router.post('/refresh-token', (req, res) => {
    console.log('Refresh Token route reached');
    const refreshToken = req.session.refreshToken;
    console.log('Refresh Token:', refreshToken);
    if (!refreshToken) {
        return res.status(401).json({ message: 'Utilisateur non connecté' });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Erreur lors de la vérification du refresh token :', err);
            return res.status(403).json({ message: 'Token invalide' });
        }
        console.log('Utilisateur récupéré à partir du refresh token :', user);
    
        const accessToken = jwt.sign({ username: user.username, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1min' });
        console.log('Nouveau token généré :', accessToken);
    
        res.json({ message: 'Token raffraichi', accessToken });
    });
});

module.exports = router;
