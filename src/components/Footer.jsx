import React from 'react'
import { FaFileAlt, FaHome, FaImage, FaTable } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
const Footer = () => {
    return (
      <>
      <NavLink to="/"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center space-x-2 py-3 px-4 hover:bg-indigo-600 md:hover:bg-transparent rounded-md transition duration-200"
              >
                <FaHome className="text-xl" />
                <span>HomePage</span>
              </motion.div>
            </NavLink>

            <NavLink to="/table-extentation"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center space-x-2 py-3 px-4 hover:bg-indigo-600 md:hover:bg-transparent rounded-md transition duration-200"
                >
                <FaTable className="text-xl" />
                <span>Table Extraction</span>
              </motion.div>
            </NavLink>

            <NavLink to="/pdf-to-doc"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center space-x-2 py-3 px-4 hover:bg-indigo-600 md:hover:bg-transparent rounded-md transition duration-200"
                >
                <FaFileAlt className="text-xl" />
                <span>PDF to DOC</span>
              </motion.div>
            </NavLink>

            <NavLink to="img-to-doc"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center space-x-2 py-3 px-4 hover:bg-indigo-600 md:hover:bg-transparent rounded-md transition duration-200"
              >
                <FaFileAlt className="text-xl" />
                <span>Image to DOC</span>
              </motion.div>
            </NavLink>

            <NavLink to="/pdf-to-img"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center space-x-2 py-3 px-4 hover:bg-indigo-600 md:hover:bg-transparent rounded-md transition duration-200"
                >
                <FaImage className="text-xl" />
                <span>PDF to Image</span>
              </motion.div>
            </NavLink>
            <NavLink to="/ocr"  className="nav-link md:text-white">
              <motion.div
                whileHover={{ scale: 1.1, color: '#FFD700' }}
                className="flex items-center space-x-2 py-3 px-4 hover:bg-indigo-600 md:hover:bg-transparent rounded-md transition duration-200"
                >
                <FaImage className="text-xl" />
                <span>OCR</span>
              </motion.div>
            </NavLink>
                  </>
  )
}

export default Footer