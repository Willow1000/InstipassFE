"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const UpdateInstitutionSettingsForm = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    qrcode: false,
    barcode: true,
    min_admission_year: new Date().getFullYear(),
    notification_pref: '',
    template: null,
    institution: null // This will be set programmatically, not displayed in UI
  });
  const [templatePreview, setTemplatePreview] = useState(null);
  const [currentTemplateUrl, setCurrentTemplateUrl] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [settingsId, setSettingsId] = useState(null);
  const fileInputRef = useRef(null);
  
  // Current year for validation
  const currentYear = new Date().getFullYear();
  
  // Notification preferences from the model
  const NOTIFICATION_CHOICES = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "both", label: "Both" }
  ];

  // Fetch institution data and settings on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get access token from localStorage
        const accessToken = localStorage.getItem('access_token');
        
        // Fetch institution data
        const institutionResponse = await fetch('http://127.0.0.1:8000/institution/api/institution/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          credentials: 'include'
        });
        
        if (!institutionResponse.ok) {
          throw new Error(`Failed to fetch institution data: ${institutionResponse.status}`);
        }
        
        const institutionData = await institutionResponse.json();
        
        // Check if we have institution data
        if (!Array.isArray(institutionData) || institutionData.length === 0) {
          throw new Error('No institution data found');
        }
        
        const institutionId = institutionData[0].id;
        
        // Set institution ID in form data
        setFormData(prevData => ({
          ...prevData,
          institution: institutionId
        }));
        
        // Fetch settings data for this institution
        const settingsResponse = await fetch(`http://127.0.0.1:8000/institution/api/settings/?institution=${institutionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          credentials: 'include'
        });
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          
          // Check if we have settings data
          if (Array.isArray(settingsData) && settingsData.length > 0) {
            const settings = settingsData[0];
            setSettingsId(settings.id);
            
            // Pre-fill form with existing settings
            setFormData(prevData => ({
              ...prevData,
              qrcode: settings.qrcode || false,
              barcode: settings.barcode || true,
              min_admission_year: settings.min_admission_year || currentYear,
              notification_pref: settings.notification_pref || '',
              institution: institutionId
            }));
            
            // Set template preview if available
            if (settings.template) {
              setCurrentTemplateUrl(settings.template);
            }
          }
        } else if (settingsResponse.status !== 404) {
          // Only throw error if it's not a 404 (settings might not exist yet)
          throw new Error(`Failed to fetch settings data: ${settingsResponse.status}`);
        }
      } catch (error) {
        
        setErrorMessage('Failed to load data. Please try again later.');
        setSubmitStatus('error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentYear]);

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
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Clear error when user changes input
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleTemplateChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setFormErrors({
        ...formErrors,
        template: 'Please select a valid image file (JPEG, PNG, GIF, SVG)'
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        template: 'Image size should be less than 2MB'
      });
      return;
    }

    // Clear any previous errors
    if (formErrors.template) {
      setFormErrors({
        ...formErrors,
        template: ''
      });
    }

    // Update form data and preview
    setFormData({
      ...formData,
      template: file
    });

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setTemplatePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTemplate = () => {
    setFormData({
      ...formData,
      template: null
    });
    setTemplatePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate min_admission_year
    if (!formData.min_admission_year) {
      errors.min_admission_year = 'Minimum admission year is required';
    } else {
      const year = parseInt(formData.min_admission_year);
      if (isNaN(year) || year < 2020 || year > currentYear) {
        errors.min_admission_year = `Year must be between 2020 and ${currentYear}`;
      }
    }
    
    // Validate notification_pref
    if (!formData.notification_pref) {
      errors.notification_pref = 'Notification preference is required';
    }
    
    // Validate institution
    if (!formData.institution) {
      errors.institution = 'Institution data could not be loaded';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage('');
      
      try {
        // Get access token from localStorage
        const accessToken = localStorage.getItem('access_token');
        
        // Create FormData object for multipart/form-data (required for file upload)
        const formDataToSend = new FormData();
        
        // Append all form fields to FormData
        Object.keys(formData).forEach(key => {
          if (key === 'template') {
            if (formData.template) {
              formDataToSend.append('template', formData.template);
            }
          } else if (formData[key] !== null && formData[key] !== undefined) {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        // Prepare headers with authentication (but no Content-Type for multipart/form-data)
        const headers = {
          'Authorization': `Bearer ${accessToken}`
        };
        
        // Determine if this is an update or create operation
        const isUpdate = settingsId !== null;
        const url = isUpdate 
          ? `http://127.0.0.1:8000/institution/api/settings/${settingsId}/` 
          : 'http://127.0.0.1:8000/institution/api/settings/';
        const method = isUpdate ? 'PATCH' : 'POST';
        
        // Make API request
        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: formDataToSend,
          credentials: 'include'
        });
        
        // Handle response based on status code
        if (response.ok) {
          const data = await response.json();
          
          setSubmitStatus('success');
          
          // If this was a create operation, store the new settings ID
          if (!isUpdate && data.id) {
            setSettingsId(data.id);
          }
          
          // If a new template was uploaded, update the preview
          if (formData.template) {
            setCurrentTemplateUrl(data.template);
            setTemplatePreview(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
          
          // Reset template file input but keep other form data
          setFormData(prevData => ({
            ...prevData,
            template: null
          }));
        } else {
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
          } else if (response.status === 403) {
            // Forbidden - not enough permissions
            throw new Error('You do not have permission to perform this action.');
          } else if (response.status === 500) {
            // Server error
            throw new Error('Server error occurred. Please try again later.');
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
            <span className="font-medium">Institution settings updated successfully!</span>
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

  // Loading component
  const LoadingOverlay = () => {
    if (!isLoading) return null;
    
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
        <div className="bg-white p-5 rounded-lg flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-[#2A9D8F] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-700">Loading settings data...</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 my-8 relative`}
      >
        {/* Loading Overlay */}
        <LoadingOverlay />
        
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>Update Institution Settings</h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Modify your institution settings</p>
        </div>
        
        {/* Status Alert */}
        <StatusAlert />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* QR Code and Barcode - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="qrcode"
                name="qrcode"
                checked={formData.qrcode}
                onChange={handleInputChange}
                className={`h-5 w-5 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-[#2A9D8F] text-[#2A9D8F]`}
                disabled={isSubmitting || isLoading}
              />
              <label htmlFor="qrcode" className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Enable QR Code
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="barcode"
                name="barcode"
                checked={formData.barcode}
                onChange={handleInputChange}
                className={`h-5 w-5 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-[#2A9D8F] text-[#2A9D8F]`}
                disabled={isSubmitting || isLoading}
              />
              <label htmlFor="barcode" className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Enable Barcode
              </label>
            </div>
          </div>
          
          {/* Minimum Admission Year */}
          <div>
            <label htmlFor="min_admission_year" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Minimum Admission Year
            </label>
            <input 
              type="number" 
              id="min_admission_year"
              name="min_admission_year"
              value={formData.min_admission_year}
              onChange={handleInputChange}
              min="2020"
              max={currentYear}
              className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting || isLoading}
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Must be between 2020 and {currentYear}
            </p>
            {formErrors.min_admission_year && (
              <p className="mt-1 text-sm text-red-500">{formErrors.min_admission_year}</p>
            )}
          </div>
          
          {/* Notification Preference */}
          <div>
            <label htmlFor="notification_pref" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Notification Preference
            </label>
            <select 
              id="notification_pref"
              name="notification_pref"
              value={formData.notification_pref}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting || isLoading}
            >
              <option value="">Select Notification Preference</option>
              {NOTIFICATION_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
            {formErrors.notification_pref && (
              <p className="mt-1 text-sm text-red-500">{formErrors.notification_pref}</p>
            )}
          </div>
          
          {/* Template Upload */}
          <div>
            <label htmlFor="template" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Institution Template</label>
            <div className="mt-1 flex items-center">
              <div className={`flex-shrink-0 h-24 w-24 rounded-md overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mr-4`}>
                {templatePreview ? (
                  <img src={templatePreview} alt="Template Preview" className="h-full w-full object-contain" />
                ) : currentTemplateUrl ? (
                  <img src={currentTemplateUrl} alt="Current Template" className="h-full w-full object-contain" />
                ) : (
                  <svg className={`h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="file"
                  id="template"
                  name="template"
                  ref={fileInputRef}
                  onChange={handleTemplateChange}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  className="hidden"
                  disabled={isSubmitting || isLoading}
                />
                <div className="flex space-x-2">
                  <label
                    htmlFor="template"
                    className={`cursor-pointer py-2 px-3 rounded-md text-sm font-medium ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmitting || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {templatePreview || currentTemplateUrl ? 'Change Template' : 'Upload Template'}
                  </label>
                  {(templatePreview || currentTemplateUrl) && (
                    <button
                      type="button"
                      onClick={handleRemoveTemplate}
                      className={`py-2 px-3 rounded-md text-sm font-medium ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                      disabled={isSubmitting || isLoading}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  PNG, JPG, GIF or SVG (max. 2MB)
                </p>
                {currentTemplateUrl && !templatePreview && (
                  <p className={`mt-1 text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Current template will be used unless changed
                  </p>
                )}
              </div>
            </div>
            {formErrors.template && (
              <p className="mt-1 text-sm text-red-500">{formErrors.template}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <motion.button 
            type="submit" 
            className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 transition-colors mt-6 ${
              isSubmitting || isLoading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#2A9D8F] text-white hover:bg-opacity-90'
            }`}
            whileHover={{ scale: (isSubmitting || isLoading) ? 1 : 1.02 }}
            whileTap={{ scale: (isSubmitting || isLoading) ? 1 : 0.98 }}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            ) : (
              settingsId ? 'Update Settings' : 'Save Settings'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateInstitutionSettingsForm;
