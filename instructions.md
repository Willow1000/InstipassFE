# INstructions
I want report Issue to be an option like the other options in the navigation menu, it should be removed from the notifications section

# Code
"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Activity, 
  Clock, 
  Bank,
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Menu, 
  X,
  RefreshCw,
  Share2,
  CreditCard,
  DollarSign,
  Calendar,
  Eye,
  Filter,
  Download,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Info,
  Banknote,
  Building,
  MapPin,
  Mail,
  Phone,
  Globe,
  User,
  QrCode,
  BarChart3,
  GraduationCap,
  Palette,
  Flag,
  Send,
  Edit,
  Save,
  Plus,
  Minus,
  Trash2,
  Link
} from 'lucide-react';
import AcessTokenProtectedPage from '../../components/AccessTokenProtectedPage'

// API endpoints
const STUDENTS_API_URL = 'http://127.0.0.1:8000/institution/api/students';
const INSTITUTION_API_URL = 'http://127.0.0.1:8000/institution/api/institution';
const SETTINGS_API_URL = 'http://127.0.0.1:8000/institution/api/settings/';
const NOTIFICATIONS_API_URL = 'http://127.0.0.1:8000/institution/api/notifications';
const REPORT_ISSUE_API_URL = 'http://127.0.0.1:8000/institution/api/report/issue/';
const CREATE_REGISTRATION_TOKENS_API_URL = 'http://127.0.0.1:8000/institution/api/student/registration/token/create';
const BALANCES_API_URL = 'http://127.0.0.1:8000/institution/api/balances';
const VERIFY_PAYMENT_API_URL = 'http://127.0.0.1:8000/institution/api/verify/payment/';

// Instipass color palette
const COLORS = { 
  primary: '#1D3557', // Deep blue
  secondary: '#2A9D8F', // Soft teal/success green
  accent: '#F1F1F1', // Light gray
  white: '#FFFFFF',
  pending: '#F59E0B', // Yellow for pending
  processing: '#3B82F6', // Blue for processing
  ready: '#10B981', // Green for ready
  rejected: '#EF4444', // Red for rejected
};

// Status mapping for API status values
const statusMap = {
  application_received: { 
    label: 'Pending', 
    colorClass: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300', 
    icon: <Clock size={14} />,
    color: COLORS.pending
  },
  processing: { 
    label: 'Processing', 
    colorClass: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', 
    icon: <Activity size={14} />,
    color: COLORS.processing
  },
  ready: { 
    label: 'Ready for Delivery', 
    colorClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', 
    icon: <CheckCircle size={14} />,
    color: COLORS.ready
  },
  id_ready: { 
    label: 'Ready for Delivery', 
    colorClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', 
    icon: <CheckCircle size={14} />,
    color: COLORS.ready
  },
  rejected: { 
    label: 'Rejected', 
    colorClass: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', 
    icon: <X size={14} />,
    color: COLORS.rejected
  },
  default: { 
    label: 'Unknown', 
    colorClass: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300', 
    icon: <AlertTriangle size={14} />,
    color: '#6B7280'
  }
};

// Debounce function
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Enhanced cookie clearing function
const clearAllSessionCookies = () => {
  try {
    // Clear all session-related cookies
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      // Clear common session cookies
      if (cookieName.includes('session') || 
          cookieName.includes('token') || 
          cookieName.includes('auth') ||
          cookieName === 'refresh_token' ||
          cookieName === 'access_token' ||
          cookieName === 'csrftoken') {
        
        // Clear cookie by setting expiration to past date
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
    });

    // Clear localStorage tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    console.log('All session cookies and tokens cleared');
  } catch (error) {
    console.error('Error clearing session cookies:', error);
  }
};

// SWR fetcher function with error handling
const fetcher = async ([url, token]) => {
  if (!token) {
    console.warn('Authentication token not found');
    clearAllSessionCookies();
    throw new Error('Authentication required');
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Handle authentication errors
  if (response.status === 401 || response.status === 403 || response.status === 422) {
    console.error('Authentication error, clearing session data');
    clearAllSessionCookies();
    window.location.href = '/institution/login';
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
};

// Enhanced fetcher for form data requests (with file uploads)
const formDataFetcher = async (url, options = {}) => {
  let token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    }
  });

  // Handle authentication errors
  if (response.status === 401 || response.status === 403 || response.status === 422) {
    clearAllSessionCookies();
    window.location.href = '/institution/login';
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

// API service function for creating registration tokens
const createRegistrationTokens = async (institutionEmail) => {
  let token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(CREATE_REGISTRATION_TOKENS_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: institutionEmail }),
  });

  // Handle authentication errors
  if (response.status === 401 || response.status === 403 || response.status === 422) {
    clearAllSessionCookies();
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle different error statuses
    switch (response.status) {
      case 400:
        throw new Error(errorData.email?.[0] || errorData.detail || 'Invalid email address');
      case 404:
        throw new Error('Institution not found');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
    }
  }

  return await response.json();
};

// Custom hooks for data fetching with error handling
const useInstitutionData = (token) => {
  const { data: institutionData, error: institutionError, isLoading: institutionLoading, mutate: mutateInstitution } = useSWR(
    token ? [INSTITUTION_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      onError: (error) => {
        console.error('Error fetching institution data:', error);
        if (error.message.includes('Authentication') || error.message.includes('401')) {
          clearAllSessionCookies();
        }
      }
    }
  );

  return { institutionData, institutionError, institutionLoading, mutateInstitution };
};

const useStudentsData = (token) => {
  const { data: students, error, isLoading, mutate } = useSWR(
    token ? [STUDENTS_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: true,
      onError: (error) => {
        console.error('Error fetching students data:', error);
        if (error.message.includes('Authentication') || error.message.includes('401')) {
          clearAllSessionCookies();
        }
      }
    }
  );

  return { students, error, isLoading, mutate };
};

const useSettingsData = (token) => {
  const { data: settingsData, error: settingsError, isLoading: settingsLoading, mutate: mutateSettings } = useSWR(
    token ? [SETTINGS_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      onError: (error) => {
        console.error('Error fetching settings data:', error);
        if (error.message.includes('Authentication') || error.message.includes('401')) {
          clearAllSessionCookies();
        }
      }
    }
  );

  return { settingsData, settingsError, settingsLoading, mutateSettings };
};

const useNotificationsData = (token) => {
  const { data: notificationsData, error: notificationsError, isLoading: notificationsLoading, mutate: mutateNotifications } = useSWR(
    token ? [NOTIFICATIONS_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: true,
      onError: (error) => {
        console.error('Error fetching notifications data:', error);
        if (error.message.includes('Authentication') || error.message.includes('401')) {
          clearAllSessionCookies();
        }
      }
    }
  );

  return { notificationsData, notificationsError, notificationsLoading, mutateNotifications };
};

const useBalancesData = (token) => {
  const { data: balancesData, error: balancesError, isLoading: balancesLoading, mutate: mutateBalances } = useSWR(
    token ? [BALANCES_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: true,
      onError: (error) => {
        console.error('Error fetching balances data:', error);
        if (error.message.includes('Authentication') || error.message.includes('401')) {
          clearAllSessionCookies();
        }
      }
    }
  );

  return { balancesData, balancesError, balancesLoading, mutateBalances };
};

// Reusable StatCard component
const StatCard = ({ title, value, icon, darkMode, colorClass = '' }) => (
  <motion.div 
    className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} flex flex-col justify-between ${colorClass}`}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-start mb-2 md:mb-4">
      <span className={`text-xs md:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</span>
      <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {React.cloneElement(icon, { className: `w-5 h-5 md:w-6 md-h-6 text-teal-600 dark:text-teal-400`})}
      </div>
    </div>
    <div>
      <h3 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </h3>
    </div>
  </motion.div>
);

// Notification Bell Component with Badge
const NotificationBell = ({ darkMode, unreadCount, onClick }) => (
  <button 
    onClick={onClick}
    className={`relative p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
    title={`${unreadCount} unread notifications`}
  >
    <Bell size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </button>
);

// Payment Balance Section Component - UPDATED
const PaymentBalanceSection = ({ darkMode, institutionData, onSuccess }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const { balancesData, balancesError, balancesLoading, mutateBalances } = useBalancesData(token);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    document: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      document: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.document) {
      setSubmitError('Please select a document as proof of payment');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const institution = Array.isArray(institutionData) ? institutionData[0] : institutionData;
      const institutionId = institution?.id;

      if (!institutionId) {
        throw new Error('Institution ID not found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('institution', institutionId);
      formDataToSend.append('document', formData.document);

      await formDataFetcher(VERIFY_PAYMENT_API_URL, {
        method: 'POST',
        body: formDataToSend
      });

      // Reset form
      setFormData({ document: null });
      setSubmitSuccess(true);
      
      // Refresh balances data
      mutateBalances();
      
      if (onSuccess) {
        onSuccess('Payment proof submitted successfully! It is now under review.');
      }
      
      setShowPaymentForm(false);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowPaymentForm(false);
    setSubmitError('');
    setFormData({ document: null });
  };

  // Format balance to display meticulously
  const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return '0.00';
    return parseFloat(balance).toFixed(2);
  };

  // Get balance from API response - handle both array and object formats
  const getBalance = () => {
    if (!balancesData) return '0.00';
    
    // If it's an array, get the first item's amount
    if (Array.isArray(balancesData) && balancesData.length > 0) {
      return formatBalance(balancesData[0].amount);
    }
    
    // If it's an object with amount property
    if (balancesData.amount !== undefined) {
      return formatBalance(balancesData.amount);
    }
    
    // If it's an object with balance property
    if (balancesData.balance !== undefined) {
      return formatBalance(balancesData.balance);
    }
    
    return '0.00';
  };

  const balance = getBalance();
  const hasBalance = parseFloat(balance) > 0;

  // NEW: Check if balancesData is an empty object or empty array
  const isEmptyBalanceData = useMemo(() => {
    if (!balancesData) return true;
    
    if (Array.isArray(balancesData)) {
      return balancesData.length === 0;
    }
    
    if (typeof balancesData === 'object') {
      return Object.keys(balancesData).length === 0;
    }
    
    return false;
  }, [balancesData]);

  // NEW: Don't display anything if balance data is empty
  if (isEmptyBalanceData) {
    return null;
  }

  if (balancesLoading) {
    return (
      <motion.div 
        className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </motion.div>
    );
  }

  if (balancesError) {
    return (
      <motion.div 
        className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          <div className="flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            <span>Error loading balance: {balancesError.message}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Account Balance
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Current outstanding balance for your institution
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Balance</p>
              <p className={`text-3xl font-bold ${hasBalance ? 'text-red-600' : 'text-green-600'}`}>
                KES {balance}
              </p>
            </div>
            
            {hasBalance && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center"
              >
                <CreditCard size={16} className="mr-2" />
                Submit Proof
              </button>
            )}
          </div>
        </div>

        {hasBalance && (
          <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center">
              <AlertTriangle size={16} className={`mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                You have an outstanding balance of <strong>KES {balance}</strong>. Please submit proof of payment to verify your payment.
              </span>
            </div>
          </div>
        )}

        {!hasBalance && (
          <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center">
              <CheckCircle size={16} className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                Your account balance is settled. No outstanding payments.
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Payment Proof Form Modal */}
      <AnimatePresence>
        {showPaymentForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={handleCloseForm}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                    <CreditCard className="mr-2 text-teal-600 dark:text-teal-400" size={24} />
                    Submit Payment Proof
                  </h3>
                  <button 
                    onClick={handleCloseForm}
                    className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                {submitError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {submitError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Upload Payment Proof Document
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3' 
                          : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3'
                      }`}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      required
                    />
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start">
                      <Info size={16} className={`mt-0.5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          <strong>Note:</strong> Please upload clear proof of payment (bank transfer receipt, payment confirmation, etc.). 
                          Your payment will be verified by our team and the balance will be updated accordingly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      darkMode 
                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !formData.document}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Submit Proof
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Payments Page Component - Updated to show balance only
const PaymentsPage = ({ darkMode, institutionData, onSuccess }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const { balancesData, balancesError, balancesLoading } = useBalancesData(token);

  // Check if balancesData is empty
  const isEmptyBalanceData = useMemo(() => {
    if (!balancesData) return true;
    
    if (Array.isArray(balancesData)) {
      return balancesData.length === 0;
    }
    
    if (typeof balancesData === 'object') {
      return Object.keys(balancesData).length === 0;
    }
    
    return false;
  }, [balancesData]);

  // Don't display the entire payments page if balance data is empty
  if (isEmptyBalanceData) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="text-center py-8">
            <CreditCard className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              No Payment Information Available
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              There is no outstanding balance or payment information for your institution at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PaymentBalanceSection 
        darkMode={darkMode}
        institutionData={institutionData}
        onSuccess={onSuccess}
      />
      
      {/* Payment Methods Card */}
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="text-center mb-6">
          <CreditCard className={`mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={40} />
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Payment Methods
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose your preferred payment method and submit proof of payment
          </p>
        </div>

        {/* Payment Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* M-Pesa Option */}
          <div className={`p-4 rounded-xl border-2 ${darkMode ? 'bg-gray-700/50 border-green-800/50' : 'bg-green-50 border-green-200'} transition-all hover:scale-[1.02]`}>
            <div className="flex items-center mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${darkMode ? 'bg-green-900' : 'bg-green-100'} p-1.5`}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" 
                  alt="M-Pesa" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>M-Pesa</h4>
                <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Instant Mobile Payment</p>
              </div>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Paybill:</span>
                  <span className="font-mono">123456</span>
                </div>
                <div className="flex justify-between">
                  <span>Account:</span>
                  <span className="font-mono">TEST123</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Option */}
          <div className={`p-4 rounded-xl border-2 ${darkMode ? 'bg-gray-700/50 border-blue-800/50' : 'bg-blue-50 border-blue-200'} transition-all hover:scale-[1.02]`}>
            <div className="flex items-center mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Building size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bank Transfer</h4>
                <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Direct Bank Transfer</p>
              </div>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Bank:</span>
                  <span>Test Bank</span>
                </div>
                <div className="flex justify-between">
                  <span>Account:</span>
                  <span className="font-mono">9876543210</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-start">
            <Info size={18} className={`mt-0.5 mr-3 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Payment Process</h4>
              <ol className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>1</span>
                  Make payment using either M-Pesa or Bank Transfer
                </li>
                <li className="flex items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>2</span>
                  Take a screenshot or photo of your payment confirmation
                </li>
                <li className="flex items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>3</span>
                  Click "Pay Now" above and submit your proof of payment
                </li>
                <li className="flex items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>4</span>
                  Our team will verify and update your balance within 24-48 hours
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Registration Links Component - UPDATED with balance check
const RegistrationLinksSection = ({ darkMode, institutionData, onSuccess, settingsData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const { balancesData, balancesLoading } = useBalancesData(token);

  // Check if template settings are configured
  const hasTemplateSettings = useMemo(() => {
    if (!settingsData || !Array.isArray(settingsData) || settingsData.length === 0) {
      return false;
    }
    
    const settings = settingsData[0];
    return !!(settings.template_front || settings.template_back);
  }, [settingsData]);

  // NEW: Get balance and check if there's an outstanding balance
  const getBalance = () => {
    if (!balancesData) return '0.00';
    
    // If it's an array, get the first item's amount
    if (Array.isArray(balancesData) && balancesData.length > 0) {
      return parseFloat(balancesData[0].amount || 0).toFixed(2);
    }
    
    // If it's an object with amount property
    if (balancesData.amount !== undefined) {
      return parseFloat(balancesData.amount || 0).toFixed(2);
    }
    
    // If it's an object with balance property
    if (balancesData.balance !== undefined) {
      return parseFloat(balancesData.balance || 0).toFixed(2);
    }
    
    return '0.00';
  };

  const balance = getBalance();
  const hasOutstandingBalance = parseFloat(balance) > 0;

  const handleCreateRegistrationLinks = async () => {
    if (!institutionData) {
      setError('Institution data not available');
      return;
    }

    // NEW: Check if there's an outstanding balance
    if (hasOutstandingBalance) {
      setError(`Cannot generate registration links while you have an outstanding balance of KES ${balance}. Please settle your balance first.`);
      return;
    }

    if (!hasTemplateSettings) {
      setError('Please configure template settings first before generating registration links.');
      return;
    }

    const institution = Array.isArray(institutionData) ? institutionData[0] : institutionData;
    const institutionEmail = institution?.email;

    if (!institutionEmail) {
      setError('Institution email not found');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createRegistrationTokens(institutionEmail);
      setSuccess(true);
      if (onSuccess) {
        onSuccess('Registration links created successfully! Check your email for the links.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to create registration links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setSuccess(false);
    handleCreateRegistrationLinks();
  };

  return (
    <motion.div 
      className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Student Registration Links
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Generate unique registration links for your students. The links will be sent to your institution email.
          </p>
        </div>
        <button
          onClick={handleCreateRegistrationLinks}
          disabled={isLoading || !hasTemplateSettings || hasOutstandingBalance || balancesLoading}
          className={`mt-4 md:mt-0 px-6 py-3 rounded-lg font-medium transition-colors ${
            isLoading || !hasTemplateSettings || hasOutstandingBalance || balancesLoading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Link size={16} className="mr-2" />
              Generate Registration Links
            </>
          )}
        </button>
      </div>

      {/* Outstanding Balance Warning */}
      {hasOutstandingBalance && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-100 border-red-200'}`}
        >
          <div className="flex items-center">
            <AlertTriangle size={16}  className={`text-sm "mr-2" ${darkMode ? 'text-red-300' : 'text-red-700'}`}/> 
            <span className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
              <strong>Outstanding Balance:</strong> You cannot generate registration links while you have an outstanding balance of <strong>KES {balance}</strong>. Please settle your balance first to enable this feature.
            </span>
          </div>
        </motion.div>
      )}

      {/* Template Settings Warning */}
      {!hasTemplateSettings && !hasOutstandingBalance && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 text-sm"
        >
          <div className="flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            <span>
              <strong>Template settings required:</strong> Please configure your ID template settings before generating registration links. 
              <a 
                href="#template-settings" 
                className="ml-1 underline hover:text-yellow-800 dark:hover:text-yellow-200"
                onClick={(e) => {
                  e.preventDefault();
                  // You can add navigation logic here if needed
                }}
              >
                Configure templates
              </a>
            </span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              <span>{error}</span>
            </div>
            {!hasOutstandingBalance && (
              <button
                onClick={handleRetry}
                className="text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 text-sm font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm"
        >
          <div className="flex items-center">
            <CheckCircle size={16} className="mr-2" />
            <span>
              Registration links generated successfully! Please check your email at <strong>{Array.isArray(institutionData) ? institutionData[0]?.email : institutionData?.email}</strong> for the registration links.
            </span>
          </div>
        </motion.div>
      )}

      {/* Information Box */}
      <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start">
          <Info size={16} className={`mt-0.5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>How it works:</strong> Click the button above to generate unique registration links for your students. 
              The links will be sent to your registered institution email address. 
              You can then distribute these links to your students for registration.
            </p>
            {hasTemplateSettings && !hasOutstandingBalance && (
              <p className={`text-sm mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                <strong>Requirements:</strong> Template settings are configured and ready. No outstanding balance.
              </p>
            )}
            {hasOutstandingBalance && (
              <p className={`text-sm mt-1 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                <strong>Action Required:</strong> Please settle your outstanding balance of <strong>KES {balance}</strong> to enable registration link generation.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Report Issue Form Component
const ReportIssueForm = ({ isOpen, onClose, darkMode, institutionData, onSuccess }) => {
  const [formData, setFormData] = useState({
    issue_type: 'other',
    description: '',
    attachment: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const issueTypes = [
    { value: 'bug', label: 'Bug/Technical Error' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'template', label: 'ID Template Issue' },
    { value: 'fraud', label: 'Fraud/Suspicious Activity' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Get institution ID
      const institution = Array.isArray(institutionData) ? institutionData[0] : institutionData;
      const institutionId = institution?.id;

      if (!institutionId) {
        throw new Error('Institution ID not found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('institution', institutionId);
      formDataToSend.append('issue_type', formData.issue_type);
      formDataToSend.append('description', formData.description);
      
      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment);
      }

      await formDataFetcher(REPORT_ISSUE_API_URL, {
        method: 'POST',
        body: formDataToSend
      });

      // Reset form
      setFormData({
        issue_type: 'other',
        description: '',
        attachment: null
      });

      // Call success callback
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                <Flag className="mr-2 text-teal-600 dark:text-teal-400" size={24} />
                Report Issue
              </h3>
              <button 
                onClick={onClose}
                className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Issue Type
                </label>
                <select
                  name="issue_type"
                  value={formData.issue_type}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  {issueTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Please describe the issue in detail..."
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Attachment (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3' 
                      : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3'
                  }`}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Submit Issue
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Success Notification Component
const SuccessNotification = ({ isVisible, onClose, message = "Operation completed successfully!" }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <CheckCircle size={20} className="mr-2" />
          <span>{message}</span>
          <button 
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Institution Details Popup Component
const InstitutionDetailsPopup = ({ institutionData, isOpen, onClose, darkMode, onUpdate }) => {
  const institution = Array.isArray(institutionData) ? institutionData[0] : institutionData;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    county: '',
    region: '',
    email: '',
    tel: '',
    address: '',
    web_url: '',
    admin_email: '',
    admin_tell: '',
    logo: null
  });
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (institution) {
      const initialData = {
        name: institution.name || '',
        county: institution.county || '',
        region: institution.region || '',
        email: institution.email || '',
        tel: institution.tel || '',
        address: institution.address || '',
        web_url: institution.web_url || '',
        admin_email: institution.admin_email || '',
        admin_tell: institution.admin_tell || '',
        logo: null
      };
      setFormData(initialData);
      setOriginalData({
        ...initialData,
        logo_url: institution.logo || ''
      });
    }
  }, [institution]);

  const hasChanges = useMemo(() => {
    if (!originalData.name) return false;
    
    const textFieldsChanged = Object.keys(formData).some(key => {
      if (key === 'logo') return false;
      return formData[key] !== originalData[key];
    });
    
    const logoChanged = formData.logo !== null;
    
    return textFieldsChanged || logoChanged;
  }, [formData, originalData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  const getChangedFields = () => {
    const changedFields = {};
    
    Object.keys(formData).forEach(key => {
      if (key === 'logo') return;
      if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });
    
    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasChanges) {
      setError('No changes detected');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const changedFields = getChangedFields();
      const hasLogoChange = formData.logo !== null;
      
      const formDataToSend = new FormData();
      
      Object.keys(changedFields).forEach(key => {
        formDataToSend.append(key, changedFields[key]);
      });
      
      if (hasLogoChange) {
        formDataToSend.append('logo', formData.logo);
      }

      const updatedData = await formDataFetcher(`${INSTITUTION_API_URL}/${institution.id}/`, {
        method: 'PATCH',
        body: formDataToSend
      });

      const newOriginalData = {
        name: updatedData.name || '',
        county: updatedData.county || '',
        region: updatedData.region || '',
        email: updatedData.email || '',
        tel: updatedData.tel || '',
        address: updatedData.address || '',
        web_url: updatedData.web_url || '',
        admin_email: updatedData.admin_email || '',
        admin_tell: updatedData.admin_tell || '',
        logo_url: updatedData.logo || ''
      };
      
      setFormData({
        ...newOriginalData,
        logo: null
      });
      setOriginalData(newOriginalData);

      const logoInput = document.querySelector('input[name="logo"]');
      if (logoInput) logoInput.value = '';

      if (onUpdate) {
        onUpdate();
      }

      setIsEditing(false);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    if (institution) {
      const resetData = {
        name: institution.name || '',
        county: institution.county || '',
        region: institution.region || '',
        email: institution.email || '',
        tel: institution.tel || '',
        address: institution.address || '',
        web_url: institution.web_url || '',
        admin_email: institution.admin_email || '',
        admin_tell: institution.admin_tell || '',
        logo: null
      };
      setFormData(resetData);
      setOriginalData({
        ...resetData,
        logo_url: institution.logo || ''
      });
    }
    
    const logoInput = document.querySelector('input[name="logo"]');
    if (logoInput) logoInput.value = '';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                <Building className="mr-2 text-teal-600 dark:text-teal-400" size={24} />
                Institution Details
              </h3>
              <div className="flex items-center space-x-2">
                {!isEditing && institution && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                    title="Edit Details"
                  >
                    <Edit size={20} />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {institution ? (
              isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Institution Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Institution Logo
                    </label>
                    {originalData.logo_url && (
                      <div className="mb-3">
                        <img 
                          src={originalData.logo_url} 
                          alt="Current Institution Logo" 
                          className="w-32 h-32 object-cover border rounded-lg"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current logo</p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="logo"
                      onChange={handleLogoChange}
                      accept="image/*"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3' 
                          : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload new logo image (JPG, PNG, GIF - Max 10MB)
                    </p>
                    {formData.logo && (
                      <p className={`text-xs mt-1 text-teal-600 dark:text-teal-400`}>
                        Selected: {formData.logo.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        County
                      </label>
                      <input
                        type="text"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Region
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="tel"
                      value={formData.tel}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="web_url"
                      value={formData.web_url}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="admin_email"
                      value={formData.admin_email}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Admin Phone
                    </label>
                    <input
                      type="tel"
                      name="admin_tell"
                      value={formData.admin_tell}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                        hasChanges && !isSubmitting
                          ? 'bg-teal-600 text-white hover:bg-teal-700' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                      disabled={!hasChanges || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Update Details
                        </>
                      )}
                    </button>
                  </div>
                  
                  {hasChanges && (
                    <div className="mt-2 text-xs text-teal-600 dark:text-teal-400">
                      Changes detected - submit button enabled
                    </div>
                  )}
                </form>
              ) : (
                <div className="space-y-4">
                  {institution.logo && (
                    <div className="flex items-start space-x-3">
                      <ImageIcon className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Institution Logo</p>
                        <img 
                          src={institution.logo} 
                          alt="Institution Logo" 
                          className="w-32 h-32 object-cover border rounded-lg mt-1"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <Building className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Institution Name</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Location</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {[institution.county, institution.region].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Phone</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.tel || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Address</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.address || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {institution.web_url && (
                    <div className="flex items-start space-x-3">
                      <Globe className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Website</p>
                        <a 
                          href={institution.web_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-base text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          {institution.web_url}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <User className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Admin Contact</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.admin_email || 'N/A'}
                        {institution.admin_tell && ` • ${institution.admin_tell}`}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <Building className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Institution details not available
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced File Upload Component
const FileUploadField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  accept, 
  darkMode, 
  disabled,
  previewUrl,
  existingFileUrl,
  maxSizeMB = 5,
  fileType = 'image'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileValidation(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileValidation(file);
    }
  };

  const handleFileValidation = (file) => {
    if (!file || !(file instanceof File)) {
      console.error('Invalid file provided:', file);
      return;
    }
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const acceptedTypes = accept.split(',').map(type => type.trim());
    
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      return file.type.includes(type.replace('image/', ''));
    });

    if (!isValidType) {
      alert(`Please select a valid file type: ${accept}`);
      return;
    }

    setFileName(file.name);
    onChange(file);
  };

  const clearFile = () => {
    setFileName('');
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFilePreview = () => {
    if (previewUrl) return previewUrl;
    if (existingFileUrl) return existingFileUrl;
    return null;
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive 
            ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20' 
            : darkMode 
              ? 'border-gray-600 bg-gray-700/50' 
              : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          onChange={handleFileChange}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        
        <div className="text-center">
          {getFilePreview() ? (
            <div className="flex flex-col items-center space-y-3">
              {fileType === 'image' ? (
                <img 
                  src={getFilePreview()} 
                  alt="Preview" 
                  className="w-32 h-32 object-contain rounded-lg border"
                />
              ) : (
                <div className={`w-32 h-32 rounded-lg border flex items-center justify-center ${
                  darkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-100 border-gray-300'
                }`}>
                  <FileText className={`w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              )}
              <div className="text-sm">
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {fileName || 'Current file'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click or drag to replace
                </p>
              </div>
            </div>
          ) : (
            <>
              <Upload className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`} />
              <div className="flex flex-col items-center space-y-1">
                <button
                  type="button"
                  onClick={handleClick}
                  className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
                  disabled={disabled}
                >
                  Click to upload
                </button>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>or drag and drop</span>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {accept} (max. {maxSizeMB}MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {(fileName || getFilePreview()) && (
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={clearFile}
            className={`text-xs flex items-center space-x-1 ${
              darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
            }`}
            disabled={disabled}
          >
            <Trash2 size={12} />
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced Courses Display Component
const CoursesDisplay = ({ courses, darkMode, onEdit, isEditing = false }) => {
  const [expanded, setExpanded] = useState(false);
  const maxVisible = 8;

  if (!courses || courses.length === 0) {
    return (
      <div className="flex items-start space-x-3">
        <GraduationCap className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Courses Offered</p>
          <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>No courses added</p>
        </div>
      </div>
    );
  }

  const visibleCourses = expanded ? courses : courses.slice(0, maxVisible);
  const hasMore = courses.length > maxVisible;

  return (
    <div className="flex items-start space-x-3">
      <GraduationCap className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Courses Offered ({courses.length})
          </p>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-3 rounded-lg ${
          darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'
        }`}>
          {visibleCourses.map((course, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded text-sm truncate ${
                darkMode ? 'bg-gray-600 text-gray-200 border border-gray-500' : 'bg-white text-gray-700 border border-gray-300'
              }`}
              title={course}
            >
              {course}
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-xs mt-2 flex items-center space-x-1 ${
              darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-800'
            }`}
          >
            {expanded ? (
              <>
                <ChevronUp size={12} />
                <span>Show less</span>
              </>
            ) : (
              <>
                <ChevronDown size={12} />
                <span>Show all {courses.length} courses</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Template Settings Page Component with All Fields
const TemplateSettingsPage = ({ settingsData, loading, error, darkMode, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    qrcode: false,
    barcode: true,
    expected_total: 0,
    min_admission_year: new Date().getFullYear(),
    notification_pref: 'sms',
    template_front: '',
    template_back: '',
    courses_offered: [],
    conf_data: null
  });
  const [originalData, setOriginalData] = useState({});
  const [fileUploads, setFileUploads] = useState({
    template_front: null,
    template_back: null,
    conf_data: null
  });
  const [newCourse, setNewCourse] = useState('');
  const [courseInputMode, setCourseInputMode] = useState('single');
  const [bulkCoursesText, setBulkCoursesText] = useState('');
  const [templateFrontPreview, setTemplateFrontPreview] = useState(null);
  const [templateBackPreview, setTemplateBackPreview] = useState(null);
  const [confDataFileName, setConfDataFileName] = useState('');

  // Notification preferences
  const NOTIFICATION_CHOICES = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "both", label: "Both" }
  ];

  // Current year for validation
  const currentYear = new Date().getFullYear();

  // Get the first settings object from the array
  const settings = Array.isArray(settingsData) && settingsData.length > 0 ? settingsData[0] : null;

  // Initialize form data when settings data changes
  useEffect(() => {
    if (settings) {
      const initialData = {
        qrcode: settings.qrcode || false,
        barcode: settings.barcode !== undefined ? settings.barcode : true,
        expected_total: settings.expected_total || 0,
        min_admission_year: settings.min_admission_year || new Date().getFullYear(),
        notification_pref: settings.notification_pref || 'sms',
        template_front: settings.template_front || '',
        template_back: settings.template_back || '',
        courses_offered: settings.courses_offered || [],
        conf_data: settings.conf_data || null
      };
      setFormData(initialData);
      setOriginalData(initialData);
      
      // Set previews for existing templates
      if (settings.template_front) setTemplateFrontPreview(settings.template_front);
      if (settings.template_back) setTemplateBackPreview(settings.template_back);
      if (settings.conf_data) setConfDataFileName('Existing configuration file');
      
      setFileUploads({ template_front: null, template_back: null, conf_data: null });
    }
  }, [settings]);

  // Detect changes
  const hasChanges = useMemo(() => {
    if (!originalData || Object.keys(originalData).length === 0) return false;

    // Check if any form field has changed
    const fieldChanged = Object.keys(formData).some(key => {
      if (key === 'template_front' || key === 'template_back' || key === 'conf_data') return false;
      if (key === 'courses_offered') {
        return JSON.stringify(formData[key]) !== JSON.stringify(originalData[key]);
      }
      return formData[key] !== originalData[key];
    });

    // Check if new files are selected
    const fileChanged = fileUploads.template_front !== null || 
                       fileUploads.template_back !== null || 
                       fileUploads.conf_data !== null;

    return fieldChanged || fileChanged;
  }, [formData, originalData, fileUploads]);

  // Course management functions
  const handleAddCourse = () => {
    if (newCourse.trim() && !formData.courses_offered.includes(newCourse.trim())) {
      setFormData(prev => ({
        ...prev,
        courses_offered: [...prev.courses_offered, newCourse.trim()]
      }));
      setNewCourse('');
    }
  };

  const handleAddBulkCourses = () => {
    if (!bulkCoursesText.trim()) return;

    const courses = bulkCoursesText
      .split('\n')
      .map(course => course.trim())
      .filter(course => course.length > 0 && !formData.courses_offered.includes(course));

    if (courses.length > 0) {
      setFormData(prev => ({
        ...prev,
        courses_offered: [...prev.courses_offered, ...courses]
      }));
      setBulkCoursesText('');
    }
  };

  const parseCoursesFromText = (text) => {
    return text
      .split(/[\n,;]+/)
      .map(course => course.trim())
      .filter(course => course.length > 0);
  };

  const handleBulkCoursePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const courses = parseCoursesFromText(pastedText);
    
    if (courses.length > 1) {
      e.preventDefault();
      const newCourses = courses.filter(course => 
        course.length > 0 && !formData.courses_offered.includes(course)
      );
      
      if (newCourses.length > 0) {
        setFormData(prev => ({
          ...prev,
          courses_offered: [...prev.courses_offered, ...newCourses]
        }));
        setBulkCoursesText('');
      }
    }
  };

  const handleRemoveCourse = (courseToRemove) => {
    setFormData(prev => ({
      ...prev,
      courses_offered: prev.courses_offered.filter(course => course !== courseToRemove)
    }));
  };

  const handleClearAllCourses = () => {
    setFormData(prev => ({
      ...prev,
      courses_offered: []
    }));
  };

  const handleCourseKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCourse();
    }
  };

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (fileType, file) => {
    // Check if file is valid
    if (!file || !(file instanceof File)) {
      console.error('Invalid file provided:', file);
      return;
    }

    setFileUploads(prev => ({
      ...prev,
      [fileType]: file
    }));

    // Only create preview for image files
    if (fileType === 'template_front' || fileType === 'template_back') {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          if (fileType === 'template_front') {
            setTemplateFrontPreview(reader.result);
          } else {
            setTemplateBackPreview(reader.result);
          }
        }
      };
      reader.onerror = () => {
        console.error('Error reading file:', file.name);
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'conf_data') {
      setConfDataFileName(file.name);
    }
  };

  const clearFile = (field) => {
    setFileUploads(prev => ({
      ...prev,
      [field]: null
    }));
    
    if (field === 'template_front') {
      setTemplateFrontPreview(null);
    } else if (field === 'template_back') {
      setTemplateBackPreview(null);
    } else if (field === 'conf_data') {
      setConfDataFileName('');
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      setSubmitError('No changes detected');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const method = settings ? 'PATCH' : 'POST';
      const url = settings ? `${SETTINGS_API_URL}${settings.id}/` : SETTINGS_API_URL;

      const changedFields = {};
      Object.keys(formData).forEach(key => {
        if (key === 'template_front' || key === 'template_back' || key === 'conf_data') return;
        if (key === 'courses_offered') {
          if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
            changedFields[key] = formData[key];
          }
        } else if (formData[key] !== originalData[key]) {
          changedFields[key] = formData[key];
        }
      });

      const formDataToSend = new FormData();

      // Append all changed form fields
      Object.keys(changedFields).forEach(key => {
        if (key === 'courses_offered') {
          formDataToSend.append(key, JSON.stringify(changedFields[key]));
        } else {
          formDataToSend.append(key, changedFields[key]);
        }
      });

      // Append new files
      if (fileUploads.template_front) {
        formDataToSend.append('template_front', fileUploads.template_front);
      }
      if (fileUploads.template_back) {
        formDataToSend.append('template_back', fileUploads.template_back);
      }
      if (fileUploads.conf_data) {
        formDataToSend.append('conf_data', fileUploads.conf_data);
      }

      const updatedData = await formDataFetcher(url, {
        method,
        body: formDataToSend
      });

      // Update local state with fresh data
      const newValues = {
        qrcode: updatedData.qrcode ?? false,
        barcode: updatedData.barcode ?? true,
        expected_total: updatedData.expected_total ?? 0,
        min_admission_year: updatedData.min_admission_year ?? new Date().getFullYear(),
        notification_pref: updatedData.notification_pref ?? 'sms',
        template_front: updatedData.template_front || '',
        template_back: updatedData.template_back || '',
        courses_offered: updatedData.courses_offered || [],
        conf_data: updatedData.conf_data || null
      };

      setFormData(newValues);
      setOriginalData(newValues);
      setFileUploads({ template_front: null, template_back: null, conf_data: null });
      
      // Reset previews and file inputs
      setTemplateFrontPreview(updatedData.template_front || null);
      setTemplateBackPreview(updatedData.template_back || null);
      setConfDataFileName(updatedData.conf_data ? 'Existing configuration file' : '');

      if (onUpdate) {
        onUpdate();
      }

      setIsEditing(false);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSubmitError('');
    if (settings) {
      const resetData = {
        qrcode: settings.qrcode || false,
        barcode: settings.barcode !== undefined ? settings.barcode : true,
        expected_total: settings.expected_total || 0,
        min_admission_year: settings.min_admission_year || new Date().getFullYear(),
        notification_pref: settings.notification_pref || 'sms',
        template_front: settings.template_front || '',
        template_back: settings.template_back || '',
        courses_offered: settings.courses_offered || [],
        conf_data: settings.conf_data || null
      };
      setFormData(resetData);
      setOriginalData(resetData);
      setTemplateFrontPreview(settings.template_front || null);
      setTemplateBackPreview(settings.template_back || null);
      setConfDataFileName(settings.conf_data ? 'Existing configuration file' : '');
    }
    setFileUploads({ template_front: null, template_back: null, conf_data: null });
    setNewCourse('');
    setBulkCoursesText('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <p>Error loading template settings: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Institution Settings
          </h3>
          {settings && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Update Settings
            </button>
          )}
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {submitError}
          </div>
        )}

        {settings || isEditing ? (
          isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* QR Code and Barcode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="qrcode"
                    name="qrcode"
                    checked={formData.qrcode}
                    onChange={handleInputChange}
                    className={`h-5 w-5 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-teal-500 text-teal-600`}
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
                    className={`h-5 w-5 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-teal-500 text-teal-600`}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="barcode" className={`ml-2 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enable Barcode
                  </label>
                </div>
              </div>

              {/* Expected Total and Minimum Admission Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Expected Total Number of Students
                  </label>
                  <input
                    type="number"
                    name="expected_total"
                    value={formData.expected_total}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter expected number of students"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Minimum Admission Year
                  </label>
                    <input
                      type="number"
                      name="min_admission_year"
                      value={formData.min_admission_year}
                      onChange={handleInputChange}
                      min="2020"
                      max={currentYear}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                    <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Must be between 2020 and {currentYear}
                    </p>
                  </div>
                </div>

                {/* Notification Preference */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notification Preference
                  </label>
                  <select
                    name="notification_pref"
                    value={formData.notification_pref}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  >
                    <option value="">Select Notification Preference</option>
                    {NOTIFICATION_CHOICES.map((choice) => (
                      <option key={choice.value} value={choice.value}>{choice.label}</option>
                    ))}
                  </select>
                </div>

                {/* Courses Offered */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                        className={`flex-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
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
                        className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                        placeholder="Enter courses (one per line)"
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
                          className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium'} `}
                          disabled={isSubmitting}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {formData.courses_offered.length > 0 && (
                    <div className={`mt-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                        {formData.courses_offered.map((course, index) => (
                          <div 
                            key={index}
                            className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
                              darkMode ? 'bg-gray-600 text-gray-200 border border-gray-500' : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                          >
                            <span className="truncate" title={course}>{course}</span>
                            <button 
                              type="button"
                              onClick={() => handleRemoveCourse(course)}
                              className="ml-2 text-xs font-bold hover:text-red-500 flex-shrink-0"
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Front Upload */}
                <FileUploadField
                  label="Front Template (Optional)"
                  name="template_front"
                  value={fileUploads.template_front}
                  onChange={(file) => {
                    if (file) {
                      handleFileChange('template_front', file);
                    } else {
                      clearFile('template_front');
                    }
                  }}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  darkMode={darkMode}
                  disabled={isSubmitting}
                  previewUrl={templateFrontPreview}
                  existingFileUrl={settings?.template_front}
                  maxSizeMB={5}
                  fileType="image"
                />

                {/* Template Back Upload */}
                <FileUploadField
                  label="Back Template (Optional)"
                  name="template_back"
                  value={fileUploads.template_back}
                  onChange={(file) => {
                    if (file) {
                      handleFileChange('template_back', file);
                    } else {
                      clearFile('template_back');
                    }
                  }}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  darkMode={darkMode}
                  disabled={isSubmitting}
                  previewUrl={templateBackPreview}
                  existingFileUrl={settings?.template_back}
                  maxSizeMB={5}
                  fileType="image"
                />

                {/* Configuration Data Upload */}
                <FileUploadField
                  label="Configuration Data (Optional)"
                  name="conf_data"
                  value={fileUploads.conf_data}
                  onChange={(file) => {
                    if (file) {
                      handleFileChange('conf_data', file);
                    } else {
                      clearFile('conf_data');
                    }
                  }}
                  accept=".xlsx,.csv,.json"
                  darkMode={darkMode}
                  disabled={isSubmitting}
                  existingFileUrl={settings?.conf_data}
                  maxSizeMB={10}
                  fileType="document"
                />

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      darkMode 
                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                      hasChanges && !isSubmitting
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                    disabled={!hasChanges || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Update Settings
                      </>
                    )}
                  </button>
                </div>

                {hasChanges && (
                  <div className="mt-2 text-xs text-teal-600 dark:text-teal-400">
                    Changes detected — submit button enabled
                  </div>
                )}
              </form>
            ) : (
              // View Mode - Display current settings
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <QrCode className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>QR Code</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {settings.qrcode ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <BarChart3 className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Barcode</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {settings.barcode ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Expected Students</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {settings.expected_total?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Min Admission Year</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {settings.min_admission_year}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Bell className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notification Preference</p>
                    <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {NOTIFICATION_CHOICES.find(choice => choice.value === settings.notification_pref)?.label || settings.notification_pref}
                    </p>
                  </div>
                </div>

                {/* Enhanced Courses Display */}
                <CoursesDisplay 
                  courses={settings.courses_offered} 
                  darkMode={darkMode}
                  onEdit={() => setIsEditing(true)}
                  isEditing={true}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {settings.template_front && (
                    <div className="flex items-start space-x-3">
                      <ImageIcon className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Front Template</p>
                        <img 
                          src={settings.template_front} 
                          alt="Front Template" 
                          className="w-48 h-32 object-contain border rounded mt-2"
                        />
                      </div>
                    </div>
                  )}

                  {settings.template_back && (
                    <div className="flex items-start space-x-3">
                      <ImageIcon className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Back Template</p>
                        <img 
                          src={settings.template_back} 
                          alt="Back Template" 
                          className="w-48 h-32 object-contain border rounded mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {settings.conf_data && (
                  <div className="flex items-start space-x-3">
                    <FileText className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Configuration Data</p>
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Configuration file uploaded
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Calendar className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last Updated</p>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {settings.updated_at ? new Date(settings.updated_at).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8 flex flex-col gap-7">
              <div>
                <Settings className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Institution settings not configured
                </p>
              </div>
              <div className="text-center">
                <a
                  href='/institution/settings'
                  className="px-8 bg-teal-600 hover:bg-teal-700 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
                >
                  Configure Settings
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dashboard Page Component
  const DashboardPage = ({ students, loading, error, darkMode, refreshData, settingsData, settingsLoading, institutionData, onSuccess }) => {
    const [searchName, setSearchName] = useState('');
    const [searchRegNo, setSearchRegNo] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const { balancesData } = useBalancesData(token);

    const debouncedSetSearchName = useCallback(debounce(setSearchName, 300), []);
    const debouncedSetSearchRegNo = useCallback(debounce(setSearchRegNo, 300), []);

    // Calculate summary stats
    const summaryStats = useMemo(() => {
      if (!students) {
        return {
          totalSubmitted: 0,
          pending: 0,
          processing: 0,
          ready: 0,
          expected: 0
        };
      }

      const totalSubmitted = students.length;
      const pending = students.filter(s => s.status === 'pending').length;
      const processing = students.filter(s => s.status === 'processing').length;
      const ready = students.filter(s => s.status === 'ready' || s.status === 'id_ready').length;
      
      // Get expected total from settings data
      const settings = Array.isArray(settingsData) && settingsData.length > 0 ? settingsData[0] : null;
      const expected = settings?.expected_total || 0;

      return { totalSubmitted, pending, processing, ready, expected };
    }, [students, settingsData]);

    // Filter students based on search and status
    const filteredStudents = useMemo(() => {
      if (!students) return [];
      
      return students.filter(student => {
        const nameMatch = searchName === '' || 
          `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchName.toLowerCase());
        const regNoMatch = searchRegNo === '' || 
          student.reg_no.toLowerCase().includes(searchRegNo.toLowerCase());
        const statusMatch = filterStatus === 'all' || student.status === filterStatus;
        
        return nameMatch && regNoMatch && statusMatch;
      });
    }, [students, searchName, searchRegNo, filterStatus]);

    const getStatusInfo = (status) => {
      return statusMap[status] || statusMap.default;
    };

    const resultCount = filteredStudents.length;
    const hasFilters = searchName || searchRegNo || filterStatus !== 'all';

    // NEW: Check if balancesData is an empty object or empty array
    const isEmptyBalanceData = useMemo(() => {
      if (!balancesData) return true;
      
      if (Array.isArray(balancesData)) {
        return balancesData.length === 0;
      }
      
      if (typeof balancesData === 'object') {
        return Object.keys(balancesData).length === 0;
      }
      
      return false;
    }, [balancesData]);

    return (
      <div className="space-y-6 md:space-y-8">
        {/* Payment Balance Section - Only show if not empty */}
        {!isEmptyBalanceData && (
          <PaymentBalanceSection 
            darkMode={darkMode}
            institutionData={institutionData}
            onSuccess={onSuccess}
          />
        )}

        {/* Registration Links Section */}
        <RegistrationLinksSection 
          darkMode={darkMode}
          institutionData={institutionData}
          settingsData={settingsData}
          onSuccess={onSuccess}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            title="Expected Total" 
            value={settingsLoading ? '...' : summaryStats.expected.toLocaleString()} 
            icon={<Clock />} 
            darkMode={darkMode} 
          />
          <StatCard 
            title="Total Students Submitted" 
            value={loading ? '...' : summaryStats.totalSubmitted.toLocaleString()} 
            icon={<Users />} 
            darkMode={darkMode} 
          />
          <StatCard 
            title="Processing" 
            value={loading ? '...' : summaryStats.processing.toLocaleString()} 
            icon={<Activity />} 
            darkMode={darkMode} 
          />
          <StatCard 
            title="Ready for Delivery" 
            value={loading ? '...' : summaryStats.ready.toLocaleString()} 
            icon={<CheckCircle />} 
            darkMode={darkMode} 
          />
        </div>

        {/* Student Submissions Table */}
        <div className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Student Submissions
            </h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto gap-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-48 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  onChange={(e) => debouncedSetSearchName(e.target.value)}
                />
              </div>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
                <input
                  type="text"
                  placeholder="Search by reg no..."
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-48 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  onChange={(e) => debouncedSetSearchRegNo(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none w-full sm:w-40 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="application_received">Pending</option>
                  <option value="id_processing">Processing</option>
                  <option value="id_ready">Ready</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`} size={16} />
              </div>
            </div>
          </div>

          {/* Results summary */}
          <div className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {hasFilters ? (
              <span>Showing {resultCount} of {students?.length || 0} students</span>
            ) : (
              <span>Total: {students?.length || 0} students</span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <div className="flex items-center">
                <AlertTriangle className="mr-2" size={20} />
                <p>Error loading students: {error.message}</p>
              </div>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className={`${darkMode ? 'bg-gray-700/50 border-b border-gray-600' : 'bg-gray-50 border-b border-gray-200'}`}>
                  <tr>
                    <th className={`p-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Student Name</th>
                    <th className={`p-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Registration Number</th>
                    <th className={`p-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Submission Date</th>
                    <th className={`p-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredStudents.map(student => (
                    <tr key={student.id} className={`${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'} transition-colors`}>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={student.photo || `https://i.pravatar.cc/40?u=${student.id}`} 
                            alt={`${student.first_name} ${student.last_name}`} 
                            className="w-8 h-8 rounded-full object-cover mr-3" 
                          />
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.first_name} {student.last_name}</span>
                        </div>
                      </td>
                      <td className={`p-3 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{student.reg_no}</td>
                      <td className={`p-3 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(student.status).colorClass}`}>
                          {getStatusInfo(student.status).icon}
                          <span className="ml-1">{getStatusInfo(student.status).label}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {hasFilters ? 'No students match your search criteria' : 'No student submissions found'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  /// Notifications Page Component - FIXED
const NotificationsPage = ({ notificationsData, loading, error, darkMode, institutionData, onMarkAsRead }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleReportSuccess = () => {
    setShowSuccessNotification(true);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="text-blue-600 dark:text-blue-400" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />;
      case 'error':
        return <X className="text-red-600 dark:text-red-400" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-600 dark:text-green-400" size={20} />;
      default:
        return <Bell className="text-gray-600 dark:text-gray-400" size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'info':
        return darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50';
      case 'warning':
        return darkMode ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-500 bg-yellow-50';
      case 'error':
        return darkMode ? 'border-red-500 bg-red-900/20' : 'border-red-500 bg-red-50';
      case 'success':
        return darkMode ? 'border-green-500 bg-green-900/20' : 'border-green-500 bg-green-50';
      default:
        return darkMode ? 'border-gray-500 bg-gray-900/20' : 'border-gray-500 bg-gray-50';
    }
  };

  // Mark all notifications as read when the page is opened - FIXED
  useEffect(() => {
    if (notificationsData && notificationsData.length > 0 && onMarkAsRead) {
      onMarkAsRead();
    }
  }, [notificationsData]); // Removed onMarkAsRead from dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <p>Error loading notifications: {error.message}</p>
        </div>
      </div>
    );
  }

  const notifications = notificationsData || [];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Success Notification */}
      <SuccessNotification 
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        message="Issue reported successfully! We'll get back to you soon."
      />

      {/* Report Issue Form */}
      <ReportIssueForm 
        isOpen={showReportForm}
        onClose={() => setShowReportForm(false)}
        darkMode={darkMode}
        institutionData={institutionData}
        onSuccess={handleReportSuccess}
      />

      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>

        
        {notifications.length > 0 ? (
          <div className="space-y-4 flex flex-col-reverse">
            {notifications.map((notification, index) => (
              <div 
                key={notification.id || index} 
                className={`p-4 border-l-4 rounded-r-lg ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {notification.title || 'Notification'}
                    </h4>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No notifications available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component - FIXED
const InstitutionDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInstitutionPopup, setShowInstitutionPopup] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [readNotifications, setReadNotifications] = useState(new Set());

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    
    // Detect device theme preference
    const detectDeviceTheme = () => {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark;
      }
      return false;
    };

    // Load dark mode preference from localStorage or use device theme
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Use device theme as default if no preference is saved
      const deviceTheme = detectDeviceTheme();
      setDarkMode(deviceTheme);
    }

    // Load sidebar preference
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }

    // Load read notifications from localStorage
    const savedReadNotifications = localStorage.getItem('readNotifications');
    if (savedReadNotifications) {
      setReadNotifications(new Set(JSON.parse(savedReadNotifications)));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }
  }, [darkMode, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, isClient]);

  // Save read notifications to localStorage
  useEffect(() => {
    if (isClient && readNotifications.size > 0) {
      localStorage.setItem('readNotifications', JSON.stringify([...readNotifications]));
    }
  }, [readNotifications, isClient]);

  // Listen for system theme changes
  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [isClient]);

  // Get authentication token
  const token = isClient ? localStorage.getItem('access_token') : null;

  // Data fetching hooks
  const { institutionData, institutionError, institutionLoading, mutateInstitution } = useInstitutionData(token);
  const { students, error: studentsError, isLoading: studentsLoading, mutate: refreshStudents } = useStudentsData(token);
  const { settingsData, settingsError, settingsLoading, mutateSettings } = useSettingsData(token);
  const { notificationsData, notificationsError, notificationsLoading, mutateNotifications } = useNotificationsData(token);

  // Calculate unread notifications count
  const unreadCount = useMemo(() => {
    if (!notificationsData || !Array.isArray(notificationsData)) return 0;
    
    return notificationsData.filter(notification => 
      !readNotifications.has(notification.id)
    ).length;
  }, [notificationsData, readNotifications]);

  // Mark all notifications as read - FIXED with useCallback
  const markAllNotificationsAsRead = useCallback(() => {
    if (!notificationsData || !Array.isArray(notificationsData)) return;
    
    const newReadNotifications = new Set(readNotifications);
    let hasNewRead = false;
    
    notificationsData.forEach(notification => {
      if (notification.id && !newReadNotifications.has(notification.id)) {
        newReadNotifications.add(notification.id);
        hasNewRead = true;
      }
    });
    
    if (hasNewRead) {
      setReadNotifications(newReadNotifications);
    }
  }, [notificationsData, readNotifications]); // Proper dependencies

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    clearAllSessionCookies();
    window.location.href = '/institution/login';
  };

  const handleInstitutionUpdate = () => {
    mutateInstitution();
    setSuccessMessage('Institution details updated successfully!');
    setShowSuccessNotification(true);
  };

  const handleSettingsUpdate = () => {
    mutateSettings();
    setSuccessMessage('Template settings updated successfully!');
    setShowSuccessNotification(true);
  };

  const handleRegistrationLinksSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessNotification(true);
  };

  const renderMainContent = () => {
    switch (activePage) {
      case 'template-settings':
        return <TemplateSettingsPage 
          settingsData={settingsData}
          loading={settingsLoading} 
          error={settingsError} 
          darkMode={darkMode}
          onUpdate={handleSettingsUpdate}
        />;
      case 'payments':
        return <PaymentsPage 
          darkMode={darkMode}
          institutionData={institutionData}
          onSuccess={handleRegistrationLinksSuccess}
        />;
      case 'notifications':
        return <NotificationsPage 
          notificationsData={notificationsData} 
          loading={notificationsLoading} 
          institutionData={institutionData}
          error={notificationsError} 
          darkMode={darkMode}
          onMarkAsRead={markAllNotificationsAsRead}
        />;
      default:
        return <DashboardPage 
          students={students} 
          loading={studentsLoading} 
          error={studentsError} 
          darkMode={darkMode} 
          refreshData={refreshStudents}
          settingsData={settingsData}
          settingsLoading={settingsLoading}
          institutionData={institutionData}
          onSuccess={handleRegistrationLinksSuccess}
        />;
    }
  };

  const NavItem = ({ icon, label, pageName, isMobile = false, onClick, badgeCount = 0 }) => (
    <button 
      onClick={() => { 
        if (onClick) {
          onClick();
        } else {
          setActivePage(pageName); 
          if(isMobile) toggleMobileMenu(); 
        }
      }}
      className={`w-full flex items-center p-3 rounded-lg transition-colors relative
        ${activePage === pageName 
          ? `bg-teal-600 text-white` 
          : `${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
        ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
      `}
      title={label}
    >
      <div className="relative">
        {icon}
        {badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
      </div>
      {(sidebarOpen || isMobile) && <span className="ml-3 truncate">{label}</span>}
    </button>
  );

  // Get institution logo or fallback to default
  const getProfileImage = () => {
    const institution = Array.isArray(institutionData) ? institutionData[0] : institutionData;
    if (institution && institution.logo) {
      return institution.logo;
    }
    return "https://api.dicebear.com/8.x/initials/svg?seed=Admin&backgroundColor=0D8ABC&textColor=#0d9488";
  };

  // Get institution name or fallback to default
  const getProfileName = () => {
    const institution = Array.isArray(institutionData) ? institutionData[0] : institutionData;
    if (institution) {
      return institution.name;
    }
    return "Admin User";
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <AcessTokenProtectedPage>
      <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-200 dark' : 'bg-gray-100 text-gray-800'}`}>
        {/* Success Notification */}
        <SuccessNotification 
          isVisible={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          message={successMessage}
        />

        {/* Institution Details Popup */}
        <InstitutionDetailsPopup 
          institutionData={institutionData}
          isOpen={showInstitutionPopup}
          onClose={() => setShowInstitutionPopup(false)}
          darkMode={darkMode}
          onUpdate={handleInstitutionUpdate}
        />

        {/* Desktop Sidebar */}
        <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            key="desktop-sidebar-expanded"
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: '16rem', opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`hidden lg:flex flex-col h-full ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} shadow-xl z-20`}
          >
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <LayoutDashboard className="text-teal-500 w-7 h-7 mr-2" />
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Instipass</span>
              </div>
              <button onClick={toggleSidebar} className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`} title="Collapse sidebar">
                <ChevronLeft size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" pageName="dashboard" />
              <NavItem icon={<Settings size={20}/>} label="Template Settings" pageName="template-settings" />
              <NavItem icon={<CreditCard size={20}/>} label="Payments" pageName="payments" />
              <NavItem 
                icon={<Bell size={20}/>} 
                label="Notifications" 
                pageName="notifications" 
                badgeCount={unreadCount}
              />
            </nav>
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button 
                onClick={toggleDarkMode} 
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <NavItem icon={<LogOut size={20}/>} label="Logout" pageName="logout" onClick={handleLogout} />
            </div>
          </motion.aside>
        )}
        </AnimatePresence>

        {/* Collapsed Desktop Sidebar */}
        <AnimatePresence>
        {!sidebarOpen && (
          <motion.aside 
            key="desktop-sidebar-collapsed"
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: '5rem', opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`hidden lg:flex flex-col h-full ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} shadow-xl z-20`}
          >
            <div className={`flex items-center justify-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={toggleSidebar} className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`} title="Expand sidebar">
                <ChevronRight size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" pageName="dashboard" />
              <NavItem icon={<Settings size={20}/>} label="Template Settings" pageName="template-settings" />
              <NavItem icon={<CreditCard size={20}/>} label="Payments" pageName="payments" />
              <NavItem 
                icon={<Bell size={20}/>} 
                label="Notifications" 
                pageName="notifications" 
                badgeCount={unreadCount}
              />
            </nav>
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
              <button 
                onClick={toggleDarkMode} 
                className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <NavItem icon={<LogOut size={20}/>} label="Logout" pageName="logout" onClick={handleLogout} />
            </div>
          </motion.aside>
        )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.aside 
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} shadow-xl flex flex-col`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <LayoutDashboard className="text-teal-500 w-7 h-7 mr-2" />
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Instipass</span>
                </div>
                <button onClick={toggleMobileMenu} className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`} title="Close menu">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" pageName="dashboard" isMobile={true} />
                <NavItem icon={<Settings size={20}/>} label="Template Settings" pageName="template-settings" isMobile={true} />
                <NavItem icon={<CreditCard size={20}/>} label="Payments" pageName="payments" isMobile={true} />
                <NavItem 
                  icon={<Bell size={20}/>} 
                  label="Notifications" 
                  pageName="notifications" 
                  isMobile={true}
                  badgeCount={unreadCount}
                />
              </nav>
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button 
                  onClick={toggleDarkMode} 
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <NavItem icon={<LogOut size={20}/>} label="Logout" pageName="logout" onClick={handleLogout} isMobile={true} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50" 
            onClick={toggleMobileMenu}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 md:px-6 py-4 flex items-center justify-between`}>
            <div className="flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className={`lg:hidden p-2 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'} mr-3`}
              >
                <Menu size={24} />
              </button>
              <h1 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {activePage === 'dashboard' ? 'Dashboard' : 
                 activePage === 'template-settings' ? 'Template Settings' :
                 activePage === 'payments' ? 'Payments' : 'Notifications'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationBell 
                darkMode={darkMode}
                unreadCount={unreadCount}
                onClick={() => setActivePage('notifications')}
              />
              <button 
                onClick={() => setShowInstitutionPopup(true)}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="View Institution Details"
              >
                <img 
                  src={getProfileImage()} 
                  alt="Institution Logo" 
                  className="w-8 h-8 rounded-full object-cover border" 
                />
                <span className={`hidden md:block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  {getProfileName()}
                </span>
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </AcessTokenProtectedPage>
  );
};

export default InstitutionDashboard;