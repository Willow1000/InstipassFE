"use client";

import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldX, Loader2, AlertTriangle } from 'lucide-react';

// Main AccessTokenProtectedPage Component
const AccessTokenProtectedPage = ({ 
  children, 
  apiEndpoint = 'http://127.0.0.1:8000/institution/api/institution/', 
  redirectUrl = '/institution/login' 
}) => {
  const [tokenStatus, setTokenStatus] = useState('validating'); // 'validating', 'valid', 'invalid', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Function to get access token from local storage
  const getAccessToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  // Function to validate access token
  const validateAccessToken = async (token) => {
    try {
      const body = {
        "access_token": token
      };
      
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Common pattern for access tokens
        },
        
      });

      const data = await response.json();

      if (response.ok) {
        setTokenStatus('valid');
      } else {
        setTokenStatus('invalid');
        setErrorMessage(data.message || 'Invalid or expired access token');
        // Clear invalid token from local storage
        localStorage.removeItem('access_token');
      }
    } catch (error) {
      setTokenStatus('error');
      setErrorMessage('Failed to validate access token. Please try again.');
    
    }
  };

  useEffect(() => {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      setTokenStatus('invalid');
      setErrorMessage('No access token found in local storage');
      return;
    }

    // Validate the access token
    validateAccessToken(accessToken);
  }, [apiEndpoint]);

  // Uncomment this if you want auto-redirect functionality
  useEffect(() => {
    if (tokenStatus === 'invalid') {
      const timeoutId = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [tokenStatus, redirectUrl]);

  // Loading state
  if (tokenStatus === 'validating') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#1D3557]' : 'bg-white'}`}>
        <div className="text-center">
          <div className="mb-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Validating Session
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please wait while we verify your Session...
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Secure validation in progress
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenStatus === 'invalid') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#1D3557]' : 'bg-white'}`}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
           
            <p className="text-gray-600 text-sm">
              Redirecting to login
            </p>
          </div>
          
        </div>
      </div>
    );
  }

  // Error state
  if (tokenStatus === 'error') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#1D3557]' : 'bg-white'}`}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          </div>
          
          <div className="space-y-3">
       
            
            <button
              onClick={() => window.location.href = redirectUrl}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show protected content
  if (tokenStatus === 'valid') {
    return (
      <div>
       
        {children}
      </div>
    );
  }

  return null;
};

// Demo component to show how it works
// const DemoApp = () => {
//   return (
//     <AccessTokenProtectedPage>
//       <div className="p-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">Protected Content</h1>
//         <p className="text-gray-600 mb-4">
//           This content is only visible when you have a valid access token in local storage!
//         </p>
//         <div className="bg-blue-100 p-4 rounded-lg">
//           <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h2>
//           <p className="text-blue-800">
//             Your access token has been validated successfully. You can now access this protected content.
//           </p>
//         </div>
        
//         {/* Button to clear access token for testing */}
//         <div className="mt-6">
//           <button
//             onClick={() => {
//               localStorage.removeItem('access_token');
//               window.location.reload();
//             }}
//             className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
//           >
//             Clear Access Token (for testing)
//           </button>
//         </div>
//       </div>
//     </AccessTokenProtectedPage>
//   );
// };

export default AccessTokenProtectedPage;
// export { DemoApp };

