import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import table from '../Media/table.jpg';
import pdf from '../Media/pdf.jpg';
import image from '../Media/image.png';
import { useState } from 'react';

const features = [
  {
    title: 'Table Extraction',
    description: 'Extract structured data from tables in PDFs with precision.',
    animationDelay: 0.1,
    link: "/table-extentation",
    photo: table,
  },
  {
    title: 'PDF to DOC Converter',
    description: 'Convert PDF files to editable Word documents effortlessly.',
    animationDelay: 0.2,
    link: '/pdf-to-doc',
    photo: pdf,
  },
  {
    title: 'PDF to Image',
    description: 'Transform PDF pages into high-quality images for easy viewing.',
    animationDelay: 0.3,
    link: "/pdf-to-img",
    photo: image,
  },
];


const HomePage = () => {
  const token = localStorage.getItem('token');
const [login, setLogin] = useState(token);
  return (
    <>
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      <div className="relative w-full min-h-screen overflow-hidden">

        {/* Section 1: Introduction */}
        <section className="relative z-10 flex flex-col items-center justify-center w-full h-screen px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 text-3xl font-bold text-gray-800 abril-fatface-regular md:text-5xl">
              Welcome to <span className='text-purple-600 rubik-wet-paint-regular'>RAN</span> Document Analysis
            </h1>
            <p className="text-base text-gray-700 md:text-lg">
              Streamline your document workflows with intelligent PDF tools.
            </p>
            <NavLink to={login ? '/ocr' : '/auth'}>
              <motion.button
                className="px-6 py-2 mt-6 text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-blue-600 md:py-3 md:px-8 hover:shadow-2xl hover:from-purple-600 hover:to-blue-700"
                whileHover={{ scale: 1.05 }}
              >
                Get Started
              </motion.button>
            </NavLink>
          </motion.div>
        </section>

        {/* Section 2: Features */}
        <section className="relative z-10 w-full px-4 py-12 bg-gray-100 border-t-2 md:py-20 sm:px-6 lg:px-20">
          <h2 className="mb-8 text-2xl font-semibold text-center text-gray-800 md:text-3xl md:mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 transition-transform transform bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.animationDelay }}
                whileHover={{ scale: 1.03 }}
              >
                <img src={feature.photo} alt={`${feature.title} illustration`} className="object-cover w-full mb-4 rounded-lg shadow-sm max-h-40" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">{feature.title}</h3>
                <p className="mb-4 text-sm text-center text-gray-600">{feature.description}</p>
                <NavLink to={feature.link}>
                  <button className="px-5 py-2 text-white transition-all duration-200 rounded-md shadow-md bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600">
                    Explore {feature.title}
                  </button>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
