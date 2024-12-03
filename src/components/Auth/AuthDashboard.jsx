import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
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
        const REDIRECT_URI = 'http://localhost:5173/google-auth-redirect/';
        const SCOPE = 'openid profile email';

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth/` +
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
        <div className="relative flex items-center justify-center min-h-screen pb-3 bg-gradient-to-r from-purple-500 via-slate-400 to-indigo-600">
        {/* Background layers */}
        {/* <div className="absolute inset-0 h-full bg-center bg-cover bg-slate-200 opacity-60"></div>
        <div className="absolute inset-0 h-full bg-black opacity-40"></div> */}
    
        {/* Main Content */}
        <div className="relative z-10 flex flex-col w-full md:w-[500px] md:mb-[50px] max-w-4xl p-6 mx-4 my-10 bg-white rounded-lg shadow-xl sm:mx-6 lg:mx-8 xl:mx-0 backdrop-blur-lg">
            <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-3xl md:text-4xl">
                Welcome to The OCR
            </h1>

        
    
            {/* Login/Signup Animation */}
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
             <NavLink to='/forgotPassword'>
            <button className='justify-end mt-5 font-bold text-red-500'>
                forgot password?
            </button>
            </NavLink>
            {/* <aa
            href="/forgotPassword"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            Back to Login
          </a> */}
    
            {/* Toggle and Social Login */}
            <div className="flex flex-col mt-6 text-center">
                <button
                    onClick={() => setShowLogin(!showLogin)}
                    className="font-semibold text-blue-600 underline transition-colors hover:text-blue-400"
                >
                    {showLogin ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                </button>
    
             
    
                <button
                    onClick={signInWithGoogle}
                    className="flex items-center justify-center gap-2 px-8 py-3 mt-4 text-lg text-white transition-all duration-300 ease-in-out bg-red-500 rounded-lg shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
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
