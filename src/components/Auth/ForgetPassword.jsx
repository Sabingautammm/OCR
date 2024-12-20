import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    console.log('Email being sent:', email); // Debug input email
  
    try {
      const response = await fetch('https://ocr.goodwish.com.np/api/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log('Response from server:', data); // Debug response
  
      if (response.ok) {
        setSuccess('OTP has been sent to your email.');
        setTimeout(() => {
          navigate('/changePassword', { state: { email } });
        }, 2000);
      } else {
        setError(data.message || 'Email not found.');
      }
    } catch (err) {
      console.error('Error:', err); // Debug fetch error
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-slate-400 to-indigo-600">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="mb-6 text-4xl font-extrabold text-center text-blue-700">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Enter your registered email to reset your password.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-gray-600"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <NavLink to='/auth'>
            <button className='justify-end mt-5 font-bold text-blue-500'>
              Back to login
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
