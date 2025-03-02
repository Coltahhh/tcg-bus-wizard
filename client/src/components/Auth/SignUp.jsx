// client/src/components/Auth/SignUp.jsx
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            console.log('Attempting signup with:', email); // Debug log

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log('Signup successful:', userCredential.user);
            navigate('/profile');
        } catch (error) {
            console.error('Firebase error:', error.code, error.message);
            setError(error.message.replace('Firebase: ', ''));
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password (min 6 characters)</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button type="submit" className="btn btn-warning">
                    Sign Up
                </button>
            </form>
        </div>
    );
}