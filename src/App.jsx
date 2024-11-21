import React, { useContext, useState } from 'react'
import Navbar from './components/Navbar'
import { Outlet, Route, Router } from 'react-router-dom'
import HomePage from './components/HomePage'
import TableExtantion from './components/Table extention/TableExtantion'
import AuthDashboard from './components/Auth/AuthDashboard'
import Footer from './components/Footer'


const App = () => {
  const token = localStorage.getItem('token')
  
const [login,setlogin]=useState(token);
  return (
    <>
   
      {/* {login ? */}
        <>
        <div className=''>
          <Navbar />
          </div>
          <div className=''>
         

          <Outlet />
          </div>
        
          <div className='fixed bottom-0 z-40 justify-center hidden w-full bg-gradient-to-r from-indigo-700 via-purple-800 to-blue-800 md:flex'><Footer/> </div>
          </>
        {/* //   :<AuthDashboard/>
        //  }  */}
      
 
    </>
  )
}

export default App