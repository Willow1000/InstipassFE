"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, Calendar, ArrowRight, Download, Users, Settings, BarChart, Shield } from 'lucide-react';
import Link from 'next/link';
import AccessTokenProtectedPage from '@/app/components/AccessTokenProtectedPage';

const SignupSuccessPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const nextSteps = [
    {
      icon: <Mail className="text-[#2A9D8F]" size={24} />,
      title: "Check Your Email",
      description: "We've sent you a welcome email with your login credentials and setup instructions.",
      action: "Check Email"
    },
    {
      icon: <Calendar className="text-[#2A9D8F]" size={24} />,
      title: "Schedule Onboarding",
      description: "Book a personalized onboarding session with our implementation team.",
      action: "Schedule Now"
    },
    {
      icon: <Download className="text-[#2A9D8F]" size={24} />,
      title: "Download Resources",
      description: "Access our implementation guide and training materials for your team.",
      action: "Download Guide"
    },
    {
      icon: <Settings className="text-[#2A9D8F]" size={24} />,
      title: "Configure Your System",
      description: "Set up your institution profile, branding, and initial user accounts.",
      action: "Start Setup"
    }
  ];

  const features = [
    {
      icon: <Users className="text-[#1D3557]" size={32} />,
      title: "Student Management",
      description: "Easily manage student profiles and ID issuance"
    },
    {
      icon: <BarChart className="text-[#1D3557]" size={32} />,
      title: "Analytics Dashboard",
      description: "Track usage and generate comprehensive reports"
    },
    {
      icon: <Shield className="text-[#1D3557]" size={32} />,
      title: "Security & Compliance",
      description: "Enterprise-grade security with GDPR compliance"
    }
  ];

  return (
    <AccessTokenProtectedPage>
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b border-gray-200 dark:border-gray-700`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#1D3557] dark:text-[#2A9D8F]">
              Instipass
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
            Welcome to <span className="text-[#2A9D8F]">Instipass!</span>
          </h1>
          
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Congratulations! Your institution has successfully signed up for Instipass. 
            You're now ready to transform your student ID management system.
          </p>
          
          <div className={`inline-flex items-center px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}>
            <CheckCircle className="text-[#2A9D8F] mr-3" size={20} />
            <span className="font-medium">Account Created Successfully</span>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What's Next?</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Follow these simple steps to get your institution up and running with Instipass
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg mr-4">
                    {step.icon}
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-[#1D3557] text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {step.description}
                </p>
                <button className="flex items-center text-[#2A9D8F] font-medium hover:text-[#1D3557] transition-colors">
                  {step.action}
                  <ArrowRight className="ml-1" size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What You'll Get Access To</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore the powerful features that will streamline your institution's operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className={`text-center p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}
              >
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-[#1D3557] bg-opacity-10 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Need Help Getting Started?</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our support team is here to help you every step of the way
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg">
                  <Mail className="text-[#2A9D8F]" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get help via email within 24 hours
              </p>
              <a 
                href="mailto:support@instipass.com" 
                className="text-[#2A9D8F] font-medium hover:text-[#1D3557] transition-colors"
              >
                support@instipass.com
              </a>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg">
                  <Phone className="text-[#2A9D8F]" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Speak with our team directly
              </p>
              <a 
                href="tel:+1-800-INSTIPASS" 
                className="text-[#2A9D8F] font-medium hover:text-[#1D3557] transition-colors"
              >
                +1 (800) INSTIPASS
              </a>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/institution" passHref>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] text-white text-lg font-medium rounded-lg shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Access Your Dashboard
                <ArrowRight className="inline ml-2" size={20} />
              </motion.button>
            </Link>
            
            <Link href="/support" passHref>
              <motion.button
                className={`px-8 py-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} text-lg font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-t border-gray-200 dark:border-gray-700 mt-16`}>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#1D3557] dark:text-[#2A9D8F] mb-4">
              Instipass
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 Instipass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </AccessTokenProtectedPage>
  );
};

export default SignupSuccessPage;

