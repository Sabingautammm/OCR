// GoogleAuth.js
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const GoogleAuth = () => {
    const navigate = useNavigate();
    console.log("No code parameter found");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        console.log("Code parameter:", code);  // Log code for debugging
    
        if (code) {
            // Exchange code for token at your backend
            axios.post('https://ocr.goodwish.com.np/auth/google/callback/', { code })
                .then(response => {
                    console.log(response.data);
                    const { token,photo,name,email} = response.data;  // Assuming the response contains a 'user' object
                    console.log("Received token:", token);  // Log token for debugging
                    
                    // Save token, photo, email, and name to localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('email', email);  // Save email
                    localStorage.setItem('name', name);    // Save name
                    localStorage.setItem('photo',photo);  // Save photo
                 
                    navigate('/');
                    window.location.reload(); 
                })
                .catch(error => {
                    console.error('Error during Google auth:', error);
                });
        } else {
            console.log("No code parameter found");  // Log if code is not found
        }
    }, [navigate]);
   

    return <div className='flex items-center justify-center w-full h-[800px] text-3xl font-bold text-black bg-slate-300'>Authenticating...</div>;
};

export default GoogleAuth;
