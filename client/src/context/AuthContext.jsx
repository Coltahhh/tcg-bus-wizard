import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/api/auth/verify', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
            } catch (err) {
                localStorage.removeItem('token');
                setError(err.response?.data?.error || 'Session expired');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);