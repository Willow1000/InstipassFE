"use client";

import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldX, Loader2, AlertTriangle } from 'lucide-react';

// Main TokenProtectedPage Component
const TokenProtectedPage = ({ 
  children, 
  apiEndpoint = 'http://127.0.0.1:8000/institution/api/tokenvalidator', 
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
  // Function to get token from various sources
  const getToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
   
    const urlToken = urlParams.get('token');
    
    // Check URL params first
    if (urlToken) return urlToken;

    // Uncomment these if you want to check browser storage
    // Note: These are commented out as per the original code
    // const localToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    // if (localToken) return localToken;

    // const sessionToken = sessionStorage.getItem('authToken') || sessionStorage.getItem('token');
    // if (sessionToken) return sessionToken;

    return null;
  };

  // Function to validate token
  const validateToken = async (token) => {
    try {
      const body = {
        "token": token
      };
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setTokenStatus('valid');
      } else {
        setTokenStatus('invalid');
        setErrorMessage(data.message || 'Invalid or expired token');
      }
    } catch (error) {
      setTokenStatus('error');
      setErrorMessage('Failed to validate token. Please try again.');
    }
  };

  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      setTokenStatus('invalid');
      setErrorMessage('No authentication token found');
      return;
    }

    // Use the token we found (which could be from URL or other sources)
    validateToken(token);
  }, [apiEndpoint]); // Added apiEndpoint as dependency

  // Uncomment this if you want auto-redirect functionality
  useEffect(() => {
    if(tokenStatus === 'invalid' && window.location.pathname.includes("institution/signup")){
      console.log('iko')
      const timeoutId = setTimeout(() => {
        window.location.href = '/tutorials';
      }, 3000);
      return () => clearTimeout(timeoutId);
    }else if(tokenStatus === 'invalid' || tokenStatus==="error" && window.location.pathname.includes("institution/signup")){
      const timeoutId = setTimeout(() => {
        window.location.href = '/institution/login';
      }, 3000);
      return () => clearTimeout(timeoutId); 
    }else if(tokenStatus === 'invalid' || tokenStatus === "error" && window.location.pathname.includes("students")){
      const timeoutId = setTimeout(() => {
        window.location.href = '/students/invalidrequest';
      }, 3000);
      return () => clearTimeout(timeoutId); 
    }
      
    
  }, [tokenStatus, redirectUrl]);

  // Loading state
  if (tokenStatus === 'validating') {
  

    return (
      <div className={`min-h-screen flex items-center justify-center  ${darkMode? 'bg-[#1D3557]': 'bg-white'}`}>
        <div className="text-center">
          <div className="mb-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Validating Access </h2>
          <p className="text-gray-600">Please wait while we verify your authentication... {Number(darkMode)}</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Secure validation in progress</span>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenStatus === 'invalid') {
    return (
      <div className={`min-h-screen  flex items-center justify-center ${darkMode? 'bg-[#1D3557]': 'bg-white'}`}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <div className="space-y-3">
          </div>
            {/* <p className="text-red-600 mb-4">{errorMessage}</p> */}
            
          </div>
          
        </div>
      </div>
    );
  }

  // Error state
  if (tokenStatus === 'error') {
    return (
      <div className={`min-h-screen  flex items-center justify-center ${darkMode? 'bg-[#1D3557]': 'bg-white'}`}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Validation Error</h1>
            <p className="text-yellow-600 mb-4">{errorMessage}</p>
          </div>
          
          <div className="space-y-3">
            {/* <button
              onClick={() => window.location.reload()}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button> */}
            
          </div>
              <div className="space-y-3">
            <button
              onClick={() => window.location.href = redirectUrl}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Try again Later
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
        {/* Optional: Show validation success indicator */}
        <div className="bg-green-100 border-l-4 border-green-500 p-2 mb-4">
          <div className="flex items-center">
            <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-green-700">Access granted - Token validated successfully</span>
          </div>
        </div>
        
        {/* Render the protected content */}
        {children}
      </div>
    );
  }

  return null;
};

// Demo component to show how it works
// const DemoApp = () => {
//   return (
//     <TokenProtectedPage>
//       <div className="p-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">Protected Content</h1>
//         <p className="text-gray-600 mb-4">
//           This content is only visible when you have a valid token!
//         </p>
//         <div className="bg-blue-100 p-4 rounded-lg">
//           <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h2>
//           <p className="text-blue-800">
//             Your token has been validated successfully. You can now access this protected content.
//           </p>
//         </div>
//       </div>
//     </TokenProtectedPage>
//   );
// };

export default TokenProtectedPage;