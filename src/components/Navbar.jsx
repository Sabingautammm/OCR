import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTable, FaFileAlt, FaImage, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../Media/logo512.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutToggle, setIsLogoutToggle] = useState(false);
  const logoutRef = useRef(null);

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const firstname = localStorage.getItem('firstname');
  const lastname = localStorage.getItem('lastname');
  const username = localStorage.getItem('username');
  const photo = localStorage.getItem('photo') || ''; // Default to empty string if no photo
  


  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Close logout toggle when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setIsLogoutToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [login, setLogin] = useState(token);
 
  let intervalId;

  const handleMouseEnter = () => {
    setIsLogoutToggle(true);
    // Set an interval to toggle continuously every 1 second
 // Toggle every 1 second
  };
  
  const handleMouseLeave = () => {
    clearInterval(intervalId); // Clear the interval when the mouse leaves
    // Wait 3 seconds before resetting the toggle to false
    setTimeout(() => {
      setIsLogoutToggle(false);
    }, 1000); // 3 seconds delay before turning off the toggle
  };
  

  return (
    <motion.nav
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="relative z-20 flex md:h-[80px] items-center justify-between w-full px-6 py-2 text-white shadow-lg bg-gradient-to-r from-neutral-100 via-neutral-200 to-blue-300"
    >
      {/* Logo / Brand */}
      <NavLink to="/" className="flex items-center space-x-3">
        <motion.img
          src={logo}
          alt="logo"
          width={100}
          height={60}
          className="rounded-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </NavLink>
      
      {login ? (
 <div className="relative flex items-center gap-4">
 <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center cursor-pointer"
    >
         <NavLink to="/profile">
   <img
     className="object-cover w-12 h-12 rounded-full"
     src={photo.startsWith("http") ? photo : `http://192.168.1.34:8000${photo}` || "https://via.placeholder.com/40"}
     alt="User"
   />
    </NavLink>
   <h4 className="text-sm text-gray-900">{username}</h4>
  
   {isLogoutToggle && (
   <div
   ref={logoutRef}
   className="absolute z-10 w-20 p-2 mt-2 text-center text-gray-200 bg-purple-800 rounded-lg shadow-md top-full"
 >

     <button
     onClick={logOut}
       className="w-full py-0 text-sm font-semibold text-gray-200 transition-all duration-200 rounded-md hover:bg-blue-600 hover:text-white"
     >
       Log Out
     </button>
  
 </div>
 
   )}
 </div>

 {/* Hide the toggle button when the menu is open */}
 {!isOpen && (
   <div className="cursor-pointer md:hidden" onClick={toggleMenu}>
     <FaBars className="text-2xl" />
   </div>
 )}
</div>

      ) : (
        <NavLink 
          to="/auth" 
          className="px-4 py-2 text-white transition-all duration-300 transform bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105"
        >
          Login
        </NavLink>
      )}

      {/* Navigation Links */}
      {/* Navigation Links */}
<AnimatePresence>
  {login && (isOpen || window.innerWidth >= 768) && (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute left-0 flex-col w-full px-4 py-4 shadow-lg md:flex-row md:hidden md:space-x-8 md:static top-16 md:top-0 md:w-auto bg-gradient-to-r from-indigo-700 via-purple-800 to-blue-800 md:bg-transparent rounded-xl md:rounded-none md:shadow-none md:p-0"
    >
      {isOpen && (
        <div className="flex justify-end p-2 md:hidden">
          <FaTimes className="text-white cursor-pointer" onClick={closeMenu} />
        </div>
      )}

      {/* Navigation Links */}
      {[
        { text: 'Home', path: '/' },
        { text: 'Table Extraction', path: '/table-extraction' },
        { text: 'PDF to DOC', path: '/pdf-to-doc' },
        { text: 'Image to DOC', path: '/img-to-doc' },
        { text: 'PDF to Image', path: '/pdf-to-img' },
        { text: 'OCR', path: '/ocr' }
      ].map(({ text, path }, index) => (
        <NavLink
          key={index}
          to={path}  // Corrected path here
          onClick={closeMenu}
          className="nav-link md:text-white"
        >
          <motion.div
            whileHover={{ scale: 1.1, color: '#FFD700' }}
            className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
          >
            {index === 0 && <FaHome className="text-xl" />}
            {index === 1 && <FaTable className="text-xl" />}
            {index === 2 && <FaFileAlt className="text-xl" />}
            {index === 3 && <FaFileAlt className="text-xl" />}
            {index === 4 && <FaImage className="text-xl" />}
            {index === 5 && <FaImage className="text-xl" />}
            <span>{text}</span>
          </motion.div>
        </NavLink>
      ))}
    </motion.div>
  )}
</AnimatePresence>

    </motion.nav>
  );
};

export default Navbar;
