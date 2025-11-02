"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import TokenProtectedPage from '../../components/TokenProtected';
import axios from 'axios';

const InstitutionRegister = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password1: '',
    fingerprint: null // Added fingerprint field
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const fingerprintScriptLoaded = useRef(false); // Track if fingerprint script is loaded

  // Error message mapping
  const errorMessages = {
    required: 'This field is required',
    invalid_email: 'Please enter a valid email address',
    invalid_password: 'Password must be at least 8 characters',
    password_mismatch: 'Passwords do not match',
    terms_required: 'You must accept the terms and conditions',
    network_error: 'Network error. Please check your connection and try again.',
    server_error: 'Server error occurred. Please try again later.',
    banned_temporary: 'You are temporarily banned. Try again later.',
    banned_permanent: 'Your IP has been permanently banned.',
  };

  // Load FingerprintJS and generate fingerprint
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
          console.error('FingerprintJS error:', error);
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load FingerprintJS');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = errorMessages.required;
    }
    
    if (!formData.email.trim()) {
      errors.email = errorMessages.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = errorMessages.invalid_email;
    }
    
    if (!formData.password) {
      errors.password = errorMessages.required;
    } else if (formData.password.length < 8) {
      errors.password = errorMessages.invalid_password;
    }
    
    if (!formData.password1) {
      errors.password1 = errorMessages.required;
    } else if (formData.password !== formData.password1) {
      errors.password1 = errorMessages.password_mismatch;
    }
    
    if (!termsAccepted) {
      errors.terms = errorMessages.terms_required;
    }
    
    return errors;
  };

  // Function to perform the actual registration
  const performRegistration = async () => {
    try {
      // Create data object for API
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password1: formData.password1,
        fingerprint: formData.fingerprint // Added fingerprint to dataToSend
      };
      
      // Send data to API endpoint
      const response = await axios.post(
        'http://127.0.0.1:8000/signup/institution/api/',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true  // 👈 this is what includes cookies/session
        }
      );

      // Handle successful response
      setSubmitStatus({
        type: 'success',
        message: 'Registration successful! Redirecting to login, Check email after logging in'
      });
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        window.location.href = '/institution/login';
      }, 2000);
      
    } catch (error) {
      // Handle error response
      if (error.response && error.response.data) {
        // Extract error messages from API response
        const apiErrors = error.response.data;
        let errorMessage = 'Registration failed. Please try again.';
        
        if (typeof apiErrors === 'object') {
          // Format error messages from API
          const errorMessages = Object.entries(apiErrors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          
          if (errorMessages) {
            errorMessage = errorMessages;
          }
        }
        
        setSubmitStatus({
          type: 'error',
          message: errorMessage
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: errorMessages.network_error
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus({ type: '', message: '' });
      
      try {
        // Submit form directly without CAPTCHA verification
        await performRegistration();
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmitStatus({
          type: 'error',
          message: 'An unexpected error occurred. Please try again.'
        });
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <TokenProtectedPage>
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-md mx-4`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>Create an Account</h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Join our community of institutions</p>
        </div>
        
        {/* Status Messages */}
        {submitStatus.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              {submitStatus.type === 'success' ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <X className="h-5 w-5 mr-2" />
              )}
              <p>{submitStatus.message}</p>
            </div>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Hidden fingerprint field */}
          <input type="hidden" name="fingerprint" id="fp-field" value={formData.fingerprint || ''} />

          {/* Institution Name Field */}
          <div className="mb-4">
            <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Institution Name</label>
            <input 
              type="text" 
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              placeholder="Enter your institution name"
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              placeholder="institution@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2A9D8F]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
            )}
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Password must be at least 8 characters
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password1" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                id="password1"
                name="password1"
                value={formData.password1}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2A9D8F]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password1 && (
              <p className="mt-1 text-sm text-red-500">{formErrors.password1}</p>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className={`h-4 w-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded focus:ring-[#2A9D8F] text-[#2A9D8F]`}
              />
              <label htmlFor="terms" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                I agree to the <a href="/instipass/privacy_policy" className="text-[#2A9D8F] hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/instipass/terms_and_conditions" className="text-[#2A9D8F] hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              </label>
            </div>
            {formErrors.terms && (
              <p className="mt-1 text-sm text-red-500">{formErrors.terms}</p>
            )}
          </div>
          
          <motion.button 
            type="submit" 
            className={`w-full py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>
        
        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account? <Link href="/institution/login" className="text-[#2A9D8F] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
    </TokenProtectedPage>
  );
};

export default InstitutionRegister;