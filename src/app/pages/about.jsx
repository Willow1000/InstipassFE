"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, Users, Eye, Mail, MessageSquare, Check, Shield, Clock, Zap, Award, Star, BarChart, Building, Phone, Calendar, AlertCircle } from 'lucide-react';
import Navbar from '../components/aboutNavbar';
import Footer from '../components/aboutFooter';
import dynamic from 'next/dynamic';
import ParallaxHero from '../components/ParallaxHero';
// import TestimonialCarousel from '../components/TestimonialCarousel1';

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

const AboutPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formRejected, setFormRejected] = useState(false)
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
      fingerprint: null // Added fingerprint field
    });
  const [formErrors, setFormErrors] = useState({});
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const contactRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Added states for form submission status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null
  const [submissionMessage, setSubmissionMessage] = useState('');
  
  // Particle animation
  const particlesRef = useRef(null);
  const fingerprintScriptLoaded = useRef(false); // Track if fingerprint script is loaded
  
  useEffect(() => {
      const loadFingerprintJS = () => {
        if (fingerprintScriptLoaded.current) return;
        
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js';
        script.async = true;
        
        script.onload = async () => {
          fingerprintScriptLoaded.current = true;
          try {
            // Initialize FingerprintJS
            const FingerprintJS = window.FingerprintJS;
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            
            // Update form data with fingerprint
            setFormData(prevData => ({
              ...prevData,
              fingerprint: result.visitorId
            }));
            
          } catch (error) {
          }
        };
        
        script.onerror = () => {
        };
        
        // Add script to document
        document.head.appendChild(script);
      };
      
      loadFingerprintJS();
      
      // Cleanup function
      return () => {
        if (fingerprintScriptLoaded.current) {
          const script = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"]');
          if (script) {
            document.head.removeChild(script);
          }
        }
      };
    }, []);
  
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
  
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: ''
      });
    }
  };
  
  // Function to send message to the API endpoint
  const sendMessageToAPI = async (messageData) => {
    try {
      // Set up timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch("http://127.0.0.1:8000/institution/api/contactus/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
        credentials: 'include',
        signal: controller.signal
      }).finally(() => {
        clearTimeout(timeoutId);
      });
      
      // Parse the response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      
      // Check if the request was successful
      if (!response.ok) {
        // Handle specific API error responses
        if (response.status === 400) {
          if (data.detail) {
            throw new Error(data.detail);
          } else if (data.error) {
            throw new Error(data.error);
          } else if (data.message) {
            throw new Error(data.message);
          } else {
            throw new Error('Invalid form data. Please check your inputs and try again.');
          }
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('You do not have permission to submit this form.');
        } else if (response.status === 404) {
          throw new Error('Contact service not found. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later or contact support.');
        } else {
          throw new Error('An error occurred while submitting your message. Please try again.');
        }
      }
      
      return data;
    } catch (error) {
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please try again later.');
      } else {
        throw error; // Re-throw the error to be handled by the caller
      }
    }
  };
  
 const validateForm = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    if (Object.keys(errors).length === 0) {
      // Form is valid, proceed with submission
      setIsSubmitting(true);
      setSubmissionStatus(null);
      setSubmissionMessage('');
      
      try {
        // Send the message to the API
        const dataToSend = {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          fingerprint: formData.fingerprint // Added fingerprint to dataToSend
        };
        const result = await sendMessageToAPI(dataToSend);
        
        // Handle successful submission
        setSubmissionStatus('success');
        setSubmissionMessage(result.message || 'Your message has been sent successfully! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          fingerprint: formData.fingerprint // Keep the fingerprint
        });
        
        // Set form as submitted for UI feedback
        setFormSubmitted(true);
        
        // Reset form submission status after 5 seconds
        setTimeout(() => {
          setFormSubmitted(false);
          setSubmissionStatus(null);
          setSubmissionMessage('');
        }, 5000);
      } catch (error) {
        // Handle submission error
     
        setSubmissionStatus('error');
        setSubmissionMessage(error.message || 'An error occurred while submitting your message. Please try again.');
        setFormRejected(true)

      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };
  
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Product features data
  const features = [
    {
      title: "Digital Pass Management",
      description: "Create, distribute, and validate digital passes for students, staff, and visitors with QR code technology that eliminates paper waste and reduces administrative overhead by up to 85%.",
      icon: <Eye size={24} />,
      color: "#2A9D8F",
      image: "/images/digital-pass-demo.png"
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "Track pass usage patterns, peak times, and facility utilization with comprehensive analytics that help institutions optimize resource allocation and improve security protocols.",
      icon: <BarChart size={24} />,
      color: "#1D3557",
      image: "/images/analytics-dashboard.png"
    },
    {
      title: "Automated Approval Workflows",
      description: "Streamline approval processes with customizable workflows that route pass requests to the appropriate authorities based on your institution's hierarchy and security requirements.",
      icon: <Check size={24} />,
      color: "#E76F51",
      image: "/images/approval-workflow.png"
    },
    {
      title: "Secure Verification System",
      description: "Prevent unauthorized access with our military-grade encryption and blockchain verification that makes passes impossible to forge while maintaining GDPR and FERPA compliance.",
      icon: <Shield size={24} />,
      color: "#457B9D",
      image: "/images/secure-verification.png"
    },
    {
      title: "Multi-platform Accessibility",
      description: "Access passes from any device with our responsive web app and native mobile applications for iOS and Android, ensuring seamless experiences for all users regardless of technology.",
      icon: <Zap size={24} />,
      color: "#F4A261",
      image: "/images/multi-platform.png"
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      name: "Dr. Emily Richardson",
      role: "Dean of Student Affairs, Westlake University",
      quote: "InstiPass transformed our campus security protocols. We've reduced unauthorized entries by 94% while making the experience more convenient for our students and faculty.",
      logo: "/images/westlake-logo.png"
    },
    {
      name: "Robert Chen",
      author: "CTO, National Science Institute",
      quote: "The analytics capabilities alone justified our investment. We've optimized staffing at entry points and saved over $120,000 annually in operational costs.",
      logo: "/images/nsi-logo.png"
    },
    {
      name: "Maria Gonzalez",
      role: "Director of Security, Eastwood Medical Center",
      quote: "In healthcare, security is non-negotiable. InstiPass gives us enterprise-grade protection with consumer-grade usability. Our staff and patients love it.",
      logo: "/images/eastwood-logo.png"
    }
  ];
  
  // Team members with expanded information
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "With over 10 years of experience in EdTech and institutional security systems, Alex founded InstiPass after witnessing firsthand the inefficiencies of paper-based pass systems while serving as Director of Operations at Stanford University.",
      expertise: ["Institutional Operations", "EdTech Innovation", "Security Systems"],
      linkedin: "https://linkedin.com/in/alexjohnson"
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      bio: "Sarah brings 8 years of software development expertise, specializing in secure authentication systems. Previously at Microsoft's Identity Protection division, she architected solutions used by over 50 million users globally.",
      expertise: ["Secure Authentication", "Blockchain", "Mobile Development"],
      linkedin: "https://linkedin.com/in/sarahchen"
    },
    {
      name: "Michael Rodriguez",
      role: "UX Designer",
      bio: "Michael is passionate about creating intuitive user experiences that make technology accessible to everyone. His previous work for the NYC Department of Education improved digital accessibility for over 1.1 million students.",
      expertise: ["Accessibility Design", "User Research", "Educational UX"],
      linkedin: "https://linkedin.com/in/michaelrodriguez"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Chief Security Officer",
      bio: "With a Ph.D. in Cybersecurity from MIT and 12 years at the Department of Defense, Dr. Patel ensures InstiPass meets the highest security standards while maintaining seamless user experiences.",
      expertise: ["Cryptography", "Threat Analysis", "Compliance"],
      linkedin: "https://linkedin.com/in/aishapatel"
    }
  ];
  
  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
      {/* Navbar Component */}
      <Navbar />
      
      {/* Fixed Book Demo Button */}
      <div className="fixed right-6 top-24 z-40">
        <motion.button
          onClick={() => setIsBookDemoOpen(true)}
          className={`flex items-center px-4 py-2  font-medium rounded-lg shadow-lg bg-transparent  ${darkMode ?  'text-white' :  'text-black'} hover:bg-[#2A9D8F] hover:text-white`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Calendar className="mr-2" size={18} />
          Book Demo
        </motion.button>
      </div>
      
      <main className="flex-grow overflow-x-hidden">
        {/* Hero Section - Enhanced with more product details */}
        <section className={`relative  ${darkMode ? 'bg-gray-800' : 'bg-[#1D3557] mt-16'} text-white overflow-hidden min-h-full  pb-14`}>
          {/* Animated background particles */}
          <ParallaxHero darkMode={darkMode}/>
          
          <div className="container mx-auto px-6 z-10 my-auto absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col md:flex-row items-center my-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 text-left md:pr-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Revolutionizing Institutional Access Management</h1>
                <p className="text-xl mb-6">
                  InstiPass is the premier digital solution for educational institutions, healthcare facilities, and corporate campuses seeking to modernize their access control systems.
                </p>
                <p className="text-lg mb-8">
                  Our platform replaces outdated paper passes with secure, verifiable digital credentials that reduce administrative costs by up to 85% while enhancing security and improving the user experience.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={scrollToFeatures}
                    className="px-6 py-3 bg-[#2A9D8F] rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="mr-2" size={20} />
                    <span>Explore Features</span>
                  </motion.button>
                </div>
                
                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-800">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="ml-4 text-sm">
                    <span className="font-bold">Trusted by 50+ leading institutions</span><br />
                    <span className="text-gray-300">Join universities, hospitals, and corporations worldwide</span>
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:w-1/2 mt-8 md:mt-0"
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2A9D8F] to-[#E76F51] rounded-lg blur opacity-75"></div>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    <div className="p-1 bg-gray-800">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="aspect-video bg-gray-700 rounded-md flex items-center justify-center">
                        <p className="text-center text-sm text-gray-400">InstiPass Dashboard Preview</p>
                        {/* Replace with actual product screenshot */}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="bg-gray-700 p-2 rounded-md">
                          <div className="h-2 w-3/4 bg-[#2A9D8F] rounded-full mb-2"></div>
                          <div className="h-2 w-1/2 bg-gray-600 rounded-full"></div>
                        </div>
                        <div className="bg-gray-700 p-2 rounded-md">
                          <div className="h-2 w-2/3 bg-[#E76F51] rounded-full mb-2"></div>
                          <div className="h-2 w-3/4 bg-gray-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
       
        </section>
        
        {/* About Section with Mission and Vision */}
        <section id="mission" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  About <span className="text-[#2A9D8F]">InstiPass</span>
                </motion.h2>
                <motion.div 
                  className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-6"
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                />
                <motion.p 
                  className="text-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  Founded in 2020, InstiPass has quickly become the leading provider of digital access management solutions for educational institutions, healthcare facilities, and corporate campuses worldwide.
                </motion.p>
              </div>
              
              <div className="space-y-12">
                <motion.div
                  className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setMissionVisible(!missionVisible)}
                  >
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      {missionVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {missionVisible && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4">
                          Our mission is to transform institutional access management through innovative digital solutions that enhance security, reduce administrative burden, and provide valuable data insights while delivering an exceptional user experience.
                        </p>
                        <p className="mt-2">
                          We are committed to helping institutions transition from outdated paper-based systems to secure, efficient digital credentials that save time, reduce costs, and minimize environmental impact.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <motion.div id="vision"
                  className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setVisionVisible(!visionVisible)}
                  >
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      {visionVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {visionVisible && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mb-4">
                          We envision a future where paper-based access systems are obsolete, replaced by intelligent digital solutions that not only enhance security but provide valuable data insights for institutional optimization.
                        </p>
                        <p>
                          By 2030, we aim to eliminate over 1 billion pieces of paper waste annually by transitioning institutions worldwide to our digital platform.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
            
            <div className="mt-20">
              <motion.h3 
                className="text-2xl md:text-3xl font-bold text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Our Core Values
              </motion.h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Security First", icon: <Shield size={32} />, color: "#1D3557", description: "We prioritize the security of our clients' data and physical spaces above all else, implementing industry-leading encryption and authentication protocols." },
                  { title: "User Experience", icon: <Users size={32} />, color: "#2A9D8F", description: "We believe security shouldn't come at the expense of usability. Our solutions are designed with intuitive interfaces that require minimal training." },
                  { title: "Continuous Innovation", icon: <Award size={32} />, color: "#E76F51", description: "We constantly push the boundaries of what's possible in access management, investing over 30% of our revenue into research and development." }
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: value.color }}>
                      <div className="text-white">
                        {value.icon}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                    <p>{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section ref={featuresRef} className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} id='features'>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Key <span className="text-[#2A9D8F]">Features</span>
              </motion.h2>
              <motion.div 
                className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              />
              <motion.p 
                className="max-w-3xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Our comprehensive platform offers everything institutions need to modernize their access management systems.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex mb-6">
                  {features.map((feature, index) => (
                    <motion.button
                      key={index}
                      className={`flex-1 py-2 px-1 text-xs md:text-sm font-medium transition-all ${activeFeature === index ? 'border-b-2 text-[#2A9D8F] border-[#2A9D8F]' : 'border-b text-gray-500 border-gray-300'}`}
                      onClick={() => setActiveFeature(index)}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {feature.title.split(' ')[0]}
                    </motion.button>
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: features[activeFeature].color }}>
                        <div className="text-white">
                          {features[activeFeature].icon}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                    </div>
                    <p className="mb-6 text-lg">
                      {features[activeFeature].description}
                    </p>
                    <motion.button
                      onClick={() => setIsBookDemoOpen(true)}
                      className="px-6 py-3 bg-[#2A9D8F] text-white rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar className="mr-2" size={20} />
                      <span>Book a Demo</span>
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                
                
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2A9D8F] to-[#E76F51] rounded-lg blur opacity-75"></div>
                <div className={`relative rounded-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <p className="text-center text-sm text-gray-500">Feature Preview Image</p>
            
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        
        
        {/* Team Section */}
        <section id="team" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Meet Our <span className="text-[#2A9D8F]">Team</span>
              </motion.h2>
              <motion.div 
                className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              />
              <motion.p 
                className="max-w-3xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Our diverse team of experts brings decades of combined experience in security, technology, and education.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} shadow-lg`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <div className="h-48 bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-500">Photo</p>
                    {/* Replace with actual team member photo */}
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                    <p className="text-[#2A9D8F] font-medium mb-3">{member.role}</p>
                    <p className="text-sm mb-4 line-clamp-3">{member.bio}</p>
                    <div className="mb-4">
                      <p className="text-xs font-bold uppercase text-gray-500 mb-2">Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-[#2A9D8F] hover:underline"
                    >
                      View LinkedIn Profile
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Achievements Section */}
        <section id="achievements" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Our <span className="text-[#2A9D8F]">Achievements</span>
              </motion.h2>
              <motion.div 
                className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              />
              <motion.p 
                className="max-w-3xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                We're proud of the impact we've made in the institutional access management space.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "50+ Partner Institutions",
                  description: "Trusted by leading universities, hospitals, and corporate campuses worldwide.",
                  icon: <Building size={32} className="text-[#1D3557]" />
                },
                {
                  title: "Industry Recognition",
                  description: "Winner of the 2023 EdTech Breakthrough Award for 'Best Security Solution'.",
                  icon: <Award size={32} className="text-[#2A9D8F]" />
                },
                {
                  title: "Environmental Impact",
                  description: "Eliminated over 2 million pieces of paper waste in 2023 alone.",
                  icon: <Shield size={32} className="text-[#E76F51]" />
                }
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    {achievement.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" ref={contactRef} className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Get in <span className="text-[#2A9D8F]">Touch</span>
              </motion.h2>
              <motion.div 
                className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              />
              <motion.p 
                className="max-w-3xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Have questions about how InstiPass can transform your institution's access management? We'd love to hear from you.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center mr-4">
                      <Building className="text-[#2A9D8F]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Headquarters</h4>
                      <p>123 Tech Avenue, Suite 400<br />San Francisco, CA 94107</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center mr-4">
                      <Mail className="text-[#2A9D8F]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Email</h4>
                      <p>info@instipass.com<br />support@instipass.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center mr-4">
                      <Phone className="text-[#2A9D8F]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Phone</h4>
                      <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center mr-4">
                      <Clock className="text-[#2A9D8F]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Business Hours</h4>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM PST<br />Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-bold mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social, index) => (
                      <a 
                        key={index}
                        href="#" 
                        className="w-10 h-10 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white transition-all"
                      >
                        <span className="text-xs">{social[0]}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
             
                {formRejected ? ( 
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg  bg-red-500 `}
                  >
                    <div className="flex items-center mb-4">
                    
                        <AlertCircle size={24} className="mr-2" />
                      <h4 className="font-bold">{submissionStatus === 'error' ? 'An Error occurred' : 'Error'}</h4>
                    </div>
                    <p>{submissionMessage}</p>
                  </motion.div>
                )
                :(formSubmitted && submissionStatus =='success'? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg bg-green-100 text-green-800 `}
                  >
                    <div className="flex items-center mb-4">
                      {submissionStatus === 'success' ? (
                        <Check size={24} className="mr-2" />
                      ) : (
                        <AlertCircle size={24} className="mr-2" />
                      )}
                      <h4 className="font-bold"> Thank You!</h4>
                    </div>
                    <p>{submissionMessage}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={validateForm} className="space-y-6">
                    <input type="hidden" name="fingerprint" id="fp-field" value={formData.fingerprint || ''} />
                    <div>
                      <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${formErrors.name ? 'border-red-500' : ''}`}
                        placeholder="Your name"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${formErrors.email ? 'border-red-500' : ''}`}
                        placeholder="Your email"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full p-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${formErrors.message ? 'border-red-500' : ''}`}
                        placeholder="Your message"
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.message}</p>
                      )}
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={18} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
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
    </div>
  );
};

export default AboutPage;
