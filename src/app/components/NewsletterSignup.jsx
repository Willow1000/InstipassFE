import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Bell, AlertCircle } from 'lucide-react';

const NewsletterSignup = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Added states for form submission status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null
  const [submissionMessage, setSubmissionMessage] = useState('');
  
  // Function to send newsletter signup to the API endpoint
  const sendNewsletterSignupToAPI = async (emailData) => {
    
    try {
      const response = await fetch("http://127.0.0.1:8000/institution/api/newsletter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailData,
        }),
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
         if (data.email) {
            // Handle specific field errors from Django
            throw new Error("You already subscribed to our newsletter");
          } else {
            throw new Error('Invalid email address. Please check your input and try again.');
          }
        } else if (response.status === 404) {
          throw new Error('Newsletter service not found. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later or contact support.');
        } else {
          throw new Error('An error occurred while subscribing. Please try again.');
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return; // Don't submit if email is empty
    }
    
    // Reset submission states
    setIsSubmitting(true);
    setSubmissionStatus(null);
    setSubmissionMessage('');
    
    try {
      
      // Send the newsletter signup to the API
      const result = await sendNewsletterSignupToAPI(email);
      
      
      // Handle successful submission
      setSubmissionStatus('success');
      setSubmissionMessage(result.message || 'You have been successfully subscribed to our newsletter!');
      setIsSubmitted(true);
      
      // Close the modal after 3 seconds on success
      setTimeout(() => {
        setIsOpen(false);
        
        // Reset states after modal is closed
        setTimeout(() => {
          setEmail('');
          setIsSubmitted(false);
          setSubmissionStatus(null);
          setSubmissionMessage('');
        }, 300); // Wait for exit animation to complete
      }, 3000);
      
    } catch (error) {
      // Handle submission error
      
      setSubmissionStatus('error');
      setSubmissionMessage(error.message || 'An error occurred while subscribing. Please try again.');
      
      // Don't set isSubmitted to true on error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      {/* Floating action button */}
      <motion.button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${darkMode ? 'bg-[#2A9D8F]' : 'bg-[#1D3557]'} text-white shadow-lg flex items-center justify-center z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        aria-label="Subscribe to newsletter"
      >
        <Mail size={24} />
      </motion.button>
      
      {/* Newsletter modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-md p-8 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
                aria-label="Close newsletter signup"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-[#2A9D8F]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Subscribe to our newsletter for the latest updates, features, and tips.
                </p>
              </div>
              
              {/* Display submission status messages */}
              <AnimatePresence>
                {submissionStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 rounded flex items-start bg-red-100 border border-red-400 text-red-700"
                  >
                    <span className="mr-2 mt-0.5 flex-shrink-0">
                      <AlertCircle size={18} />
                    </span>
                    <span>{submissionMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium mb-2">Thank You!</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {submissionMessage || "You've been successfully subscribed to our newsletter."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} >
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      onChange={(e) => {setEmail(e.target.value)
                       
                      }}
                      type="email"
                      id="email"
                      name="email" // Added name attribute to match Django model field
                      value={email}
                      required
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2A9D8F]' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-[#1D3557]'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2A9D8F] ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`w-full py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </div>
                    ) : (
                      'Subscribe'
                    )}
                  </motion.button>
                  
                  <p className="text-xs text-center mt-4 text-gray-500">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterSignup;
