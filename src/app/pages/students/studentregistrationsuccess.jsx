"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Bell, Mail, User, Clock, Info } from 'lucide-react';
// import Link from 'next/link';
import AccessTokenProtectedPage from '../../components/AccessTokenProtectedPage'
import TokenProtectedPage from '@/app/components/TokenProtected';

const StudentSignupSuccessPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  return (
    <TokenProtectedPage>
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b border-gray-200 dark:border-gray-700`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[#1D3557] dark:text-[#2A9D8F]">
              Instipass
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Student Portal
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-[#2A9D8F] bg-opacity-10 rounded-full mb-8"
          >
            <CheckCircle className="text-[#2A9D8F]" size={48} />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ID Registration <span className="text-[#2A9D8F]">Successful!</span>
          </h1>
          
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            🎉 Congratulations! You have successfully registered for your student ID with Instipass. 
            Your registration has been received and is being processed.
          </p>
          
          <div className={`inline-flex items-center px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}>
            <User className="text-[#2A9D8F] mr-3" size={20} />
            <span className="font-medium">Student ID Registration Complete</span>
          </div>
        </motion.div>

        {/* What's Next Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700 mb-12`}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-[#2A9D8F] bg-opacity-10 rounded-lg">
                <Clock className="text-[#2A9D8F]" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Your student ID registration is now being processed by our team. We'll keep you updated throughout the process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border border-gray-200 dark:border-gray-600`}>
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex-shrink-0 mt-1">
                  <Bell className="text-[#2A9D8F]" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Stay Tuned for Updates</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    We'll send you email notifications about your ID status, including when it's ready for collection or delivery.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border border-gray-200 dark:border-gray-600`}>
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex-shrink-0 mt-1">
                  <Info className="text-[#2A9D8F]" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Processing Time</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your student ID will typically be processed within 3-5 business days. We'll notify you as soon as it's ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stay Connected Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`p-8 rounded-xl ${darkMode ? 'bg-gradient-to-r from-[#2A9D8F] to-[#1D3557]' : 'bg-gradient-to-r from-[#2A9D8F] to-[#1D3557]'} text-white mb-12`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-lg">
                <Bell className="text-white" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Make sure to check your email regularly for important updates about your student ID. 
              We'll keep you informed every step of the way!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2">
                <Mail className="text-white" size={20} />
                <span>Email notifications enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="text-white" size={20} />
                <span>Status updates included</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Support Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Have Questions or Inquiries?</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our support team is here to help you with any questions about your student ID registration
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg">
                  <Mail className="text-[#2A9D8F]" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get help with your student ID registration, status updates, or any other inquiries
              </p>
              <a 
                href="mailto:support@instipass.com" 
                className="inline-flex items-center px-6 py-3 bg-[#2A9D8F] text-white font-medium rounded-lg hover:bg-[#1D3557] transition-colors"
              >
                <Mail className="mr-2" size={20} />
                support@instipass.com
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-t border-gray-200 dark:border-gray-700 mt-16`}>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#1D3557] dark:text-[#2A9D8F] mb-4">
              Instipass
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Your digital student ID solution
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              © 2024 Instipass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </TokenProtectedPage>
  );
};

export default StudentSignupSuccessPage;