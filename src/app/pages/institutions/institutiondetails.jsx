"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TokenProtectedPage from '../../components/TokenProtected'

const InstitutionDetailsForm = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    county: '',
    address: '',
    email: '',
    institution_type: '',
    web_url: '',
    admin_email: '',
    admin_tell: '',
    tel: '',
    logo: null,
    fingerprint: null // Added fingerprint field
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const fingerprintScriptLoaded = useRef(false); // Track if fingerprint script is loaded

  // Region and County choices from the model
  const REGION_CHOICES = [
    "Central", "Coast", "Eastern", "Nairobi", 
    "North Eastern", "Nyanza", "Rift Valley", "Western"
  ];

  const COUNTY_CHOICES = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
    "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
    "Samburu", "Trans Nzoia", "Uasin Gishu (Eldoret)", "Elgeyo Marakwet",
    "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
    "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia",
    "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
  ];

  // Institution Types from the model
  const INSTITUTION_TYPES = [
    { value: "University", label: "University" },
    { value: "College", label: "College" },
    { value: "Polytechnic", label: "Polytechnic" },
    { value: "Institute", label: "Institute" }
  ];

  // Error message mapping
  const errorMessages = {
    required: 'This field is required',
    invalid_email: 'Please enter a valid email address',
    invalid_phone: 'Please enter a valid phone number',
    invalid_url: 'Please enter a valid website URL',
    invalid_logo: 'Please select a valid image file (JPEG, PNG, GIF, SVG)',
    file_too_large: 'Image size should be less than 2MB',
    network_error: 'Network connection issue. Please check your internet and try again.',
    server_error: 'Server error occurred. Please try again later.',
    auth_error: 'Your session has expired. Please log in again.',
    permission_error: 'You are already registered. If not, kindly contact support.',
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

  // Reset status message after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setFormErrors({
        ...formErrors,
        logo: errorMessages.invalid_logo
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        logo: errorMessages.file_too_large
      });
      return;
    }

    // Clear any previous errors
    if (formErrors.logo) {
      setFormErrors({
        ...formErrors,
        logo: ''
      });
    }

    // Update form data and preview
    setFormData({
      ...formData,
      logo: file
    });

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData({
      ...formData,
      logo: null
    });
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = errorMessages.required;
    }
    
    if (!formData.region) {
      errors.region = errorMessages.required;
    }
    
    if (!formData.county) {
      errors.county = errorMessages.required;
    }
    
    if (!formData.address.trim()) {
      errors.address = errorMessages.required;
    }
    
    if (!formData.email.trim()) {
      errors.email = errorMessages.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = errorMessages.invalid_email;
    }
    
    if (!formData.institution_type) {
      errors.institution_type = errorMessages.required;
    }
    
    // web_url is optional, but validate format if provided
    if (formData.web_url && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.web_url)) {
      errors.web_url = errorMessages.invalid_url;
    }
    
    if (!formData.admin_email.trim()) {
      errors.admin_email = errorMessages.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.admin_email)) {
      errors.admin_email = errorMessages.invalid_email;
    }
    
    if (!formData.admin_tell.trim()) {
      errors.admin_tell = errorMessages.required;
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.admin_tell)) {
      errors.admin_tell = errorMessages.invalid_phone;
    }
    
    if (!formData.tel.trim()) {
      errors.tel = errorMessages.required;
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.tel)) {
      errors.tel = errorMessages.invalid_phone;
    }
    
    if (!formData.logo) {
      errors.logo = errorMessages.required;
    }
    
    return errors;
  };

  // Function to submit form data
  const submitFormData = async () => {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Create FormData object for multipart/form-data (required for file upload)
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'logo') {
          if (formData.logo) {
            formDataToSend.append('logo', formData.logo);
          }
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Prepare headers with authentication (but no Content-Type for multipart/form-data)
      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };
      
      // Make API request
      const response = await fetch('http://127.0.0.1:8000/institution/api/institution/', {
        method: 'POST',
        headers: headers,
        body: formDataToSend,
        credentials: 'include' // Include cookies if needed
      });
      
      // Handle response based on status code
      if (response.ok) {
        const data = await response.json();
        setSubmitStatus('success');
        window.location.href = "/institution";
      } else {
        // Handle different error status codes
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 400) {
          // Bad request - validation errors
          const errorMessages = [];
          for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
              errorMessages.push(`${key}: ${errorData[key].join(', ')}`);
            } else if (typeof errorData[key] === 'string') {
              errorMessages.push(`${key}: ${errorData[key]}`);
            }
          }
          throw new Error(errorMessages.join('\n') || 'Invalid form data. Please check your inputs.');
        } else if (response.status === 401) {
          // Unauthorized - token expired or invalid
          localStorage.removeItem('access_token'); // Clear invalid token
          throw new Error(errorMessages.auth_error);
        } else if (response.status === 403) {
          // Forbidden - not enough permissions
          throw new Error(errorMessages.permission_error.toUpperCase());
        } else if (response.status === 500) {
          // Server error
          throw new Error(errorMessages.server_error);
        } else {
          // Other errors
          throw new Error(`Error: ${response.status} - ${errorData.detail || 'Something went wrong'}`);
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage('');
      
      try {
        // Submit form directly without CAPTCHA verification
        await submitFormData();
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmitStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  // Status alert component
  const StatusAlert = () => {
    if (!submitStatus) return null;
    
    if (submitStatus === 'success') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Institution details submitted successfully!</span>
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-medium">Submission failed!</span>
              <p className="mt-1 text-sm whitespace-pre-line">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <TokenProtectedPage>
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 my-8`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>Institution Details</h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Please provide your institution information</p>
        </div>
        
        {/* Status Alert */}
        <StatusAlert />
        
        <form onSubmit={handleSubmit} className="space-y-6" id="institution-form">
          {/* Hidden fingerprint field */}
          <input type="hidden" name="fingerprint" id="fp-field" value={formData.fingerprint || ''} />
          
          {/* Institution Name */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Institution Name</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter institution name"
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>
          
          {/* Institution Type */}
          <div>
            <label htmlFor="institution_type" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Institution Type</label>
            <select 
              id="institution_type"
              name="institution_type"
              value={formData.institution_type}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting}
            >
              <option value="">Select Institution Type</option>
              {INSTITUTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {formErrors.institution_type && (
              <p className="mt-1 text-sm text-red-500">{formErrors.institution_type}</p>
            )}
          </div>
          
          {/* Region and County - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="region" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Region</label>
              <select 
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                disabled={isSubmitting}
              >
                <option value="">Select Region</option>
                {REGION_CHOICES.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {formErrors.region && (
                <p className="mt-1 text-sm text-red-500">{formErrors.region}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="county" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>County</label>
              <select 
                id="county"
                name="county"
                value={formData.county}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                disabled={isSubmitting}
              >
                <option value="">Select County</option>
                {COUNTY_CHOICES.map((county) => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
              {formErrors.county && (
                <p className="mt-1 text-sm text-red-500">{formErrors.county}</p>
              )}
            </div>
          </div>
          
          {/* Address */}
          <div>
            <label htmlFor="address" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Address</label>
            <input 
              type="text" 
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Physical address"
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting}
            />
            {formErrors.address && (
              <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
            )}
          </div>
          
          {/* Email and Website - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="institution@example.com"
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
            )}
            </div>
            
            <div>
              <label htmlFor="web_url" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Website URL (Optional)</label>
              <input 
                type="url" 
                id="web_url"
                name="web_url"
                value={formData.web_url}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                disabled={isSubmitting}
              />
              {formErrors.web_url && (
                <p className="mt-1 text-sm text-red-500">{formErrors.web_url}</p>
              )}
            </div>
          </div>
          
          {/* Admin Email */}
          <div>
            <label htmlFor="admin_email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Admin Email</label>
            <input 
              type="email" 
              id="admin_email"
              name="admin_email"
              value={formData.admin_email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting}
            />
            {formErrors.admin_email && (
              <p className="mt-1 text-sm text-red-500">{formErrors.admin_email}</p>
            )}
          </div>
          
          {/* Admin Tel and Institution Tel - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin_tell" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Admin Telephone</label>
              <input 
                type="tel" 
                id="admin_tell"
                name="admin_tell"
                value={formData.admin_tell}
                onChange={handleInputChange}
                placeholder="+254 700 000000"
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                disabled={isSubmitting}
              />
              {formErrors.admin_tell && (
                <p className="mt-1 text-sm text-red-500">{formErrors.admin_tell}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="tel" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Institution Telephone</label>
              <input 
                type="tel" 
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                placeholder="+254 700 000000"
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                disabled={isSubmitting}
              />
              {formErrors.tel && (
                <p className="mt-1 text-sm text-red-500">{formErrors.tel}</p>
              )}
            </div>
          </div>
          
          {/* Logo Upload */}
          <div>
            <label htmlFor="logo" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Institution Logo</label>
            <div className="mt-1 flex items-center">
              <div className={`flex-shrink-0 h-24 w-24 rounded-md overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mr-4`}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain" />
                ) : (
                  <svg className={`h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="flex space-x-2">
                  <label
                    htmlFor="logo"
                    className={`cursor-pointer py-2 px-3 rounded-md text-sm font-medium ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                  </label>
                  {formData.logo && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className={`py-2 px-3 rounded-md text-sm font-medium ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  PNG, JPG, GIF or SVG (max. 2MB)
                </p>
              </div>
            </div>
            {formErrors.logo && (
              <p className="mt-1 text-sm text-red-500">{formErrors.logo}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <motion.button 
            type="submit" 
            className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 transition-colors mt-6 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#2A9D8F] text-white hover:bg-opacity-90'
            }`}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              'Save Institution Details'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
    </TokenProtectedPage>
  );
};

export default InstitutionDetailsForm;