// src/pages/VerifyEmail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Verifying email...');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await axios.post('/api/auth/verify-email', { token });
                setMessage('Email verified successfully!');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setMessage(error.response?.data?.error || 'Verification failed');
            }
        };
        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="container text-center mt-5">
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;