// pages/Home.js

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getAccessToken, refreshAccessToken, getRefreshToken } from '../services/authService';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const fetchAllUsers = async () => {
        try {
            const accessToken = getAccessToken();
            const response = await axios.get('http://localhost:3030/users', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchAllUsers();


        refreshAccessToken(getRefreshToken());


    }, []);


    return (
        <div>
            <h1>Home</h1>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div>
                    <h2>Utilisateurs</h2>
                    <ul>
                        {users.map((user) => (
                            <li key={user._id}>{user.email} {user.username}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default Home;