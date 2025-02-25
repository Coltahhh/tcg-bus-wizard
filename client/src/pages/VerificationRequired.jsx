// src/pages/VerificationRequired.jsx
import React, { useState } from 'react'; // 👈 Add missing imports
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 👈 Ensure this path is correct

const VerificationRequired = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');

    const handleResend = async () => {
        try {
            const response = await axios.post('/api/auth/resend-verification', {
                email: user?.email
            });
            setMessage(response.data.message || 'Verification email resent!');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error resending email');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4">
                <h2>Email Verification Required</h2>
                <p>Please check your email at <strong>{user?.email}</strong> for the verification link.</p>
                <button
                    onClick={handleResend}
                    className="btn btn-primary"
                    disabled={!user?.email}
                >
                    Resend Verification Email
                </button>
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>
    );
};

export default VerificationRequired; // 👈 Ensure proper export