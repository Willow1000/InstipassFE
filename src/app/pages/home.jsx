"use client";

import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Cloud, Cog, CheckCircle, University, Users, CreditCard, Calendar, Mail, BarChart, Bell, FileText, Shield, Smartphone, 
  BarChart2, 
  LayoutDashboard, 
 
  Headphones , Calculator, Clock, DollarSign, ArrowRight, ChevronRight, Star, Award } from 'lucide-react';
import Link from 'next/link';
// import Image from 'next/image';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ParallaxHero from '../components/ParallaxHero';
import dynamic from 'next/dynamic';
import AnimatedHowItWorks from '../components/HowItWorks'
// import metadata from '../utils/title'

// Import the Chatbot Interface component
import ChatbotInterface from '../components/ChatbotInterface'; // Assuming the component is in components/ChatbotInterface.jsx

// 
// Dynamically import BookDemoModal with ssr: false to prevent hydration issues
const BookDemoModal = dynamic(() => import('../components/BookDemoModal'), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 rounded-lg shadow-xl bg-white animate-pulse">
        <div className="h-64 w-full"></div>
      </div>
    </div>
  )
});

// Lazy load components for performance
const FAQSection = lazy(() => import('../components/FAQSection'));
const TestimonialCarousel = lazy(() => import('../components/TestimonialCarousel'));
const ClientLogos = lazy(() => import('../components/ClientLogos'));

const AnimatedIDs = lazy(() => import('../components/AnimatedIDs'));
const AdminDashboardPreview = lazy(() => import('./institutions/institutiondashboard'));

// Custom CSS classes for 3D effects
const styles = {
  perspective: {
    perspective: "1000px"
  },
  transformStyle3d: {
    transformStyle: "preserve-3d"
  },
  backfaceHidden: {
    backfaceVisibility: "hidden"
  }
};

// Skeleton loaders
const SkeletonLoader = ({ type, darkMode }) => {
  const bgColor = darkMode ? 'bg-gray-700' : 'bg-gray-200';
  
  if (type === 'text') {
    return (
      <div className="animate-pulse space-y-2">
        <div className={`h-4 ${bgColor} rounded w-3/4`}></div>
        <div className={`h-4 ${bgColor} rounded`}></div>
        <div className={`h-4 ${bgColor} rounded w-5/6`}></div>
      </div>
    );
  }
  
  if (type === 'card') {
    return (
      <div className="animate-pulse">
        <div className={`h-48 ${bgColor} rounded-lg mb-4`}></div>
        <div className={`h-4 ${bgColor} rounded w-3/4 mb-2`}></div>
        <div className={`h-4 ${bgColor} rounded mb-2`}></div>
        <div className={`h-4 ${bgColor} rounded w-5/6`}></div>
      </div>
    );
  }
  
  if (type === 'dashboard') {
    return (
      <div className="animate-pulse">
        <div className={`h-64 ${bgColor} rounded-lg mb-4`}></div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className={`h-24 ${bgColor} rounded`}></div>
          <div className={`h-24 ${bgColor} rounded`}></div>
          <div className={`h-24 ${bgColor} rounded`}></div>
        </div>
        <div className={`h-32 ${bgColor} rounded mb-4`}></div>
      </div>
    );
  }
  
  return null;
};

// Client-side only QR Code component


// Sample avatar options
const avatarOptions = [
  { id: 1, src: '/images/avatars/avatar-1.png', alt: 'Male student with glasses' },
  { id: 2, src: '/images/avatars/avatar-2.png', alt: 'Female student with ponytail' },
  { id: 3, src: '/images/avatars/avatar-3.png', alt: 'Male student with beard' },
  { id: 4, src: '/images/avatars/avatar-4.png', alt: 'Female student with short hair' },
];

// Sample department options
const departmentOptions = [
  'Computer Science',
  'Engineering',
  'Business Administration',
  'Medicine',
  'Arts & Humanities',
  'Natural Sciences'
];

// Sample institution themes
const institutionThemes = [
  { name: 'Default', primary: '#1D3557', secondary: '#2A9D8F', accent: '#E76F51' },
  { name: 'Ivy League', primary: '#0F4D92', secondary: '#8B0000', accent: '#FFD700' },
  { name: 'Tech Institute', primary: '#6200EA', secondary: '#03DAC6', accent: '#CF6679' },
  { name: 'Medical School', primary: '#01579B', secondary: '#00897B', accent: '#D81B60' },
];

// ROI Calculator data
const roiCalculatorData = {
  averageCost: {
    physicalCard: 15,
    replacementCard: 25,
    adminHourly: 30
  },
  savings: {
    cardProduction: 95,
    adminTime: 80,
    replacements: 100
  }
};

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [counters, setCounters] = useState({
    institutions: 0,
    students: 0,
    ids: 0,
    satisfaction: 0,
    adminHours: 0,
    costSavings: 0
  });
  
  // State for BookDemo modal
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  
  // Ref for scroll to sections
  const featuresRef = useRef(null);
  const roiCalculatorRef = useRef(null);
  
  // Initialize dark mode from localStorage and listen for theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
      
      // Listen for theme changes from Navbar
      const handleThemeChange = (event) => {
        setDarkMode(event.detail.darkMode);
      };
      
      window.addEventListener('themeChange', handleThemeChange);
      return () => {
        window.removeEventListener('themeChange', handleThemeChange);
      };
    }
  }, []);
  
  // Animate counters
  useEffect(() => {
    const targetValues = {
      institutions: 50,
      students: 10000,
      ids: 8500,
      satisfaction: 99,
      adminHours: 1200,
      costSavings: 45000
    };
    
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCounters({
        institutions: Math.floor(progress * targetValues.institutions),
        students: Math.floor(progress * targetValues.students),
        ids: Math.floor(progress * targetValues.ids),
        satisfaction: Math.floor(progress * targetValues.satisfaction),
        adminHours: Math.floor(progress * targetValues.adminHours),
        costSavings: Math.floor(progress * targetValues.costSavings)
      });
      
      if (frame === totalFrames) {
        clearInterval(timer);
        setCounters(targetValues);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, []);

  // Scroll to section function
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
      {/* Navbar Component */}
      <Navbar />
      
      {/* Fixed Book Demo Button - Enhanced with gradient and animation */}
      <div className="fixed right-6 top-24 z-40 ">
        <motion.button
          onClick={() => setIsBookDemoOpen(true)}
          className={`flex items-center px-5 py-3  font-medium rounded-lg shadow-lg bg-transparent  ${darkMode ?  'text-white' :  'text-black'} hover:bg-[#2A9D8F] hover:text-white`}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Calendar className="mr-2" size={18} />
          Book Demo Session
        </motion.button>
      </div>
      
      <main className="flex-grow overflow-x-hidden">
        {/* Hero Section with Animated Particle Background - Enhanced with stronger CTA */}
        <section className="relative">
          <ParallaxHero darkMode={darkMode} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6  mt-28"
          >
            Welcome to <span className="text-[#2A9D8F]">Instipass</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl mb-8 text-gray-200"
          >
            A digital student ID system designed to streamline your academic and administrative processes. 
            Access your student ID anytime, anywhere with just a few taps.
          </motion.p>
          
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Digital ID Management for Modern Institutions
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Streamline operations, enhance security, and reduce costs with our comprehensive digital ID solution
              </motion.p>
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
                  Explore Features <ChevronRight className="inline ml-1" size={20} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Trust Indicators - NEW SECTION */}
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
        
        
        {/* Institution Benefits Section - ENHANCED */}
        <section ref={featuresRef} id="institution-benefits" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
                Core Features
              </span>
              <h2 className="text-4xl font-bold mb-6">Benefits for Your Institution</h2>
              <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                InstiPass offers a suite of features designed to simplify ID management and enhance campus life.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Smartphone size={36} className="text-[#2A9D8F]" />,
                  title: "Mobile-First Digital IDs",
                  description: "Issue secure, verifiable digital student IDs directly to student smartphones. Reduce physical card costs and administrative overhead.",
                  features: ["Instant Issuance", "Offline Access", "Secure QR Codes"]
                },
                {
                  icon: <LayoutDashboard size={36} className="text-[#2A9D8F]" />,
                  title: "Centralized Admin Dashboard",
                  description: "Manage all student IDs, track usage, and generate reports from a single, intuitive dashboard. Full control at your fingertips.",
                  features: ["Real-time Analytics", "Bulk Management", "Audit Logs"]
                },
                {
                  icon: <Shield size={36} className="text-[#2A9D8F]" />,
                  title: "Enhanced Security & Compliance",
                  description: "Leverage modern encryption and verification protocols to ensure the highest level of security and meet all regulatory requirements.",
                  features: ["Two-Factor Authentication", "GDPR Compliant", "Tamper-Proof Design"]
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'} border border-gray-200 dark:border-gray-700`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="text-[#2A9D8F] mr-2 flex-shrink-0" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        
        <AnimatedHowItWorks darkMode={darkMode}/>
        
       
        
        {/* Statistics Section - ENHANCED */}
        <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span  className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4" >
                Real Results
              </span>
              <h2 className="text-4xl font-bold mb-6">InstiPass Impact</h2>
              <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Join the growing network of institutions transforming their ID management with InstiPass.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                {
                  icon: <University size={36} className={`${darkMode?"text-[#2A9D8F]":"text-[#1D3557]"}`} />,
                  value: counters.institutions,
                  label: "Partner Institutions"
                },
                {
                  icon: <Users size={36} className={`${darkMode?"text-[#2A9D8F]":"text-[#1D3557]"}`} />,
                  value: counters.students,
                  label: "Active Students"
                },
                {
                  icon: <CreditCard size={36} className={`${darkMode?"text-[#2A9D8F]":"text-[#1D3557]"}`} />,
                  value: counters.ids,
                  label: "IDs Issued"
                },
                {
                  icon: <Clock size={36} className={`${darkMode?"text-[#2A9D8F]":"text-[#1D3557]"}`} />,
                  value: counters.adminHours,
                  label: "Admin Hours Saved"
                },
                {
                  icon: <DollarSign size={36} className={`${darkMode?"text-[#2A9D8F]":"text-[#1D3557]"}`} />,
                  value: counters.costSavings,
                  label: "Cost Savings ($)"
                },
                {
                  icon: <CheckCircle size={36} className={`${darkMode?"text-[#2A9D8F]":"text-[#1D3557]"}`} />,
                  value: counters.satisfaction,
                  label: "Satisfaction Rate (%)"
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`p-6 rounded-xl mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value.toLocaleString()}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Client Logos Section - ENHANCED */}
        <Suspense fallback={
          <div className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Trusted By Leading Institutions</h2>
                <SkeletonLoader type="text" darkMode={darkMode} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                ))}
              </div>
            </div>
          </div>
        }>
          <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
                  Our Partners
                </span>
                <h2 className="text-3xl font-bold mb-4">Trusted By Leading Institutions</h2>
                <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join these prestigious institutions that have already transformed their ID management systems.
                </p>
              </motion.div>
              <ClientLogos darkMode={darkMode} />
            </div>
          </section>
        </Suspense>
        
        {/* Testimonials Section - ENHANCED */}
        <section id="testimonials" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
                Success Stories
              </span>
              <h2 className="text-4xl font-bold mb-6">What Administrators Say</h2>
              <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Hear from institution administrators who have transformed their ID management with InstiPass.
              </p>
            </motion.div>
            
            <Suspense fallback={
              <div className="max-w-4xl mx-auto">
                <div className={`h-64 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl animate-pulse`}></div>
              </div>
            }>
              <div className="relative">
                <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] rounded-xl opacity-10 blur-xl"></div>
                <div className="relative z-10">
                  <TestimonialCarousel darkMode={darkMode} />
                </div>
              </div>
            </Suspense>
          </div>
        </section>
        
        {/* FAQ Section - ENHANCED */}
        <Suspense fallback={
          <div className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <SkeletonLoader type="text" darkMode={darkMode} />
              </div>
              <div className="max-w-3xl mx-auto">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="mb-4">
                    <div className={`h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2 animate-pulse`}></div>
                    <div className={`h-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }>
          <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
                  Common Questions
                </span>
                <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
                <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Find answers to the most common questions about InstiPass implementation and benefits.
                </p>
              </motion.div>
              <FAQSection darkMode={darkMode} />
            </div>
          </section>
        </Suspense>
        
        {/* CTA Section - ENHANCED */}
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
                  <Link href="/about#contact" passHref>
                    <motion.button
                      className={`px-8 py-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} text-lg font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg`}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mail className="inline-block mr-2" size={20} />
                      Contact Sales
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Newsletter Section - ENHANCED */}
        <Suspense fallback={
          <div className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <SkeletonLoader type="text" darkMode={darkMode} />
              </div>
              <div className="max-w-md mx-auto">
                <div className={`h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4 animate-pulse`}></div>
                <div className={`h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              </div>
            </div>
          </div>
        }>
          <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
                  Stay Connected
                </span>
                <h2 className="text-3xl font-bold mb-4">Get Industry Updates</h2>
                <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Subscribe to our newsletter for the latest news, updates, and insights on digital ID management.
                </p>
              </motion.div>
              <ChatbotInterface darkMode={darkMode} />
            </div>
          </section>
        </Suspense>
      </main>
      
      {/* Footer Component */}
      <Footer darkMode={darkMode} />
      
      {/* Book Demo Modal */}
      <AnimatePresence>
        {isBookDemoOpen && (
          <BookDemoModal 
            darkMode={darkMode} 
            onClose={() => setIsBookDemoOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Chatbot Interface - Integrated Here */}
  
    </div>
  );
};

// export const metadata = {
//   title: 'About Us',
//   description: 'Learn more about our mission and team.',
// };


export default HomePage;
