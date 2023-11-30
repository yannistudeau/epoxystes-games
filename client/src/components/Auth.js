// components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { setAccessToken, setRefreshToken } from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3030/login', {
        email,
        password,
      });

      // Stocker le token dans le stockage local ou les cookies
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);

      console.log('Connexion réussie !');
      navigate("/home");

      // Rediriger ou mettre à jour l'état de l'application en conséquence
    } catch (error) {
      console.error('Erreur de connexion :', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Mot de passe:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
};

export default Auth;
