"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  University, 
  ChevronRight, 
  CheckCircle, 
  ArrowRight, 
  Calendar,
  Mail,
  Settings,
  Shield,
  Clock,
  AlertCircle,
  Download,
  Eye,
  BookOpen,
  BarChart,
  FileText,
  Bell,
  UserPlus,
  Cog,
  Star,
  Award
} from 'lucide-react';

// Skeleton loaders


const InstitutionTutorialPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  
  // Ref for scroll to sections
  const featuresRef = useRef(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
      
      // Listen for theme changes
      const handleThemeChange = (event) => {
        setDarkMode(event.detail.darkMode);
      };
      
      window.addEventListener('themeChange', handleThemeChange);
      return () => {
        window.removeEventListener('themeChange', handleThemeChange);
      };
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('instipass-theme', newDarkMode ? 'dark' : 'light');
  };

  // Scroll to section function
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const institutionSteps = [
    {
      id: 1,
      icon: <Calendar size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Demo / Sales Contact",
      summary: "Book a demo or contact the Instipass sales team to clarify your ID issuance needs.",
      details: "The journey for institutions seeking to streamline their ID issuance begins with an initial engagement with Instipass. This can be initiated in one of two primary ways: either by scheduling a personalized demonstration of the Instipass platform or by directly contacting the dedicated Instipass sales team. During a demo call or through detailed email exchanges, Instipass representatives work closely with the institution to clarify their unique needs, such as the volume of IDs required, specific design preferences, integration possibilities with existing systems, and any compliance considerations.",
      keyPoints: [
        "Schedule personalized platform demonstration",
        "Direct contact with dedicated sales team",
        "Clarify volume requirements and design preferences",
        "Discuss integration with existing systems",
        "Address compliance considerations"
      ]
    },
    {
      id: 2,
      icon: <Mail size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Signup Link Issued",
      summary: "Receive a unique signup link from the Instipass team after internal approval.",
      details: "Following the initial consultation and any necessary internal deliberations or approvals within the institution, the Instipass team will issue a unique signup link. This link is a critical component, serving as the gateway for the institution to establish its official account within the Instipass platform. Upon receiving this link, the designated administrator or point of contact at the institution can proceed to create their account, which subsequently grants them access to the Instipass dashboard.",
      keyPoints: [
        "Unique, secure signup link provided",
        "Gateway to official platform account",
        "Designated administrator access",
        "Dashboard access granted",
        "Security and integrity maintained"
      ]
    },
    {
      id: 3,
      icon: <Settings size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Specify ID Preferences",
      summary: "Configure your institution's ID preferences including fields, branding, and optional features.",
      details: "Once an institution has successfully signed up and gained access to the Instipass dashboard, the next pivotal step involves specifying their unique ID preferences. This is achieved through an intuitive form or a dedicated configuration tool within the platform, designed to capture all necessary details for customizing the institution's identification cards. This phase directly influences the appearance and functionality of the IDs issued to students.",
      keyPoints: [
        "Define fields to appear on ID (name, photo, course, etc.)",
        "Set branding requirements (logos, colors, fonts)",
        "Configure optional features (QR codes, expiration dates)",
        "Customize student registration experience",
        "Lock in preferences for consistency"
      ]
    },
    {
      id: 4,
      icon: <FileText size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Student Registration Form Generated",
      summary: "Instipass automatically creates a custom-tailored student registration form.",
      details: "Upon the successful configuration and locking in of ID preferences, Instipass automatically generates a bespoke student registration form. This form is meticulously crafted to reflect the specific requirements and branding elements previously defined by the institution. The automation of this process significantly reduces administrative burden and ensures accuracy, as the form is custom-tailored to collect precisely the information needed for ID issuance.",
      keyPoints: [
        "Automatically generated based on preferences",
        "Custom-tailored to institution requirements",
        "Reflects specific branding elements",
        "One-time use per student validation",
        "Reduces administrative burden"
      ]
    },
    {
      id: 5,
      icon: <BarChart size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Dashboard Access and Monitoring",
      summary: "Monitor registration progress, batch status, and submission analytics in real-time.",
      details: "With the student registration form in circulation, institutions gain access to a dedicated dashboard, serving as the central hub for real-time monitoring and management of the ID issuance process. This intuitive dashboard provides a comprehensive overview of various critical metrics and statuses, enabling administrators to track progress live and intervene if necessary.",
      keyPoints: [
        "Real-time registration progress tracking",
        "Batch status monitoring (Not Started, In Progress, Completed)",
        "Comprehensive submission analytics",
        "Live process tracking capabilities",
        "Direct support contact available"
      ]
    },
    {
      id: 6,
      icon: <Bell size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Batch Completion Notification",
      summary: "Receive notification when the batch is ready, with final payment triggered if applicable.",
      details: "Once all students within a designated batch have successfully registered and their respective ID details have been processed by the Instipass system, the institution will receive a formal notification indicating that the batch is ready for finalization and delivery. This notification serves as a crucial checkpoint, signifying that the bulk of the ID creation process has been completed.",
      keyPoints: [
        "Formal batch completion notification",
        "Crucial checkpoint in ID creation process",
        "Final payment triggered if applicable",
        "Clear financial reconciliation process",
        "Prevents delivery delays"
      ]
    },
    {
      id: 7,
      icon: <Download size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Delivery of IDs",
      summary: "Receive the complete batch of IDs through digital, physical, or combined delivery methods.",
      details: "Upon successful completion of all preceding steps, including any final payments, the entire batch of student IDs is delivered to the institution. Instipass offers flexible delivery options to accommodate diverse institutional needs, which may include digital delivery, physical delivery, or a combination of both, depending on the pre-arranged agreement.",
      keyPoints: [
        "Flexible delivery options available",
        "Digital delivery through secure links/portals",
        "Physical delivery with secure shipping",
        "Complete audit trail maintained",
        "Successful process culmination"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <University className="text-[#1D3557] dark:text-[#2A9D8F] mr-3" size={32} />
              <h1 className="text-2xl font-bold">Institution Tutorial</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Book Demo Button */}
      {/* <div className="fixed right-6 top-24 z-40">
        <motion.button
          onClick={() => setIsBookDemoOpen(true)}
          className={`flex items-center px-5 py-3 font-medium rounded-lg shadow-lg bg-transparent ${darkMode ? 'text-white' : 'text-black'} hover:bg-[#2A9D8F] hover:text-white`}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Calendar className="mr-2" size={18} />
          Book Demo Session
        </motion.button>
      </div> */}

      <main className="flex-grow overflow-x-hidden">
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
                Institution <span className="text-[#1D3557] dark:text-[#2A9D8F]">Tutorial</span>
              </h1>
              <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Comprehensive step-by-step guide for institutions to set up and manage their Instipass digital ID system
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  onClick={() => setIsBookDemoOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] text-white text-lg font-medium rounded-lg shadow-xl cursor-pointer z-10"
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="inline-block mr-2" size={20} />
                  Book a Demo
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection(featuresRef)}
                  className="px-8 py-4 bg-white bg-opacity-20 backdrop-blur-sm text-white text-lg font-medium rounded-lg border border-white border-opacity-30 shadow-lg z-10" 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Tutorial <ChevronRight className="inline ml-1" size={20} />
                </motion.button>
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
                <Award className="text-[#1D3557] mr-2" size={24} />
                <span className="font-medium">ISO 27001 Certified</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Star className="text-[#1D3557] mr-2" size={24} />
                <span className="font-medium">99% Satisfaction Rate</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CheckCircle className="text-[#1D3557] mr-2" size={24} />
                <span className="font-medium">24/7 Support</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tutorial Content */}
        <section ref={featuresRef} className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#1D3557] bg-opacity-10 text-[#1D3557] dark:text-[#2A9D8F] font-medium mb-4">
                Step-by-Step Process
              </span>
              <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
                <University className="mr-3 text-[#1D3557] dark:text-[#2A9D8F]" size={32} />
                Institution Flow Tutorial
              </h2>
              <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Complete guide for institutions to set up and manage their Instipass digital ID system
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {institutionSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`mb-8 rounded-xl overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-white'
                  } shadow-lg border border-transparent hover:border-[#2A9D8F] hover:border-opacity-30 transition-all duration-300`}
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1D3557] text-white font-bold text-lg">
                          {step.id}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">{step.title}</h3>
                          <ChevronRight 
                            className={`transform transition-transform duration-300 ${
                              expandedStep === step.id ? 'rotate-90' : ''
                            }`} 
                            size={20} 
                          />
                        </div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {step.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedStep === step.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                      >
                        <div className="p-6">
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Detailed Overview</h4>
                            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {step.details}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-3">Key Points</h4>
                            <ul className="space-y-2">
                              {step.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start">
                                  <CheckCircle className="text-[#2A9D8F] mr-2 flex-shrink-0 mt-0.5" size={16} />
                                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div 
              className={`rounded-3xl p-12 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'} shadow-2xl border border-gray-200 dark:border-gray-700`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-8 md:mb-0 md:mr-8 md:max-w-xl">
                  <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Institution?</h2>
                  <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Join the digital revolution in student identification. Reduce costs, streamline operations, and enhance security today.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="text-[#2A9D8F] mr-2" size={20} />
                      <span>Free implementation support</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-[#2A9D8F] mr-2" size={20} />
                      <span>30-day free trial</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-[#2A9D8F] mr-2" size={20} />
                      <span>No long-term contracts</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => setIsBookDemoOpen(true)}
                    className="px-8 py-4 bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] text-white text-lg font-medium rounded-lg shadow-xl"
                    whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar className="inline-block mr-2" size={20} />
                    Book a Demo
                  </motion.button>
                  <motion.button
                    className={`px-8 py-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} text-lg font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg`}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="inline-block mr-2" size={20} />
                    Contact Support
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t`}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <University className="text-[#1D3557] dark:text-[#2A9D8F] mr-3" size={32} />
              <span className="text-2xl font-bold">Institution Tutorial</span>
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 Instipass. All rights reserved. | Comprehensive digital ID management solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InstitutionTutorialPage;

