"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
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
  Award,
  Users
} from 'lucide-react';

// Skeleton loaders


const StudentTutorialPage = () => {
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

  const studentSteps = [
    {
      id: 1,
      icon: <Mail size={40} className="text-[#2A9D8F]" />,
      title: "Receive the Official Registration Link",
      summary: "Students receive a unique registration form link from their institution.",
      details: "The initial step for every student in obtaining their Instipass ID is to receive an official registration link. This unique link is securely provided by your institution, acting as your personalized gateway to the Instipass registration portal. It is imperative to note that this form is not generic; it is meticulously generated and controlled by Instipass, specifically tailored to align with your institution's predefined preferences and requirements.",
      keyPoints: [
        "Unique, secure registration link",
        "Personalized gateway to registration portal",
        "Institution-specific customization",
        "Aligned with institutional preferences",
        "Trusted source verification important"
      ]
    },
    {
      id: 2,
      icon: <FileText size={40} className="text-[#2A9D8F]" />,
      title: "One-Time Registration",
      summary: "Complete the registration form with accurate details and required documents.",
      details: "Upon accessing the registration link, you will be directed to a secure form where you must provide accurate details and upload any required documents. It is critical to understand that this registration process is designed for one-time submission only. This means that once you submit your information, you will not be able to re-access the form to make edits or resubmit.",
      keyPoints: [
        "One-time submission only",
        "Accurate details required",
        "Required document uploads",
        "No re-access after submission",
        "Careful review before submission essential"
      ]
    },
    {
      id: 3,
      icon: <AlertCircle size={40} className="text-[#2A9D8F]" />,
      title: "No Edits Post-Submission",
      summary: "Contact Instipass support directly for any mistakes or issues after submission.",
      details: "Given the one-time submission policy, it is crucial to understand the implications should you identify an error or omission in your submitted registration form. Unlike many online forms that allow for self-service edits or re-submissions, the Instipass student registration process does not permit such modifications post-submission. This stringent approach is a security measure designed to maintain the integrity and accuracy of the identification data.",
      keyPoints: [
        "No self-service editing allowed",
        "Security measure for data integrity",
        "Direct support contact required for issues",
        "No re-registration attempts",
        "Support team equipped to handle corrections"
      ]
    },
    {
      id: 4,
      icon: <Bell size={40} className="text-[#2A9D8F]" />,
      title: "Real-Time Processing & Notifications",
      summary: "Receive notifications via email or SMS about your ID processing status.",
      details: "Once your registration form has been successfully submitted, the Instipass system initiates the processing of your ID. Throughout this phase, you will receive timely notifications to keep you informed of your ID's status. These notifications, delivered via email or SMS, are designed to provide real-time updates, ensuring you are always aware of where your ID is in the production pipeline.",
      keyPoints: [
        "Real-time status updates",
        "Email and SMS notifications",
        "Processing stage alerts",
        "Ready for download/collection alerts",
        "Minimizes uncertainty"
      ]
    },
    {
      id: 5,
      icon: <Download size={40} className="text-[#2A9D8F]" />,
      title: "ID Delivery",
      summary: "Receive your digital ID through secure links, downloads, or portal access.",
      details: "The final stage of the Instipass ID process is the delivery of your identification. The method of delivery will depend on the arrangements made between your institution and Instipass. For many students, this will involve receiving a digital ID, which offers immediate accessibility and convenience. This digital ID may be provided through a secure link, allowing you to download it directly, or via a portal login that grants you access to your digital identification.",
      keyPoints: [
        "Flexible delivery methods",
        "Digital ID immediate accessibility",
        "Secure link or portal access",
        "Physical delivery instructions if applicable",
        "Official identification completion"
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
              <GraduationCap className="text-[#2A9D8F] mr-3" size={32} />
              <h1 className="text-2xl font-bold">Student Tutorial</h1>
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
              <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
                Student Guide
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Student <span className="text-[#2A9D8F]">Tutorial</span>
              </h1>
              <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Step-by-step guide for students to register and receive their Instipass digital ID
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  onClick={() => setIsBookDemoOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#2A9D8F] to-[#1D3557] text-white text-lg font-medium rounded-lg shadow-xl cursor-pointer z-10"
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="inline-block mr-2" size={20} />
                  Get Started
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
                <Shield className="text-[#2A9D8F] mr-2" size={24} />
                <span className="font-medium">Secure Process</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Clock className="text-[#2A9D8F] mr-2" size={24} />
                <span className="font-medium">Quick Registration</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Bell className="text-[#2A9D8F] mr-2" size={24} />
                <span className="font-medium">Real-time Updates</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CheckCircle className="text-[#2A9D8F] mr-2" size={24} />
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
              <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
                Registration Process
              </span>
              <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
                <GraduationCap className="mr-3 text-[#2A9D8F]" size={32} />
                Student Flow Tutorial
              </h2>
              <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Step-by-step guide for students to register and receive their Instipass digital ID
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {studentSteps.map((step, index) => (
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
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2A9D8F] text-white font-bold text-lg">
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

        {/* Benefits Section */}
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
                Student Benefits
              </span>
              <h2 className="text-4xl font-bold mb-6">Why Students Love Instipass</h2>
              <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Discover the advantages of having a digital student ID that's always accessible.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Download size={48} className="text-[#2A9D8F]" />,
                  title: "Always Accessible",
                  description: "Access your student ID anytime, anywhere from your mobile device or computer."
                },
                {
                  icon: <Shield size={48} className="text-[#2A9D8F]" />,
                  title: "Secure & Verified",
                  description: "Advanced security features ensure your digital ID is tamper-proof and authentic."
                },
                {
                  icon: <Clock size={48} className="text-[#2A9D8F]" />,
                  title: "Instant Updates",
                  description: "Receive real-time notifications about your ID status and any important updates."
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: darkMode 
                      ? "0 15px 35px rgba(0, 0, 0, 0.3)" 
                      : "0 15px 35px rgba(0, 0, 0, 0.1)"
                  }}
                  className={`p-8 rounded-xl text-center transition-all duration-300 ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
                  } border border-transparent hover:border-[#2A9D8F] hover:border-opacity-30`}
                >
                  <div className="mb-6 flex justify-center">
                    <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{benefit.description}</p>
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
                <h2 className="text-4xl font-bold mb-6">Ready to Get Your Digital ID?</h2>
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Follow the simple steps above to register for your Instipass digital student ID and enjoy the convenience of always having your identification with you.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.button
                    onClick={() => setIsBookDemoOpen(true)}
                    className="px-8 py-4 bg-gradient-to-r from-[#2A9D8F] to-[#1D3557] text-white text-lg font-medium rounded-lg shadow-xl"
                    whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users className="inline-block mr-2" size={20} />
                    Get Started
                  </motion.button>
                  <motion.button
                    className={`px-8 py-4 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} text-lg font-medium rounded-lg border border-gray-300 dark:border-gray-500 shadow-lg`}
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
              <GraduationCap className="text-[#2A9D8F] mr-3" size={32} />
              <span className="text-2xl font-bold">Student Tutorial</span>
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

export default StudentTutorialPage;

