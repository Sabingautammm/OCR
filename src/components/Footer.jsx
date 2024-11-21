import React,{useState} from 'react'
import { FaFileAlt, FaHome, FaImage, FaTable } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons'; 
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
const Footer = () => {
  const [isDisabled, setIsDisabled] = useState(true); // Set to false to enable the link
  const [showTooltip, setShowTooltip] = useState(false); // State to manage tooltip visibility

  // Function to handle mouse enter and leave for tooltip
  const handleMouseEnter = () => {
    if (isDisabled) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
    return (
      <>
      <NavLink to="/"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
              >
                <FaHome className="text-xl" />
                <span>HomePage</span>
              </motion.div>
            </NavLink>

            <NavLink to="/table-extraction"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
                >
                <FaTable className="text-xl" />
                <span>Table Extraction</span>
              </motion.div>
            </NavLink>

            <NavLink     to={isDisabled ? "/pdf-to-doc" : "/pdf-to-doc"}
        className={`nav-link md:text-white ${isDisabled ? 'disable' : ''}`}
        // onClick={isDisabled ? (e) => e.preventDefault() : null}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
                >
                  <div className='flex flex-col'>
                 
                  <div className='flex'>
                 <FontAwesomeIcon icon="fa-sharp-duotone fa-solid fa-lock" /> 
                <FaFileAlt className="text-xl" />
                <span>PDF to DOC</span>
                </div>
                <div className='flex items-center justify-center text-black'>
                   {/* <FontAwesomeIcon icon={faLock} /> */}
                   </div>
                </div>
              </motion.div>
            </NavLink>

            <NavLink to="img-to-doc"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
              >
                <FaFileAlt className="text-xl" />
                <span>Image to DOC</span>
              </motion.div>
            </NavLink>

            <NavLink to="/pdf-to-img"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
                >
                <FaImage className="text-xl" />
                <span>PDF to Image</span>
              </motion.div>
            </NavLink>
            <NavLink to="/ocr"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
                >
                <FaImage className="text-xl" />
                <span>OCR</span>
              </motion.div>
            </NavLink>
            
            {/* <NavLink     to={isDisabled ? "#" : "/reader"}
        className={`nav-link md:text-white ${isDisabled ? 'disable' : ''}`}
        onClick={isDisabled ? (e) => e.preventDefault() : null}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
                >
                  <div className='flex flex-col'>
                 
                  <div className='flex gap-2'>
              
                 <FontAwesomeIcon icon={faVolumeUp} className='mt-1'/>
                <span>READER</span>
                </div>
                <div className='flex items-center justify-center text-black'>
                   <FontAwesomeIcon icon={faLock} />
                   </div>
                </div>
              </motion.div>
            </NavLink> */}




            {/* <NavLink to="/reader"  className="nav-link md:text-white">
            <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center px-4 py-3 space-x-2 transition duration-200 rounded-md hover:bg-indigo-600 md:hover:bg-transparent"
                >
                  <div className='flex flex-col'>
                 
                  <div className='flex gap-2'>
              
                 <FontAwesomeIcon icon={faVolumeUp} className='mt-1'/>
                <span>READER</span>
                </div>
                <div className='flex items-center justify-center text-black'>
                   <FontAwesomeIcon icon={faLock} />
                   </div>
                </div>
              </motion.div>
            </NavLink> */}
            
            {showTooltip && (
        <div className="absolute z-10 px-2 py-1 -mt-10 text-sm text-white bg-gray-700 rounded">
          You need to purchase premium to use this!
        </div>
      )}
                  </>
  )
}

export default Footer