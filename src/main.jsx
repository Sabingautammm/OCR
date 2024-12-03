import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import TableExtantion from './components/Table extention/TableExtantion.jsx';
import DocumentConverter from './components/pdf to doc/DocumentConverter.jsx';
import ImageConverter from './components/pdf to image/ImageConverter.jsx';
import ImgDocConverter from './components/img to doc/ImgDocConverter.jsx';
import OcrConverter from './components/OCR/OcrConverter.jsx';
import Reader from './components/READER/Reader.jsx';
import AuthDashboard from './components/Auth/AuthDashboard.jsx';
import GoogleAuth from './components/Auth/GoogleAuth.jsx';
import Profile from './components/Profile.jsx';
import ForgetPassword from './components/Auth/ForgetPassword.jsx';
import ChangePassword from './components/Auth/ChangePassword.jsx';

function Main() {
  const token = localStorage.getItem('token');
  const [login, setLogin] = useState(token);

  const router = createBrowserRouter([
    {
      element: <App />,
      path: '/',
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/table-extraction', element: <TableExtantion /> },
        { path: '/pdf-to-doc', element: <DocumentConverter /> },
        { path: '/pdf-to-img', element: <ImageConverter /> },
        { path: '/img-to-doc', element: <ImgDocConverter /> },
        { path: '/ocr', element: <OcrConverter /> },
        { path: '/reader', element: <Reader /> },
        { path: '/forgotPassword', element: <ForgetPassword /> },
        { path: '/changePassword', element: <ChangePassword /> },
      
      
        {
          path: '/auth',
          element: login ? <HomePage /> : <AuthDashboard />,
        },
        { path: '/google-auth-redirect', element: <GoogleAuth /> },
        { path: '/profile',
           element: login ?  <Profile />:<HomePage />},

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
