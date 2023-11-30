// services/authService.js
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const setAccessToken = (token) => {
    // Code pour stocker le token d'accès dans votre application (par exemple, dans le state ou dans un cookie)
    localStorage.setItem('access_token', token);
};

const setRefreshToken = (token) => {
    // Code pour stocker le token d'accès dans votre application (par exemple, dans le state ou dans un cookie)
    localStorage.setItem('refresh_token', token);
};

const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

const getRefreshToken = () => {
    return localStorage.getItem('refresh_token');
};

const clearAccessToken = () => {
    localStorage.removeItem('access_token');

};


const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // convertir en secondes

        return decoded.exp < currentTime;
    } catch (error) {
        return false;
    }
};

const refreshAccessToken = async (expiredToken) => {
    try {
        // Vérification de la validité du token
        const { exp } = jwtDecode(expiredToken);
        const isTokenExpired = Date.now() >= exp * 1000;
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
        const expiredTokenTime = exp;

        if (currentTime > expiredTokenTime) {
            // Le token a expiré
            console.log('Le token a expiré.');
        } else {
            // Le token est toujours valide
            console.log('Le token est toujours valide.');
        }
        
        const refresh_token = getRefreshToken();
            console.log(refresh_token);
        // Rafraîchissement côté serveur
        const response = await axios.post('http://localhost:3030/refresh-token', { refresh_token });

        // Stockage du nouveau token
        const newToken = response.data.accessToken;
        setAccessToken(newToken);
        console.log('Token raffraichi');
        return newToken;
    } catch (error) {
        // Gérer les erreurs de rafraîchissement du token
        console.error('Erreur lors du rafraîchissement du token :', error);
        throw error;
    }
};

export { setAccessToken, getAccessToken, clearAccessToken, setRefreshToken, isTokenExpired, refreshAccessToken, getRefreshToken };
