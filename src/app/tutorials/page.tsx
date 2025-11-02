"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  University, 
  Users, 
  ChevronRight, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  Bell, 
  Cloud,
  UserPlus,
  Cog,
  BarChart,
  Calendar,
  Mail,
  Settings,
  Shield,
  Clock,
  AlertCircle,
  Download,
  Eye,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import InstitutionTutorialPage from '../pages/tutorials/tutorialsinstitutions';
import StudentTutorialPage from '../pages/tutorials/tutorialsstudents';
import '../globals.css';

const TutorialsApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'institution', 'student'

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('instipass-theme', newDarkMode ? 'dark' : 'light');
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'institution':
        return <InstitutionTutorialPage />;
      case 'student':
        return <StudentTutorialPage />;
      default:
        return <HomePage />;
    }
  };

  // Home page component
  const HomePage = () => (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="text-[#1D3557] dark:text-[#2A9D8F] mr-3" size={32} />
              <h1 className="text-2xl font-bold">Instipass Tutorials</h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#1D3557] bg-opacity-10 text-[#1D3557] dark:text-[#2A9D8F] font-medium mb-4">
              Complete Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Instipass <span className="text-[#2A9D8F]">Tutorials</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive step-by-step guides for institutions and students to navigate the Instipass digital ID management system
            </p>
          </motion.div>

          {/* Tutorial Selection Cards */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Institution Tutorial Card */}
            <motion.div
              className={`p-8 rounded-xl transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
              } border border-transparent hover:border-[#1D3557] hover:border-opacity-30 shadow-lg hover:shadow-xl`}
              whileHover={{ 
                y: -10,
                boxShadow: darkMode 
                  ? "0 15px 35px rgba(0, 0, 0, 0.3)" 
                  : "0 15px 35px rgba(0, 0, 0, 0.1)"
              }}
              onClick={() => setCurrentPage('institution')}
            >
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`p-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                    <University className="text-[#1D3557] dark:text-[#2A9D8F]" size={48} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Institution Tutorial</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Complete guide for institutions to set up and manage their Instipass digital ID system
                </p>
                <div className="flex items-center justify-center text-[#1D3557] dark:text-[#2A9D8F] font-medium">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </motion.div>

            {/* Student Tutorial Card */}
            <motion.div
              className={`p-8 rounded-xl transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
              } border border-transparent hover:border-[#2A9D8F] hover:border-opacity-30 shadow-lg hover:shadow-xl`}
              whileHover={{ 
                y: -10,
                boxShadow: darkMode 
                  ? "0 15px 35px rgba(0, 0, 0, 0.3)" 
                  : "0 15px 35px rgba(0, 0, 0, 0.1)"
              }}
              onClick={() => setCurrentPage('student')}
            >
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`p-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                    <GraduationCap className="text-[#2A9D8F]" size={48} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Student Tutorial</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Step-by-step guide for students to register and receive their Instipass digital ID
                </p>
                <div className="flex items-center justify-center text-[#2A9D8F] font-medium">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className={`py-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="text-[#1D3557] mr-2" size={24} />
              <span className="font-medium">GDPR Compliant</span>
            </motion.div>
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CheckCircle className="text-[#1D3557] mr-2" size={24} />
              <span className="font-medium">ISO 27001 Certified</span>
            </motion.div>
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Clock className="text-[#1D3557] mr-2" size={24} />
              <span className="font-medium">99% Satisfaction Rate</span>
            </motion.div>
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Bell className="text-[#1D3557] mr-2" size={24} />
              <span className="font-medium">24/7 Support</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
              What You'll Learn
            </span>
            <h2 className="text-4xl font-bold mb-6">Tutorial Overview</h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our comprehensive tutorials cover everything you need to know about the Instipass system
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <UserPlus size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
                title: "Registration Process",
                description: "Learn how to register and set up your account in the Instipass system."
              },
              {
                icon: <Settings size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
                title: "Configuration",
                description: "Understand how to configure settings and preferences for optimal use."
              },
              {
                icon: <BarChart size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
                title: "Monitoring & Analytics",
                description: "Discover how to track progress and analyze system performance."
              },
              {
                icon: <Download size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
                title: "ID Delivery",
                description: "Learn about the various methods of receiving and accessing digital IDs."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-xl text-center ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="mb-4 flex justify-center">
                  <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
        <div className="container mx-auto px-6">
          <motion.div 
            className={`rounded-3xl p-12 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border border-gray-200 dark:border-gray-600`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Choose your tutorial path and begin your journey with Instipass digital ID management.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  onClick={() => setCurrentPage('institution')}
                  className="px-8 py-4 bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] text-white text-lg font-medium rounded-lg shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <University className="inline-block mr-2" size={20} />
                  Institution Tutorial
                </motion.button>
                <motion.button
                  onClick={() => setCurrentPage('student')}
                  className={`px-8 py-4 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} text-lg font-medium rounded-lg border border-gray-300 dark:border-gray-500 shadow-lg`}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GraduationCap className="inline-block mr-2" size={20} />
                  Student Tutorial
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t`}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="text-[#1D3557] dark:text-[#2A9D8F] mr-3" size={32} />
              <span className="text-2xl font-bold">Instipass Tutorials</span>
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 Instipass. All rights reserved. | Comprehensive digital ID management solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {renderCurrentPage()}
    </AnimatePresence>
  );
};

export default TutorialsApp;

