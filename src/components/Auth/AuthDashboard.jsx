import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Signup from './LoginForm';
import Login from './SignUpForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        const view = new URLSearchParams(location.search).get('view');
        setShowLogin(view === 'login');
    }, [location.search]);

    // Google OAuth redirection URL setup
    const signInWithGoogle = () => {
        const CLIENT_ID = '152364471348-fngo0d6ejqtg13ldvq8ja9omf710ktuc.apps.googleusercontent.com';
        const REDIRECT_URI = 'https://ocr.goodwish.com.np/google-auth-redirect/';
        const SCOPE = 'openid profile email';

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(SCOPE)}&` +
            `state=state_parameter_passthrough_value`;

        window.location.href = authUrl;
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            // Exchange code for token
            axios.get(`/auth/google/callback/?code=${code}`)
                .then(response => {
                    const { token, email } = response.data;
                    localStorage.setItem('token', token);  // Store token in localStorage
                    localStorage.setItem('email', email);  // Optionally store user email
                    navigate('/dashboard');  // Redirect to dashboard or any protected route
                })
                .catch(error => {
                    console.error("Google OAuth error:", error);
                });
        }
    }, [location.search, navigate]);

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500">
            <div className="absolute inset-0 bg-center bg-cover bg-slate-200 opacity-60" />
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[50vw] xl:w-[40vw] p-6 bg-white rounded-lg shadow-xl relative z-10 backdrop-blur-lg flex flex-col">
                <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 sm:text-4xl">Welcome to The OCR</h1>
                <AnimatePresence>
                    {showLogin ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Login />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Signup setShowLogin={setShowLogin} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowLogin(!showLogin)}
                        className="font-semibold text-blue-600 underline transition-colors hover:text-blue-400"
                    >
                        {showLogin ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                    </button>

                    <h3 className="mt-4 text-lg text-white">----or----</h3>

                    <button
                        onClick={signInWithGoogle}
                        className="px-8 py-3 mt-4 text-lg text-white transition-all duration-300 ease-in-out bg-red-500 rounded-lg shadow-md hover:scale-105"
                    >
                        Continue with Google
                        <FontAwesomeIcon icon={faGoogle} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthDashboard;
