"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TokenProtectedPage from '../../components/TokenProtected';

const StudentRegistrationForm = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [formData, setFormData] = useState({
    institution: null,
    reg_no: '',
    first_name: '',
    last_name: '',
    course: '',
    admission_year: '',
    email: '',
    phone_number: '+254',
    photo: null,
    fingerprint: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [globalErrors, setGlobalErrors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [minAdmissionYear, setMinAdmissionYear] = useState(2020);
  const [verificationResult, setVerificationResult] = useState(null);
  const [institutionSettings, setInstitutionSettings] = useState(null);
  const [manualCourseInput, setManualCourseInput] = useState('');
  const [manualAdmissionYearInput, setManualAdmissionYearInput] = useState('');
  const [useManualCourse, setUseManualCourse] = useState(false);
  const [useManualAdmissionYear, setUseManualAdmissionYear] = useState(false);
  const fileInputRef = useRef(null);
  const fingerprintScriptLoaded = useRef(false);

  // Error message mapping for user-friendly display
  const errorMessages = {
    // Field validation errors
    required: 'This information is required',
    invalid_email: 'Please enter a valid email address',
    invalid_phone: 'Phone number must be in the format +254 followed by 9 digits',
    min_length: 'Must be at least 2 characters long',
    invalid_year: 'Please select a valid admission year',
    invalid_course: 'Please select a valid course',
    invalid_photo: 'Please select a valid image file (JPEG or PNG)',
    file_too_large: 'Image size should be less than 2MB',
    
    // Server error mappings
    network_error: 'Network connection issue. Please check your internet and try again.',
    server_error: "Kindly check the details you've given in the form below. If this error persists kindly contact support at support@instipass.com",
    token_expired: 'Registration link has expired. Please contact your institution for a new link.',
    invalid_token: 'Registration link is invalid. Please check the link or contact your institution.',
    device_used: 'This device has already been used for registration. If this is an error, please contact support.',
    duplicate_entry: 'This information is already registered in our system.',
    verification_failed: 'The information you entered does not match our records.',
    banned_temporary: 'You are temporarily banned. Try again later.',
    banned_permanent: 'Your IP has been permanently banned.',
    
    // Field-specific server errors
    institution: 'Institution information could not be loaded',
    reg_no: 'Registration number is already in use or invalid',
    email: 'Email address is already registered or invalid',
    phone_number: 'Phone number is already registered or invalid',
    photo: 'Photo upload failed. Please try a different image.',
  };

  // Enhanced theme application function
  const applyTheme = (theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      body.classList.remove('dark');
      body.style.backgroundColor = '#f9fafb'; // bg-gray-50
    } else {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      body.classList.add('dark');
      body.style.backgroundColor = '#111827'; // dark:bg-gray-900
    }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('instipass-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const defaultTheme = systemPrefersDark ? 'dark' : 'light';
      setCurrentTheme(defaultTheme);
      applyTheme(defaultTheme);
      localStorage.setItem('instipass-theme', defaultTheme);
    }
  }, []);

  // Enhanced toggle theme function
  const toggleTheme = () => {
    setCurrentTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      
      // Apply theme immediately
      applyTheme(newTheme);
      
      // Save to localStorage
      localStorage.setItem('instipass-theme', newTheme);
      
      return newTheme;
    });
  };

  // Get current year for admission year validation
  const currentYear = new Date().getFullYear();

  // Enhanced error handler
  const handleError = (error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    let userFriendlyMessage = errorMessages.server_error;
    
    if (error.message) {
      const lowerMessage = error.message.toLowerCase();
      
      // Network errors
      if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('offline')) {
        userFriendlyMessage = errorMessages.network_error;
      }
      // Token errors
      else if (lowerMessage.includes('token') || lowerMessage.includes('expired') || lowerMessage.includes('invalid')) {
        userFriendlyMessage = errorMessages.invalid_token;
      }
      // Device errors
      else if (lowerMessage.includes('device') || lowerMessage.includes('used')) {
        userFriendlyMessage = errorMessages.device_used;
      }
      // Duplicate entry errors
      else if (lowerMessage.includes('duplicate') || lowerMessage.includes('already') || lowerMessage.includes('exists')) {
        userFriendlyMessage = errorMessages.duplicate_entry;
      }
      // Verification errors
      else if (lowerMessage.includes('verification') || lowerMessage.includes('match')) {
        userFriendlyMessage = errorMessages.verification_failed;
      }
    }
    
    return userFriendlyMessage;
  };

  // Load institution settings including courses and min admission year
  useEffect(() => {
    const fetchInstitutionSettings = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          throw new Error('Registration token is missing');
        }

        const response = await fetch(`http://127.0.0.1:8000/institution/api/setings/studentform/?token=${token}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Invalid or expired registration token');
          } else if (response.status === 404) {
            throw new Error('Institution settings not found');
          } else {
            throw new Error(`Server responded with status: ${response.status}`);
          }
        }

        const data = await response.json();
        if (data.length > 0) {
          const settings = data[0];
          setInstitutionSettings(settings);
          
          // Check if courses are provided, if not, enable manual input
          if (settings.courses_offered && settings.courses_offered.length > 0) {
            setCourses(settings.courses_offered);
          } else {
            setUseManualCourse(true);
            setCourses([]);
          }
          
          // Check if min admission year is provided, if not, enable manual input
          if (settings.min_admission_year) {
            setMinAdmissionYear(settings.min_admission_year);
          } else {
            setUseManualAdmissionYear(true);
            setMinAdmissionYear(2000); // Set a reasonable default minimum
          }
        } else {
          throw new Error('No institution settings available');
        }
      } catch (error) {
        const friendlyError = handleError(error, 'fetching institution settings');
        setGlobalErrors(prev => [...prev, friendlyError]);
        // If institution settings fail to load, enable manual inputs
        setUseManualCourse(true);
        setUseManualAdmissionYear(true);
        setMinAdmissionYear(2000);
      }
    };

    fetchInstitutionSettings();
  }, []);

  // Generate admission years based on institution settings
  const ADMISSION_YEARS = Array.from(
    { length: currentYear - minAdmissionYear + 1 }, 
    (_, i) => minAdmissionYear + i
  ).filter(year => year <= currentYear);

  // Handle manual course input
  const handleManualCourseChange = (e) => {
    const value = e.target.value;
    setManualCourseInput(value);
    setFormData(prev => ({
      ...prev,
      course: value
    }));
    
    // Clear error when user types
    if (formErrors.course) {
      setFormErrors(prev => ({
        ...prev,
        course: ''
      }));
    }
  };

  // Handle manual admission year input
  const handleManualAdmissionYearChange = (e) => {
    const value = e.target.value;
    setManualAdmissionYearInput(value);
    setFormData(prev => ({
      ...prev,
      admission_year: value
    }));
    
    // Clear error when user types
    if (formErrors.admission_year) {
      setFormErrors(prev => ({
        ...prev,
        admission_year: ''
      }));
    }
  };

  // Toggle between manual course input and dropdown
  const toggleManualCourseInput = () => {
    setUseManualCourse(!useManualCourse);
    setFormData(prev => ({
      ...prev,
      course: ''
    }));
    setManualCourseInput('');
  };

  // Toggle between manual admission year input and dropdown
  const toggleManualAdmissionYearInput = () => {
    setUseManualAdmissionYear(!useManualAdmissionYear);
    setFormData(prev => ({
      ...prev,
      admission_year: ''
    }));
    setManualAdmissionYearInput('');
  };

  // Load FingerprintJS and generate fingerprint
  useEffect(() => {
    const loadFingerprintJS = () => {
      if (fingerprintScriptLoaded.current) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js';
      script.async = true;
      
      script.onload = async () => {
        fingerprintScriptLoaded.current = true;
        try {
          const FingerprintJS = window.FingerprintJS;
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          
          setFormData(prevData => ({
            ...prevData,
            fingerprint: result.visitorId
          }));
        } catch (error) {
          console.error('FingerprintJS error:', error);
          // Non-critical error, continue without fingerprint
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load FingerprintJS');
        // Non-critical error, continue without fingerprint
      };
      
      document.head.appendChild(script);
    };
    
    loadFingerprintJS();
    
    return () => {
      if (fingerprintScriptLoaded.current) {
        const script = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"]');
        if (script) {
          document.head.removeChild(script);
        }
      }
    };
  }, []);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          throw new Error("Registration token is required");
        }

        const response = await fetch("http://127.0.0.1:8000/institution/api/tokenvalidator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Registration link has expired");
          } else if (response.status === 403) {
            throw new Error("Invalid registration link");
          } else {
            throw new Error(`Token validation failed with status: ${response.status}`);
          }
        }

        const data = await response.json();
        if (!data.institution_id) {
          throw new Error("Institution information not available");
        }
   
        setFormData(prevData => ({
          ...prevData,
          institution: parseInt(data.institution_id)
        }));
      } catch (error) {
        const friendlyError = handleError(error, 'token validation');
        setGlobalErrors(prev => [...prev, friendlyError]);
      }
    };

    validateToken();
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

  // Format phone number to always start with +254
  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(/[^\d+]/g, '');
    
    if (!cleaned.startsWith('+254')) {
      if (cleaned.startsWith('0')) {
        cleaned = '+254' + cleaned.substring(1);
      } else if (cleaned.startsWith('254')) {
        cleaned = '+' + cleaned;
      } else if (!cleaned.startsWith('+')) {
        cleaned = '+254' + cleaned;
      }
    }
    
    if (cleaned.length > 13) {
      cleaned = cleaned.substring(0, 13);
    }
    
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    
    if (name === 'phone_number') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear verification result when relevant fields change
    if (['reg_no', 'email', 'phone_number'].includes(name)) {
      setVerificationResult(null);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        photo: errorMessages.invalid_photo
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        photo: errorMessages.file_too_large
      }));
      return;
    }

    setFormErrors(prev => ({
      ...prev,
      photo: ''
    }));

    setFormData(prev => ({
      ...prev,
      photo: file
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.onerror = () => {
      setFormErrors(prev => ({
        ...prev,
        photo: 'Failed to load image. Please try another file.'
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Verify student details before submission
  const verifyStudentDetails = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        throw new Error('Registration token missing');
      }

      const verificationData = {
        institution_id: formData.institution,
        email: formData.email,
        phone_number: formData.phone_number,
        registration_no: formData.reg_no
      };

      const response = await fetch(`http://127.0.0.1:8000/institution/api/verifier/student/?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Verification data is incomplete or invalid');
        } else if (response.status === 404) {
          throw new Error('Student record not found');
        } else {
          throw new Error(`Verification failed with status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      const friendlyError = handleError(error, 'student verification');
      throw new Error(friendlyError);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.institution) {
      errors.institution = errorMessages.required;
    }

    if (!formData.reg_no.trim()) {
      errors.reg_no = errorMessages.required;
    }

    if (!formData.first_name.trim()) {
      errors.first_name = errorMessages.required;
    } else if (formData.first_name.trim().length < 2) {
      errors.first_name = errorMessages.min_length;
    }

    if (!formData.last_name.trim()) {
      errors.last_name = errorMessages.required;
    } else if (formData.last_name.trim().length < 2) {
      errors.last_name = errorMessages.min_length;
    }

    if (!formData.course.trim()) {
      errors.course = errorMessages.required;
    } else if (courses.length > 0 && !useManualCourse && !courses.includes(formData.course)) {
      errors.course = errorMessages.invalid_course;
    }

    if (!formData.admission_year) {
      errors.admission_year = errorMessages.required;
    } else {
      const year = parseInt(formData.admission_year);
      if (isNaN(year) || year < minAdmissionYear || year > currentYear) {
        errors.admission_year = `Admission year must be between ${minAdmissionYear} and ${currentYear}`;
      }
    }

    if (!formData.email.trim()) {
      errors.email = errorMessages.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = errorMessages.invalid_email;
    }

    if (!formData.phone_number.trim()) {
      errors.phone_number = errorMessages.required;
    } else if (!/^\+254\d{9}$/.test(formData.phone_number)) {
      errors.phone_number = errorMessages.invalid_phone;
    }

    if (!formData.photo) {
      errors.photo = errorMessages.required;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to continue with form submission
  const continueFormSubmission = async () => {
    try {
      const verificationData = await verifyStudentDetails();
      
      if (verificationData === null || verificationData === true) {
        setVerificationResult('proceed');
        await submitForm();
      } else if (verificationData === false) {
        setVerificationResult('invalid');
        setSubmitStatus('error');
        setErrorMessage(errorMessages.verification_failed);
        setIsSubmitting(false);
      } else {
        throw new Error('Unexpected response during verification');
      }
    } catch (error) {
      const friendlyError = handleError(error, 'form submission verification');
      setSubmitStatus('error');
      setErrorMessage(friendlyError);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) {
      setSubmitStatus('error');
      setErrorMessage('Please check the form for errors and try again');
      return;
    }
    
    setIsSubmitting(true);
    setVerificationResult(null);
    
    try {
      // Submit form directly without CAPTCHA verification
      await continueFormSubmission();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const submitForm = async () => {
    try {
      const formDataToSend = new FormData();
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        throw new Error('Registration token is missing');
      }

      Object.keys(formData).forEach(key => {
        if (key === 'photo') {
          if (formData.photo) {
            formDataToSend.append('photo', formData.photo);
          }
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`http://127.0.0.1:8000/student/api/student/?token=${token}`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        window.location.href = `/students/success/?token=${token}`;
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle different HTTP status codes with user-friendly messages
        if (response.status === 400) {
          const serverErrors = {};
          for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
              serverErrors[key] = errorData[key].map(error => {
                // Convert server validation errors to user-friendly messages
                if (error.toLowerCase().includes('already') || error.toLowerCase().includes('exists')) {
                  return errorMessages.duplicate_entry;
                }
                if (error.toLowerCase().includes('invalid')) {
                  return `Please check the ${key.replace('_', ' ')} format`;
                }
                if (error.toLowerCase().includes('required')) {
                  return errorMessages.required;
                }
                return error.replace('This field', 'This information').replace('Enter a valid', 'Please provide a valid');
              }).join('. ');
            } else if (typeof errorData[key] === 'string') {
              serverErrors[key] = errorData[key]
                .replace('This field', 'This information')
                .replace('already exists', 'is already registered')
                .replace('Invalid', 'Please check the');
            }
          }
          setFormErrors(serverErrors);
          throw new Error('Please review the highlighted fields and try again');
        } else if (response.status === 401 || response.status === 403) {
          throw new Error(errorMessages.invalid_token);
        } else if (response.status === 500) {
          throw new Error(errorMessages.server_error);
        } else if (response.status === 409) {
          throw new Error(errorMessages.duplicate_entry);
        } else {
          throw new Error(errorData.detail || errorData.message || errorMessages.server_error);
        }
      }
    } catch (error) {
      const friendlyError = handleError(error, 'form submission');
      setSubmitStatus('error');
      setErrorMessage(friendlyError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced error display component
  const ErrorDisplay = ({ errors, type = 'field' }) => {
  if (!errors || (Array.isArray(errors) && errors.length === 0) || (typeof errors === 'object' && Object.keys(errors).length === 0)) {
    return null;
  }

  if (type === 'global' && Array.isArray(errors)) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
      >
        <div className="flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="min-w-0 flex-1">
            <span className="font-medium block mb-2">Attention Required</span>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm whitespace-normal break-words overflow-visible">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'field' && typeof errors === 'object') {
    return Object.entries(errors).map(([fieldName, errorMessage]) => (
      <p key={fieldName} className="mt-1 text-sm text-red-600 dark:text-red-400 whitespace-normal break-words overflow-visible">
        {errorMessage}
      </p>
    ));
  }

  return null;
};

  // Enhanced Theme toggle button component with animation
  const ThemeToggle = () => (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors z-50"
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {currentTheme === 'dark' ? (
        <motion.svg
          key="sun"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </motion.svg>
      ) : (
        <motion.svg
          key="moon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </motion.svg>
      )}
    </motion.button>
  );

  // Status alert component
  const StatusAlert = () => {
    if (!submitStatus) return null;
    
    if (submitStatus === 'success') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Registration submitted successfully! Redirecting...</span>
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="min-w-0 flex-1">
              <span className="font-medium block mb-1">We encountered an issue</span>
              <p className="text-sm whitespace-normal break-words overflow-visible">
                {errorMessage}
              </p>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  // Verification status component
  const VerificationAlert = () => {
    if (!verificationResult) return null;
    
    if (verificationResult === 'invalid') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="min-w-0 flex-1">
              <span className="font-medium block mb-1">Verification Required</span>
              <p className="text-sm whitespace-normal break-words overflow-visible">
                {errorMessages.verification_failed}
              </p>
            </div>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <TokenProtectedPage>
      <div className={`min-h-screen transition-colors duration-300 ${
        currentTheme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        {/* Theme Toggle Button */}
        <ThemeToggle />
        
        <div className="flex justify-center items-center min-h-screen p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-lg shadow-xl p-6 md:p-8 w-full max-w-2xl mx-auto border transition-colors duration-300 ${
              currentTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold mb-2 ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Student Registration
              </h1>
              <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
              <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Please provide your information to complete registration
              </p>
            </div>
            
            {/* Status Alert */}
            <StatusAlert />
            
            {/* Verification Alert */}
            <VerificationAlert />
            
            {/* Global Errors */}
            <ErrorDisplay errors={globalErrors} type="global" />
            
            <form className="space-y-6" onSubmit={handleSubmit} id="student-form">
              {/* Hidden fingerprint field */}
              <input type="hidden" name="fingerprint" id="fp-field" value={formData.fingerprint || ''} />
              
              {/* Personal Information Section */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 text-[#2A9D8F]`}>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className={`block text-sm font-medium mb-1 ${
                      currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                        formErrors.first_name 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : currentTheme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white'
                            : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      placeholder="Enter your first name"
                    />
                    <ErrorDisplay errors={{ first_name: formErrors.first_name }} />
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className={`block text-sm font-medium mb-1 ${
                      currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                        formErrors.last_name 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : currentTheme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white'
                            : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      placeholder="Enter your last name"
                    />
                    <ErrorDisplay errors={{ last_name: formErrors.last_name }} />
                  </div>
                  
                  <div>
                    <label htmlFor="reg_no" className={`block text-sm font-medium mb-1 ${
                      currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="reg_no"
                      name="reg_no"
                      value={formData.reg_no}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                        formErrors.reg_no 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : currentTheme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white'
                            : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      placeholder="e.g., ABC123"
                    />
                    <ErrorDisplay errors={{ reg_no: formErrors.reg_no }} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="course" className={`block text-sm font-medium ${
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Course <span className="text-red-500">*</span>
                      </label>
                      {courses.length === 0 && (
                        <button
                          type="button"
                          onClick={toggleManualCourseInput}
                          className="text-xs text-[#2A9D8F] hover:underline"
                        >
                          {useManualCourse ? 'Use predefined list' : 'Enter manually'}
                        </button>
                      )}
                    </div>
                    
                    {useManualCourse || courses.length === 0 ? (
                      <input
                        type="text"
                        id="course"
                        name="course"
                        value={manualCourseInput}
                        onChange={handleManualCourseChange}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                          formErrors.course 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                            : currentTheme === 'dark'
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="Enter your course name"
                      />
                    ) : (
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                          formErrors.course 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                            : currentTheme === 'dark'
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                        }`}
                      >
                        <option value="">Select your course</option>
                        {courses.map((course, index) => (
                          <option key={index} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    )}
                    <ErrorDisplay errors={{ course: formErrors.course }} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="admission_year" className={`block text-sm font-medium ${
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Admission Year <span className="text-red-500">*</span>
                      </label>
                      {useManualAdmissionYear && (
                        <button
                          type="button"
                          onClick={toggleManualAdmissionYearInput}
                          className="text-xs text-[#2A9D8F] hover:underline"
                        >
                          {useManualAdmissionYear ? 'Use dropdown' : 'Enter manually'}
                        </button>
                      )}
                    </div>
                    
                    {useManualAdmissionYear ? (
                      <input
                        type="number"
                        id="admission_year"
                        name="admission_year"
                        value={manualAdmissionYearInput}
                        onChange={handleManualAdmissionYearChange}
                        min={minAdmissionYear}
                        max={currentYear}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                          formErrors.admission_year 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                            : currentTheme === 'dark'
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder={`Enter year (${minAdmissionYear}-${currentYear})`}
                      />
                    ) : (
                      <select
                        id="admission_year"
                        name="admission_year"
                        value={formData.admission_year}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                          formErrors.admission_year 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                            : currentTheme === 'dark'
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                        }`}
                      >
                        <option value="">Select admission year</option>
                        {ADMISSION_YEARS.map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    )}
                    <ErrorDisplay errors={{ admission_year: formErrors.admission_year }} />
                  </div>
                </div>
              </div>
              
              {/* Contact Information Section */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 text-[#2A9D8F]`}>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                      currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                        formErrors.email 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : currentTheme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white'
                            : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    <ErrorDisplay errors={{ email: formErrors.email }} />
                  </div>
                  
                  <div>
                    <label htmlFor="phone_number" className={`block text-sm font-medium mb-1 ${
                      currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-all duration-200 ${
                        formErrors.phone_number 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : currentTheme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white'
                            : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      placeholder="+254 XXX XXX XXX"
                    />
                    <ErrorDisplay errors={{ phone_number: formErrors.phone_number }} />
                  </div>
                </div>
              </div>
              
              {/* Photo Upload Section */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 text-[#2A9D8F]`}>
                  Photo Upload
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="photo" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      formErrors.photo 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                        : currentTheme === 'dark'
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}>
                      {photoPreview ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={photoPreview} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className={`w-8 h-8 mb-4 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className={`mb-2 text-sm ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className={`text-xs ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            PNG, JPG (MAX. 2MB)
                          </p>
                        </div>
                      )}
                      <input 
                        id="photo" 
                        name="photo"
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                  <ErrorDisplay errors={{ photo: formErrors.photo }} />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#2A9D8F] hover:bg-[#238278]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </TokenProtectedPage>
  );
};

export default StudentRegistrationForm;