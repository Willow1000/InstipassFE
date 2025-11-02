"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

const SessionVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [darkMode, setDarkMode] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [errorIcon, setErrorIcon] = useState(<AlertCircle />);

  // Error message mapping
  const errorMessages = {
    missing_token: 'Invalid verification link. Missing token.',
    token_expired: 'This login link has expired. Please request a new one.',
    token_used: 'This login link has already been used. Please request a new one.',
    token_invalid: 'Invalid verification link. Please request a new one.',
    network_error: 'Network error. Please check your internet connection.',
    server_error: 'Server error. Please try again later.',
    timeout_error: 'Request timed out. Please check your connection and try again.',
  };

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

  // Verify session token
  const verifySessionToken = async (token) => {
    try {
      // Set up timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`http://127.0.0.1:8000/institution/api/auth/verify/session/?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
        signal: controller.signal
      }).finally(() => {
        clearTimeout(timeoutId);
      });

      if (!response.ok) {
        // Handle specific error status codes
        if (response.status === 404) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.detail?.includes('expired')) {
            throw new Error('token_expired');
          } else if (errorData.detail?.includes('Missing token')) {
            throw new Error('missing_token');
          } else {
            throw new Error('token_invalid');
          }
        } else if (response.status >= 500) {
          throw new Error('server_error');
        } else {
          throw new Error('token_invalid');
        }
      }

      const data = await response.json();
      
      // Success - user is authenticated
      setVerificationStatus('success');
      
      // Store access token if needed
      if (data.access) {
        localStorage.setItem('access_token', data.access);
      }
      
      // Redirect to institution dashboard after success
      setTimeout(() => {
        router.push('/institution');
      }, 2000);

    } catch (error) {
      console.error('Session verification error:', error);
      
      let errorKey = 'token_invalid';
      
      if (error.name === 'AbortError') {
        errorKey = 'timeout_error';
        setErrorIcon(<Clock />);
      } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        errorKey = 'network_error';
        setErrorIcon(<AlertCircle />);
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorKey = 'network_error';
        setErrorIcon(<AlertCircle />);
      } else if (error.message in errorMessages) {
        errorKey = error.message;
        setErrorIcon(<XCircle />);
      } else {
        errorKey = 'token_invalid';
        setErrorIcon(<XCircle />);
      }
      
      setErrorMessage(errorMessages[errorKey]);
      setVerificationStatus('error');
      
      // Start countdown for redirect
      startCountdown();
    }
  };

  // Start countdown for redirect
  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/institution/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Extract token and verify on component mount
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setErrorMessage(errorMessages.missing_token);
      setVerificationStatus('error');
      setErrorIcon(<XCircle />);
      startCountdown();
      return;
    }

    verifySessionToken(token);
  }, [searchParams]);

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-md mx-4 text-center`}
      >
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Verifying Your Session
          </h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
        </div>

        <AnimatePresence mode="wait">
          {verificationStatus === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="flex justify-center mb-4">
                <Loader className="w-12 h-12 text-[#2A9D8F] animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verifying your login link...</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please wait while we verify your session.
              </p>
            </motion.div>
          )}

          {verificationStatus === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Login Successful!</h3>
              <p className="text-green-700 mb-4">
                Your session has been verified successfully.
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Redirecting to institution dashboard...
              </p>
              <div className="mt-4">
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <Loader className="w-3 h-3 mr-2 animate-spin" />
                  Redirecting in {countdown}s
                </div>
              </div>
            </motion.div>
          )}

          {verificationStatus === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  {errorIcon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Verification Failed</h3>
              <p className="text-red-700 mb-4">
                {errorMessage}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Redirecting to login page in {countdown} seconds...
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push('/institution/login')}
                  className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Go to Login Now
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SessionVerification;