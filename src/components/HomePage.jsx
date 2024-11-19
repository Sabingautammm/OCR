import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import table from '../Media/table.jpg';
import pdf from '../Media/pdf.jpg';
import image from '../Media/image.png';

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
  return (
    <>
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      <div className="w-full min-h-screen relative overflow-hidden">

        {/* Section 1: Introduction */}
        <section className="w-full h-screen flex flex-col items-center justify-center text-center relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl abril-fatface-regular md:text-5xl font-bold text-gray-800 mb-4">
              Welcome to <span className='rubik-wet-paint-regular text-purple-600'>RAN</span> Document Analysis
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              Streamline your document workflows with intelligent PDF tools.
            </p>
            <NavLink to={'/ocr'}>
              <motion.button
                className="mt-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-2 px-6 md:py-3 md:px-8 rounded-lg shadow-lg hover:shadow-2xl hover:from-purple-600 hover:to-blue-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Get Started
              </motion.button>
            </NavLink>
          </motion.div>
        </section>

        {/* Section 2: Features */}
        <section className="w-full bg-gray-100 py-12 md:py-20 px-4 sm:px-6 lg:px-20 border-t-2 relative z-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-8 md:mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 transform transition-transform flex flex-col items-center shadow-md hover:shadow-xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.animationDelay }}
                whileHover={{ scale: 1.03 }}
              >
                <img src={feature.photo} alt={`${feature.title} illustration`} className="max-h-40 w-full object-cover mb-4 rounded-lg shadow-sm" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center text-sm mb-4">{feature.description}</p>
                <NavLink to={feature.link}>
                  <button className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 px-5 rounded-md shadow-md hover:from-teal-500 hover:to-blue-600 transition-all duration-200">
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
