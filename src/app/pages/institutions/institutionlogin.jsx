"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, WifiOff, Server, Clock, CheckCircle } from 'lucide-react';

const InstitutionLogin = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [errorIcon, setErrorIcon] = useState(<AlertCircle />);
  const [successMessage, setSuccessMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);
  const fingerprintScriptLoaded = useRef(false);

  // Error message mapping
  const errorMessages = {
    required: 'Email is required',
    invalid_email: 'Email is invalid',
    network_error: 'Network error. Please check your internet connection.',
    server_error: 'Server error. Please try again later or contact support.',
    csrf_error: 'Security issue. Please refresh the page and try again.',
    forbidden_error: 'Access forbidden. Please try again.',
    invalid_request: 'Invalid request. Please check your email address.',
    not_found: 'No account found with this email address.',
    rate_limit: 'Too many requests. Please try again later.',
    timeout_error: 'Request timed out. Please check your connection and try again.',
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
          
          // Set fingerprint state
          setFingerprint(result.visitorId);
          
        } catch (error) {
          console.error('FingerprintJS error:', error);
          // Continue without fingerprint if there's an error
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load FingerprintJS');
        // Continue without fingerprint if script fails to load
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

  // Initialize dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
      
      const handleThemeChange = (event) => {
        setDarkMode(event.detail.darkMode);
      };
      
      window.addEventListener('themeChange', handleThemeChange);
      
      return () => {
        window.removeEventListener('themeChange', handleThemeChange);
      };
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = errorMessages.required;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = errorMessages.invalid_email;
    }
    
    return errors;
  };

  // Function to request login link
  const requestLoginLink = async () => {
    try {
      // Set up timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Prepare request data with fingerprint
      const requestData = {
        email: email.trim(),
        fingerprint: fingerprint // Include fingerprint in the request
      };
      
      // Make API call to request login link endpoint
      const response = await fetch("http://127.0.0.1:8000/institution/api/auth/request/link", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
        // credentials: 'include',
        signal: controller.signal
      }).finally(() => {
        clearTimeout(timeoutId);
      });
      
      // Parse the response to get success or error message
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Parse error:', parseError);
        setErrorIcon(<Server />);
        throw new Error(errorMessages.server_error);
      }
      
      if (response.ok) {
        // Success case - hide form and show success message
        setSuccessMessage('Login link sent! Please check your email for the login link.');
        setIsSuccess(true);
      } else {
        // Handle specific API error responses
        if (response.status === 403) {
          if (data.detail && data.detail.includes('CSRF')) {
            setErrorIcon(<AlertCircle />);
            throw new Error(errorMessages.csrf_error);
          } else {
            setErrorIcon(<AlertCircle />);
            throw new Error(errorMessages.forbidden_error);
          }
        } else if (response.status === 400) {
          if (data.email) {
            setErrorIcon(<AlertCircle />);
            throw new Error(data.email[0]);
          } else if (data.detail) {
            setErrorIcon(<AlertCircle />);
            throw new Error(data.detail);
          } else {
            setErrorIcon(<AlertCircle />);
            throw new Error(errorMessages.invalid_request);
          }
        } else if (response.status === 404) {
          setErrorIcon(<AlertCircle />);
          throw new Error(errorMessages.not_found);
        } else if (response.status === 429) {
          setErrorIcon(<Clock />);
          throw new Error(errorMessages.rate_limit);
        } else if (response.status >= 500) {
          setErrorIcon(<Server />);
          throw new Error(errorMessages.server_error);
        } else if (data.detail) {
          setErrorIcon(<AlertCircle />);
          throw new Error(data.detail);
        } else if (data.error) {
          setErrorIcon(<AlertCircle />);
          throw new Error(data.error);
        } else {
          setErrorIcon(<AlertCircle />);
          throw new Error('Failed to send login link. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login link request error:', error);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        setErrorIcon(<Clock />);
        setAuthError(errorMessages.timeout_error);
      } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        setErrorIcon(<WifiOff />);
        setAuthError(errorMessages.network_error);
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setErrorIcon(<WifiOff />);
        setAuthError('Unable to connect to the server. Please check if the server is running.');
      } else {
        setAuthError(error.message || 'Failed to send login link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setAuthError('');
      setSuccessMessage('');
      setErrorIcon(<AlertCircle />);
      
      try {
        // Wait for fingerprint to be generated if it's not ready yet
        if (!fingerprint) {
          console.log('Waiting for fingerprint generation...');
          // You could add a small delay here if needed, but the fingerprint
          // should be generated quickly after component mount
        }
        
        // Directly request login link without captcha
        await requestLoginLink();
      } catch (error) {
        console.error('Form submission error:', error);
        setAuthError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  // Function to retry connection if server is down
  const retryConnection = () => {
    setAuthError('');
    setIsLoading(true);
    
    fetch("http://127.0.0.1:8000/", { 
      method: 'HEAD',
      cache: 'no-store',
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        setAuthError('Server is now available. Please try again.');
        setErrorIcon(<AlertCircle />);
      } else {
        setAuthError('Server is still unavailable. Please try again later.');
        setErrorIcon(<Server />);
      }
    })
    .catch(error => {
      setAuthError('Server is still unavailable. Please try again later.');
      setErrorIcon(<WifiOff />);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-md mx-4`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>
            {isSuccess ? 'Check Your Email' : 'Get Login Link'}
          </h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.p
                key="success-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                We've sent a secure login link to your email
              </motion.p>
            ) : (
              <motion.p
                key="form-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Enter your email to receive a secure login link
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            // Success State - Only show success message
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-2">Login Link Sent!</h3>
                <p className="text-green-700">
                  We've sent a secure login link to <strong>{email}</strong>. Please check your email and click the link to sign in.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 mt-6"
              >
                <p>Didn't receive the email? Check your spam folder or </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setAuthError('');
                    setSuccessMessage('');
                  }}
                  className="text-[#2A9D8F] hover:underline font-medium mt-2"
                >
                  try again with a different email
                </button>
              </motion.div>
            </motion.div>
          ) : (
            // Form State - Show the email form
            <motion.form
              key="form-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
            >
              {/* Hidden fingerprint field for debugging if needed */}
              <input type="hidden" name="fingerprint" value={fingerprint || ''} />
              
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start"
                >
                  <span className="mr-2 mt-0.5 flex-shrink-0">{errorIcon}</span>
                  <div>
                    <span>{authError}</span>
                    {(authError.includes('Unable to connect') || authError.includes('Server is still unavailable')) && (
                      <button 
                        type="button"
                        onClick={retryConnection}
                        className="block mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Check server status
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
              
              <div className="mb-6">
                <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                    placeholder="Enter your email"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              
              <motion.button 
                type="submit" 
                className="w-full py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2" size={18} />
                    Send Login Link
                  </>
                )}
              </motion.button>
              
              <p className={`text-center text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You'll receive a secure login link in your email inbox.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default InstitutionLogin;