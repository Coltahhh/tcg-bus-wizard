import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from './firebase/firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';
import Layout from '../components/Layout';

export default function VerificationRequired() {
    const { user, loading } = useAuth();
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleResendVerification = async () => {
        try {
            setIsSending(true);
            await sendEmailVerification(auth.currentUser);
            setSuccessMessage('Verification email sent! Check your inbox.');
            setErrorMessage('');
        } catch (error) {
            console.error('Error sending verification email:', error);
            setErrorMessage('Failed to send verification email. Please try again.');
            setSuccessMessage('');
        } finally {
            setIsSending(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                        <p className="text-gray-600">Please log in to access this page.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (user.emailVerified) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Email Already Verified</h1>
                        <p className="text-gray-600">Your email address has already been verified.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Verify Your Email Address
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            A verification email was sent to {user.email}
                        </p>
                    </div>

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={handleResendVerification}
                            disabled={isSending}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Resend Verification Email'
                            )}
                        </button>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Didn't receive the email? Check your spam folder or contact support.
                    </p>
                </div>
            </div>
        </Layout>
    );
}