"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AccessTokenProtectedPage from '@/app/components/AccessTokenProtectedPage';

const InstitutionSettingsForm = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    qrcode: false,
    barcode: true,
    expected_total: null,
    min_admission_year: new Date().getFullYear(),
    notification_pref: '',
    template_front: null,
    template_back: null,
    courses_offered: [],
    conf_data: null,
    institution: null
  });
  const [templateFrontPreview, setTemplateFrontPreview] = useState(null);
  const [templateBackPreview, setTemplateBackPreview] = useState(null);
  const [confDataFileName, setConfDataFileName] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [courseInputMode, setCourseInputMode] = useState('single'); // 'single' or 'bulk'
  const [bulkCoursesText, setBulkCoursesText] = useState('');
  const templateFrontInputRef = useRef(null);
  const templateBackInputRef = useRef(null);
  const confDataInputRef = useRef(null);
  
  // Current year for validation
  const currentYear = new Date().getFullYear();
  
  // Notification preferences from the model
  const NOTIFICATION_CHOICES = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "both", label: "Both" }
  ];

  // Error message mapping
  const errorMessages = {
    required: 'This field is required',
    invalid_year: `Year must be between 2020 and ${currentYear}`,
    invalid_expected_total: 'Expected total number of students is required and must be greater than 0',
    invalid_notification: 'Notification preference is required',
    invalid_file_type: 'Please select a valid file',
    file_too_large: 'File size is too large',
    invalid_json: 'Invalid JSON file. Please check the file format.',
    network_error: 'Network error. Please check your connection and try again.',
    server_error: 'Server error occurred. Please try again later.',
    auth_error: 'Authentication failed. Please log in again.',
    permission_error: 'You do not have permission to perform this action.',
    banned_temporary: 'You are temporarily banned. Try again later.',
    banned_permanent: 'Your IP has been permanently banned.',
  };

  // Function to handle token refresh - placeholder
  const refreshAccessToken = async () => {
    console.log('Token refresh would be called here');
    return false;
  };

  // Initialize dark mode from localStorage and listen for theme changes
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

  const [institutionId, setInstitutionId] = useState();

  // Fetch institution ID on component mount
  useEffect(() => {
    const fetchInstitutionId = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("No access token found in local storage.");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/institution/api/institution/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setInstitutionId(parseInt(data[0].id));
          setFormData(prevData => ({ ...prevData, institution: data[0].id }));
        } else {
          console.warn("No institution data found.");
        }
      } catch (error) {
        console.error("Error fetching institution ID:", error);
      }
    };

    fetchInstitutionId();
  }, []);

  // Reset status message after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleTemplateChange = (e, templateType) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setFormErrors({
        ...formErrors,
        [templateType]: errorMessages.invalid_file_type
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        [templateType]: errorMessages.file_too_large
      });
      return;
    }

    if (formErrors[templateType]) {
      setFormErrors({
        ...formErrors,
        [templateType]: ''
      });
    }

    setFormData({
      ...formData,
      [templateType]: file
    });

    if (templateType === 'template_front' || templateType === 'template_back') {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (templateType === 'template_front') {
          setTemplateFrontPreview(reader.result);
        } else {
          setTemplateBackPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfDataChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allow Excel, CSV, and JSON files
    const validExtensions = ['.xlsx', '.csv', '.json'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setFormErrors({
        ...formErrors,
        conf_data: errorMessages.invalid_file_type
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        conf_data: errorMessages.file_too_large
      });
      return;
    }

    // Validate JSON file structure if it's a JSON file
    if (fileExtension === '.json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          JSON.parse(e.target.result);
          // JSON is valid, clear any previous errors
          if (formErrors.conf_data) {
            setFormErrors({
              ...formErrors,
              conf_data: ''
            });
          }
        } catch (error) {
          setFormErrors({
            ...formErrors,
            conf_data: errorMessages.invalid_json
          });
          return;
        }
      };
      reader.readAsText(file);
    }

    if (formErrors.conf_data) {
      setFormErrors({
        ...formErrors,
        conf_data: ''
      });
    }

    setFormData({
      ...formData,
      conf_data: file
    });
    setConfDataFileName(file.name);
  };

  const handleRemoveTemplate = (templateType) => {
    setFormData({
      ...formData,
      [templateType]: null
    });
    
    if (templateType === 'template_front') {
      setTemplateFrontPreview(null);
      if (templateFrontInputRef.current) {
        templateFrontInputRef.current.value = '';
      }
    } else if (templateType === 'template_back') {
      setTemplateBackPreview(null);
      if (templateBackInputRef.current) {
        templateBackInputRef.current.value = '';
      }
    } else if (templateType === 'conf_data') {
      setConfDataFileName('');
      if (confDataInputRef.current) {
        confDataInputRef.current.value = '';
      }
    }
  };

  // Add single course
  const handleAddCourse = () => {
    if (newCourse.trim() && !formData.courses_offered.includes(newCourse.trim())) {
      setFormData({
        ...formData,
        courses_offered: [...formData.courses_offered, newCourse.trim()]
      });
      setNewCourse('');
    }
  };

  // Add multiple courses from bulk text
  const handleAddBulkCourses = () => {
    if (!bulkCoursesText.trim()) return;

    const courses = bulkCoursesText
      .split('\n')
      .map(course => course.trim())
      .filter(course => course.length > 0 && !formData.courses_offered.includes(course));

    if (courses.length > 0) {
      setFormData({
        ...formData,
        courses_offered: [...formData.courses_offered, ...courses]
      });
      setBulkCoursesText('');
    }
  };

  // Parse courses from various delimiters (comma, newline, semicolon, etc.)
  const parseCoursesFromText = (text) => {
    return text
      .split(/[\n,;]+/) // Split by newline, comma, or semicolon
      .map(course => course.trim())
      .filter(course => course.length > 0);
  };

  // Handle paste event for bulk course input
  const handleBulkCoursePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const courses = parseCoursesFromText(pastedText);
    
    if (courses.length > 1) {
      e.preventDefault();
      const newCourses = courses.filter(course => 
        course.length > 0 && !formData.courses_offered.includes(course)
      );
      
      if (newCourses.length > 0) {
        setFormData({
          ...formData,
          courses_offered: [...formData.courses_offered, ...newCourses]
        });
        setBulkCoursesText('');
      }
    }
  };

  const handleRemoveCourse = (courseToRemove) => {
    setFormData({
      ...formData,
      courses_offered: formData.courses_offered.filter(course => course !== courseToRemove)
    });
  };

  const handleClearAllCourses = () => {
    setFormData({
      ...formData,
      courses_offered: []
    });
  };

  const handleCourseKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCourse();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate min_admission_year
    if (!formData.min_admission_year) {
      errors.min_admission_year = errorMessages.required;
    } else {
      const year = parseInt(formData.min_admission_year);
      if (isNaN(year) || year < 2020 || year > currentYear) {
        errors.min_admission_year = errorMessages.invalid_year;
      }
    }
    
    // Validate expected_total
    if (!formData.expected_total || formData.expected_total <= 0) {
      errors.expected_total = errorMessages.invalid_expected_total;
    }
    
    // Validate notification_pref
    if (!formData.notification_pref) {
      errors.notification_pref = errorMessages.invalid_notification;
    }
    
    return errors;
  };

  // Function to submit form data
  const submitFormData = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error(errorMessages.auth_error);
      }
      
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'template_front' || key === 'template_back' || key === 'conf_data') {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else if (key === 'courses_offered') {
          // Convert array to JSON string for JSONField
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };
      
      const response = await fetch('http://127.0.0.1:8000/institution/api/settings/', {
        method: 'POST',
        headers: headers,
        body: formDataToSend,
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmitStatus('success');
        setTimeout(() => {
          window.location.href = "/institution";
        }, 5000);
      } else {
        if (response.status === 401) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            return;
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 400) {
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
            throw new Error(errorMessages.permission_error);
          } else if (response.status === 500) {
            throw new Error(errorMessages.server_error);
          } else {
            throw new Error(`Error: ${response.status} - ${errorData.detail || 'Something went wrong'}`);
          }
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.message || errorMessages.network_error);
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
            <span className="font-medium">Institution settings saved successfully!</span>
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
    <AccessTokenProtectedPage>
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 my-8 relative`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>Institution Settings</h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Configure your institution settings</p>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <label htmlFor="barcode" className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Enable Barcode
              </label>
            </div>
          </div>
          
          {/* Expected Total Number of Students */}
          <div>
            <label htmlFor="expected_total" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Expected Total Number of Students
            </label>
            <input 
              type="number" 
              id="expected_total"
              name="expected_total"
              value={formData.expected_total || ''}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting}
              placeholder="Enter expected number of students"
            />
            {formErrors.expected_total && (
              <p className="mt-1 text-sm text-red-500">{formErrors.expected_total}</p>
            )}
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
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting}
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
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
              disabled={isSubmitting}
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

          {/* Courses Offered */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Courses Offered
            </label>
            
            {/* Input Mode Toggle */}
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={() => setCourseInputMode('single')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  courseInputMode === 'single'
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Single Entry
              </button>
              <button
                type="button"
                onClick={() => setCourseInputMode('bulk')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  courseInputMode === 'bulk'
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Bulk Entry
              </button>
            </div>

            {courseInputMode === 'single' ? (
              <div className="flex space-x-2 mb-2">
                <input 
                  type="text" 
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  onKeyPress={handleCourseKeyPress}
                  className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  placeholder="Enter course name"
                  disabled={isSubmitting}
                />
                <button 
                  type="button"
                  onClick={handleAddCourse}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}
                  disabled={isSubmitting}
                >
                  Add
                </button>
              </div>
            ) : (
              <div className="mb-2">
                <textarea
                  value={bulkCoursesText}
                  onChange={(e) => setBulkCoursesText(e.target.value)}
                  onPaste={handleBulkCoursePaste}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  placeholder="Enter courses (one per line, or separated by commas/semicolons)"
                  rows={4}
                  disabled={isSubmitting}
                />
                <div className="flex space-x-2 mt-2">
                  <button 
                    type="button"
                    onClick={handleAddBulkCourses}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}
                    disabled={isSubmitting}
                  >
                    Add All Courses
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBulkCoursesText('')}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-gray-700 font-medium`}
                    disabled={isSubmitting}
                  >
                    Clear
                  </button>
                </div>
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Tip: You can copy and paste a list of courses from any source
                </p>
              </div>
            )}
            
            {formData.courses_offered.length > 0 && (
              <div className={`mt-2 p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Added Courses ({formData.courses_offered.length})
                  </h4>
                  <button 
                    type="button"
                    onClick={handleClearAllCourses}
                    className={`text-xs ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} font-medium`}
                    disabled={isSubmitting}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.courses_offered.map((course, index) => (
                    <span 
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${
                        darkMode ? 'bg-gray-600 text-gray-200 border-gray-500' : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      {course}
                      <button 
                        type="button"
                        onClick={() => handleRemoveCourse(course)}
                        className="ml-2 text-xs font-bold hover:text-red-500"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Template Front Upload */}
          <div>
            <label htmlFor="template_front" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Front Template (Optional)
            </label>
            <div className="mt-1 flex items-center">
              <div className={`flex-shrink-0 h-24 w-24 rounded-md overflow-hidden border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} flex items-center justify-center mr-4`}>
                {templateFrontPreview ? (
                  <img src={templateFrontPreview} alt="Front Template Preview" className="h-full w-full object-contain" />
                ) : (
                  <svg className={`h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="file"
                  id="template_front"
                  name="template_front"
                  ref={templateFrontInputRef}
                  onChange={(e) => handleTemplateChange(e, 'template_front')}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="flex space-x-2">
                  <label
                    htmlFor="template_front"
                    className={`cursor-pointer py-2 px-3 rounded-md text-sm font-medium ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-transparent`}
                  >
                    {formData.template_front ? 'Change Template' : 'Upload Template'}
                  </label>
                  {formData.template_front && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTemplate('template_front')}
                      className={`py-2 px-3 rounded-md text-sm font-medium ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border border-transparent`}
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  PNG, JPG, GIF or SVG (max. 5MB)
                </p>
              </div>
            </div>
            {formErrors.template_front && (
              <p className="mt-1 text-sm text-red-500">{formErrors.template_front}</p>
            )}
          </div>

          {/* Template Back Upload */}
          <div>
            <label htmlFor="template_back" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Back Template (Optional)
            </label>
            <div className="mt-1 flex items-center">
              <div className={`flex-shrink-0 h-24 w-24 rounded-md overflow-hidden border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} flex items-center justify-center mr-4`}>
                {templateBackPreview ? (
                  <img src={templateBackPreview} alt="Back Template Preview" className="h-full w-full object-contain" />
                ) : (
                  <svg className={`h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="file"
                  id="template_back"
                  name="template_back"
                  ref={templateBackInputRef}
                  onChange={(e) => handleTemplateChange(e, 'template_back')}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="flex space-x-2">
                  <label
                    htmlFor="template_back"
                    className={`cursor-pointer py-2 px-3 rounded-md text-sm font-medium ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-transparent`}
                  >
                    {formData.template_back ? 'Change Template' : 'Upload Template'}
                  </label>
                  {formData.template_back && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTemplate('template_back')}
                      className={`py-2 px-3 rounded-md text-sm font-medium ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border border-transparent`}
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  PNG, JPG, GIF or SVG (max. 5MB)
                </p>
              </div>
            </div>
            {formErrors.template_back && (
              <p className="mt-1 text-sm text-red-500">{formErrors.template_back}</p>
            )}
          </div>

          {/* Configuration Data Upload */}
          <div>
            <label htmlFor="conf_data" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Configuration Data (Optional)
            </label>
            <div className="mt-1 flex items-center">
              <div className={`flex-shrink-0 h-24 w-24 rounded-md overflow-hidden border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} flex items-center justify-center mr-4`}>
                <svg className={`h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <input
                  type="file"
                  id="conf_data"
                  name="conf_data"
                  ref={confDataInputRef}
                  onChange={handleConfDataChange}
                  accept=".xlsx,.csv,.json"
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="flex space-x-2">
                  <label
                    htmlFor="conf_data"
                    className={`cursor-pointer py-2 px-3 rounded-md text-sm font-medium ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-transparent`}
                  >
                    {formData.conf_data ? 'Change File' : 'Upload File'}
                  </label>
                  {formData.conf_data && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTemplate('conf_data')}
                      className={`py-2 px-3 rounded-md text-sm font-medium ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border border-transparent`}
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {confDataFileName && (
                  <p className={`mt-1 text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Selected: {confDataFileName}
                  </p>
                )}
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Excel (.xlsx), CSV, or JSON files only (max. 10MB)
                </p>
              </div>
            </div>
            {formErrors.conf_data && (
              <p className="mt-1 text-sm text-red-500">{formErrors.conf_data}</p>
            )}
          </div>
          
          {/* Hidden input for institution ID */}
          {institutionId && (
            <input type="hidden" name="institution" value={institutionId} />
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <motion.button
              type="submit"
              className={`px-8 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2A9D8F] hover:bg-[#248D7F]'}
              `}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Settings"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
    </AccessTokenProtectedPage>
  );
};

export default InstitutionSettingsForm;