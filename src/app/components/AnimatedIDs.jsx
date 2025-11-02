"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Camera, Edit, RefreshCw, Check, X, Download, Shield, QrCode, Sparkles } from 'lucide-react';

// Sample institution themes
const institutionThemes = [
  { name: 'Default', primary: '#1D3557', secondary: '#2A9D8F', accent: '#E76F51' },
  { name: 'Ivy League', primary: '#0F4D92', secondary: '#8B0000', accent: '#FFD700' },
  { name: 'Tech Institute', primary: '#6200EA', secondary: '#03DAC6', accent: '#CF6679' },
  { name: 'Medical School', primary: '#01579B', secondary: '#00897B', accent: '#D81B60' },
  { name: 'Arts College', primary: '#AD1457', secondary: '#6A1B9A', accent: '#00BCD4' },
];

// Sample department options
const departmentOptions = [
  'Computer Science',
  'Engineering',
  'Business Administration',
  'Medicine',
  'Arts & Humanities',
  'Natural Sciences'
];

// Sample student profiles
const studentProfiles = [
  {
    name: 'John Doe',
    department: 'Computer Science',
    id: '1234567890',
    validUntil: '06/2026',
    avatar: 1
  },
  {
    name: 'Emma Wilson',
    department: 'Medicine',
    id: '2345678901',
    validUntil: '05/2025',
    avatar: 2
  },
  {
    name: 'Michael Chen',
    department: 'Engineering',
    id: '3456789012',
    validUntil: '07/2027',
    avatar: 3
  },
  {
    name: 'Sophia Rodriguez',
    department: 'Business Administration',
    id: '4567890123',
    validUntil: '04/2026',
    avatar: 4
  }
];

// Custom CSS classes for 3D effects
const styles = {
  perspective: {
    perspective: "1000px"
  },
  transformStyle3d: {
    transformStyle: "preserve-3d"
  },
  backfaceHidden: {
    backfaceVisibility: "hidden"
  }
};

const AnimatedIDs = ({ darkMode }) => {
  // State for active card
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const autoRotateTimerRef = useRef(null);
  
  // State for card interactivity
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State for student info
  const [studentInfo, setStudentInfo] = useState(studentProfiles[0]);
  const [editFormData, setEditFormData] = useState({ ...studentProfiles[0] });
  
  // Ref for click outside detection
  const cardRef = useRef(null);
  
  // Auto-rotate through student profiles
  useEffect(() => {
    if (isAutoRotating) {
      autoRotateTimerRef.current = setInterval(() => {
        if (!isEditing && !isFlipped) {
          setActiveCardIndex((prev) => (prev + 1) % studentProfiles.length);
        }
      }, 5000);
    }
    
    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
      }
    };
  }, [isAutoRotating, isEditing, isFlipped]);
  
  // Update student info when active card changes
  useEffect(() => {
    setStudentInfo(studentProfiles[activeCardIndex]);
    setEditFormData(studentProfiles[activeCardIndex]);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  }, [activeCardIndex]);
  
  // Handle click outside to close editing mode
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsEditing(false);
        setShowAvatarSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Save edited information
  const saveChanges = () => {
    setStudentInfo(editFormData);
    setIsEditing(false);
    
    // Update the student profile in the array
    const updatedProfiles = [...studentProfiles];
    updatedProfiles[activeCardIndex] = editFormData;
    
    // Stop auto-rotation when user interacts
    setIsAutoRotating(false);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditFormData({ ...studentInfo });
    setIsEditing(false);
  };
  
  // Simulate verification process
  const verifyID = () => {
    setVerificationStatus('verifying');
    setTimeout(() => {
      setVerificationStatus('verified');
      setTimeout(() => {
        setVerificationStatus(null);
      }, 3000);
    }, 1500);
    
    // Stop auto-rotation when user interacts
    setIsAutoRotating(false);
  };
  
  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    
    // Stop auto-rotation when user interacts
    setIsAutoRotating(false);
  };
  
  // Get current theme colors
  const theme = institutionThemes[selectedTheme];
  
  return (
    <div className="flex flex-col items-center" ref={cardRef}>
      {/* Theme selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        <p className={`w-full text-center mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Choose institution theme:
        </p>
        {institutionThemes.map((theme, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setSelectedTheme(index);
              setIsAutoRotating(false);
            }}
            className={`w-8 h-8 rounded-full border-2 ${selectedTheme === index ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: theme.primary }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
      
      {/* Student profile selector */}
      <div className="mb-6 flex justify-center gap-2">
        {studentProfiles.map((profile, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setActiveCardIndex(index);
              setIsAutoRotating(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeCardIndex === index 
                ? `ring-2 ring-offset-2 ${darkMode ? 'ring-white' : 'ring-gray-800'}`
                : ''
            }`}
            style={{ 
              backgroundColor: index === activeCardIndex ? theme.primary : darkMode ? '#374151' : '#E5E7EB'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className={`text-sm font-bold ${index === activeCardIndex ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {profile.name.split(' ').map(name => name[0]).join('')}
            </span>
          </motion.button>
        ))}
      </div>
      
      {/* Card container with 3D flip effect */}
      <div className="relative w-full max-w-md" style={styles.perspective}>
        <motion.div 
          className="relative w-full transition-all duration-500"
          style={{ 
            ...styles.transformStyle3d,
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.6s"
          }}
        >
          {/* Front of card */}
          <motion.div 
            className="absolute w-full"
            style={styles.backfaceHidden}
            animate={isAnimating ? { scale: [0.95, 1], opacity: [0.8, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute -top-4 -left-4 w-full h-full rounded-xl"
              style={{ backgroundColor: theme.secondary, opacity: 0.2 }}
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(42, 157, 143, 0.3)", `0px 0px 20px ${theme.secondary}99`, "0px 0px 0px rgba(42, 157, 143, 0.3)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <motion.div 
              className="relative bg-white p-6 rounded-xl shadow-lg"
              whileHover={{ y: -5, boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <motion.button
                  onClick={handleFlip}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <RefreshCw size={20} />
                </motion.button>
                
                {!isEditing ? (
                  <motion.button
                    onClick={() => {
                      setIsEditing(true);
                      setIsAutoRotating(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Edit size={20} />
                  </motion.button>
                ) : (
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={saveChanges}
                      className="text-green-500 hover:text-green-700"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check size={20} />
                    </motion.button>
                    <motion.button
                      onClick={cancelEditing}
                      className="text-red-500 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                )}
              </div>
              
              <div style={{ backgroundColor: theme.primary }} className="text-white p-4 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">STUDENT ID</h3>
                    <p className="text-sm text-gray-300">Valid until: {studentInfo.validUntil}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.secondary }}>
                      <span className="font-bold text-white">IP</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex items-center space-x-4">
                <div 
                  className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center relative cursor-pointer"
                  onClick={() => !isEditing || setShowAvatarSelector(!showAvatarSelector)}
                >
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <UserPlus size={32} className="text-gray-400" />
                  </div>
                  
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                      <Camera size={12} className="text-gray-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Full Name"
                      />
                      <select
                        name="department"
                        value={editFormData.department}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        {departmentOptions.map((dept, index) => (
                          <option key={index} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="id"
                        value={editFormData.id}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="ID Number"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold" style={{ color: theme.primary }}>{studentInfo.name}</h4>
                      <p className="text-gray-600">{studentInfo.department}</p>
                      <p className="text-gray-600">ID: {studentInfo.id}</p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Avatar selector popup */}
              <AnimatePresence>
                {showAvatarSelector && isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 mt-2"
                  >
                    <p className="text-sm text-gray-600 mb-2">Select avatar:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((id) => (
                        <div
                          key={id}
                          className={`w-12 h-12 rounded-full bg-gray-200 cursor-pointer ${editFormData.avatar === id ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => {
                            setEditFormData({...editFormData, avatar: id});
                            setShowAvatarSelector(false);
                          }}
                        >
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-500">#{id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
          
          {/* Back of card */}
          <motion.div 
            className="absolute w-full"
            style={{ 
              ...styles.backfaceHidden,
              transform: "rotateY(180deg)"
            }}
          >
            <motion.div 
              className="absolute -top-4 -left-4 w-full h-full rounded-xl"
              style={{ backgroundColor: theme.accent, opacity: 0.2 }}
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(231, 111, 81, 0.3)", `0px 0px 20px ${theme.accent}99`, "0px 0px 0px rgba(231, 111, 81, 0.3)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <motion.div 
              className="relative bg-white p-6 rounded-xl shadow-lg"
              whileHover={{ y: -5, boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <motion.button
                  onClick={handleFlip}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <RefreshCw size={20} />
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    setShowQRCode(!showQRCode);
                    setIsAutoRotating(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <QrCode size={20} />
                </motion.button>
              </div>
              
              <div style={{ backgroundColor: theme.primary }} className="text-white p-4 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">VERIFICATION</h3>
                    <p className="text-sm text-gray-300">Secure Digital ID</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.secondary }}>
                      <span className="font-bold text-white">IP</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {showQRCode ? (
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-sm text-gray-500">QR Code Placeholder</div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">Scan to verify this ID</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Security Features</p>
                        <p className="text-xs text-gray-500">Encrypted with 256-bit security</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Download size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Offline Access</p>
                        <p className="text-xs text-gray-500">Available without internet connection</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <button
                        onClick={verifyID}
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"
                        disabled={verificationStatus === 'verifying'}
                      >
                        {verificationStatus === 'verifying' ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Verifying...
                          </div>
                        ) : verificationStatus === 'verified' ? (
                          <div className="flex items-center">
                            <Shield className="mr-2" size={18} />
                            Verified
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Shield className="mr-2" size={18} />
                            Verify ID
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            👆 Click the edit icon to customize, or flip icon to see the back
          </motion.span>
        </p>
        
        {/* Auto-rotate toggle */}
        <motion.button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`mt-4 flex items-center justify-center px-3 py-1 rounded-full text-xs ${
            isAutoRotating 
              ? 'bg-green-100 text-green-800' 
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={12} className="mr-1" />
          {isAutoRotating ? 'Auto-rotate: ON' : 'Auto-rotate: OFF'}
        </motion.button>
      </div>
    </div>
  );
};

export default AnimatedIDs;
