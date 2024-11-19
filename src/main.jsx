import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {  createHashRouter, RouterProvider } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import TableExtantion from './components/Table extention/TableExtantion.jsx'
import DocumentConverter from './components/pdf to doc/DocumentConverter.jsx'
import ImageConverter from './components/pdf to image/ImageConverter.jsx'
import ImgDocConverter from './components/img to doc/ImgDocConverter.jsx'
import OcrConverter from './components/OCR/OcrConverter.jsx'
const router = createHashRouter([
  {
    element: <App />, path: '/', children: [
      { path: '/', element: <HomePage /> },
      { path: '/table-extentation', element: <TableExtantion /> },
      { path: '/pdf-to-doc', element: <DocumentConverter /> },
      { path: '/pdf-to-img', element: <ImageConverter /> },
      { path: '/img-to-doc', element: < ImgDocConverter/> },
      { path: '/ocr', element: < OcrConverter/> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
      
    <App />
   </RouterProvider>
  </StrictMode>,
)
