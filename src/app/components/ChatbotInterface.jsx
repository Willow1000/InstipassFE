"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Loader2, User, Bot, Move, Mic, MicOff, Square, Building, GraduationCap, Users } from 'lucide-react';

// Utility hook to detect if the screen is mobile (less than md breakpoint, 768px)
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial state
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
};

// FAQ Service with role detection and clarification
class FAQService {
  constructor() {
    this.faqData = {
      student: {
        "what is instipass": "Instipass produces physical student IDs while providing a fully digital application process. Instead of physically registering, students apply online and receive SMS updates as their ID moves through verification and processing stages.",
        
        "student portal": "No. Students do not have portals. Interactions are limited to the online application form and SMS notifications. Institutions manage everything else.",
        
        "payment": "No. Students do not make any payments. All financial responsibilities, including down payments and final payments, are handled entirely by the institution.",
        
        "how to apply": "Your institution provides a link to the online application. Complete the form, upload a clear passport-style photo, and submit. You will receive SMS confirmation once your application is successfully received.",
        
        "documents required": "A recent passport-style photo, student/admission number, and basic personal details. The form may list additional requirements.",
        
        "application confirmation": "Instipass sends an SMS confirmation once the application is successfully submitted.",
        
        "updates": "Automated SMS notifications are sent at key stages, such as verification, processing, and when your ID is ready for collection.",
        
        "id ready notification": "You will receive an SMS with instructions on where and when to collect your ID from your institution's designated point.",
        
        "where to collect": "At your institution's designated collection point. Your school will specify the location and schedule.",
        
        "edit application": "No. Once submitted, applications cannot be edited. Contact support or your institution immediately if there's an error.",
        
        "photo rejected": "Photos may be rejected if blurry, have filters or shadows, include busy backgrounds, or accessories like hats or sunglasses. Only clear passport-style photos with plain backgrounds are accepted.",
        
        "no sms": "Check that the phone number entered is correct. If it is and notifications still don't arrive, contact support.",
        
        "processing time": "Time varies based on institution payment timelines, student volume, and production workload. SMS updates will keep you informed.",
        
        "track id": "No. Manual tracking isn't needed. SMS updates are automatic at each key stage.",
        
        "delivery": "No. IDs are delivered in bulk to institutions. Students collect them per instructions from their school.",
        
        "cancel application": "Contact support immediately if you need changes or cancellation. Some corrections are possible if addressed early."
      },
      institution: {
        "get started": "Book a demo or contact Instipass support. You will be guided on onboarding, portal setup, and the ID application process.",
        
        "after registration": "An administrator from your staff is assigned and recognized by the system. This admin manages the portal, receives updates, and oversees student ID processing.",
        
        "admin role": "The admin monitors student submissions, manages ID preferences, receives notifications, and ensures smooth communication with Instipass.",
        
        "portal features": "Staff can view submissions, monitor processing, select templates, manage preferences, and track payment status. Students do not have portal access.",
        
        "institution payment": "Yes. Institutions handle all payments. Students are not charged.",
        
        "payment process": "Two stages: a down payment before production and a final payment before delivery of IDs.",
        
        "verification": "Instipass verifies applications internally. Institutions do not manually review each submission.",
        
        "customize design": "Yes. Choose from templates or request custom designs including branding, colors, and logos.",
        
        "production time": "Depends on student volume, payment completion, and production workload. Real-time updates are sent to the admin.",
        
        "delivery method": "All IDs are printed and delivered to the institution. Admin receives notifications when dispatched.",
        
        "student notifications": "Instipass sends SMS notifications automatically when IDs are ready for collection.",
        
        "change admin": "Yes. Contact support to request an admin change.",
        
        "delayed payment": "Production pauses until payment is made. Students may still receive general updates.",
        
        "priority processing": "Yes, subject to workload. Contact support to arrange priority.",
        
        "integration": "Integration may be available depending on your institution's needs. Contact support to explore options."
      },
      general: {
        "what does instipass do": "Produces physical student IDs while providing a smooth, fully digital application process for students and a management portal for institutions.",
        
        "why digital": "Eliminates long queues, manual errors, and delays. Students apply online, institutions manage everything centrally.",
        
        "communication channels": "Automated SMS notifications for students; portal notifications for institutions.",
        
        "data security": "Yes. Data is processed securely under strict agreements with each institution."
      },
      support: {
        "technical issues": "Contact Instipass support immediately. Provide a detailed description, including screenshots if possible, to help resolve the issue quickly.",
        
        "sms issues": "Confirm your phone number is correct and can receive messages. If it is correct, contact support to verify your submission.",
        
        "incorrect information": "The institution admin should contact support with correct information for updating.",
        
        "system errors": "Any manual verification issues or anomalies should be reported to support with all relevant details.",
        
        "custom features": "Contact support to discuss requirements or integrations. Instipass can tailor features based on your needs.",
        
        "onboarding": "Book a demo or contact support to get guidance on onboarding and portal setup.",
        
        "bugs": "Direct all such cases to Instipass support. Always include a detailed description and any evidence like screenshots."
      }
    };

    this.confirmedUserType = null;
  }

  detectUserTypeFromMessage(prompt, conversationHistory = []) {
    const lowerPrompt = prompt.toLowerCase();
    const fullConversation = conversationHistory.map(msg => msg.text).join(' ').toLowerCase();

    // Clear user role declarations
    if (lowerPrompt.includes('i am a student') || lowerPrompt.includes('i\'m a student') || 
        lowerPrompt.includes('as a student') || lowerPrompt.includes('student here') ||
        lowerPrompt.includes('my student') || lowerPrompt.includes('apply for my id')) {
      return 'student';
    }

    if (lowerPrompt.includes('i am from') || lowerPrompt.includes('our institution') || 
        lowerPrompt.includes('we are an institution') || lowerPrompt.includes('institution admin') ||
        lowerPrompt.includes('our students') || lowerPrompt.includes('institution portal')) {
      return 'institution';
    }

    if (lowerPrompt.includes('i want to partner') || lowerPrompt.includes('our school wants') || 
        lowerPrompt.includes('interested in partnership') || lowerPrompt.includes('become a partner') ||
        lowerPrompt.includes('demo for our institution') || lowerPrompt.includes('register our institution')) {
      return 'prospective';
    }

    // Role selection responses
    if (lowerPrompt.includes('student') || lowerPrompt === '1') {
      return 'student';
    }
    if (lowerPrompt.includes('institution') || lowerPrompt === '2') {
      return 'institution';
    }
    if (lowerPrompt.includes('prospective') || lowerPrompt.includes('partner') || lowerPrompt === '3') {
      return 'prospective';
    }

    // Context-based detection
    const studentKeywords = [
      'my id', 'my application', 'collect my id', 'when will i get', 'my photo',
      'i applied', 'my student id', 'get my id', 'pick up my id', 'student card'
    ];

    const institutionKeywords = [
      'our students', 'bulk upload', 'admin portal', 'institution dashboard',
      'student management', 'payment invoice', 'our institution', 'portal login'
    ];

    const prospectiveKeywords = [
      'partnership', 'register institution', 'sign up our', 'demo meeting',
      'pricing package', 'features benefits', 'start using instipass'
    ];

    let studentScore = studentKeywords.filter(keyword => 
      lowerPrompt.includes(keyword) || fullConversation.includes(keyword)
    ).length;

    let institutionScore = institutionKeywords.filter(keyword => 
      lowerPrompt.includes(keyword) || fullConversation.includes(keyword)
    ).length;

    let prospectiveScore = prospectiveKeywords.filter(keyword => 
      lowerPrompt.includes(keyword) || fullConversation.includes(keyword)
    ).length;

    // If we have a confirmed user type, use it
    if (this.confirmedUserType) {
      return this.confirmedUserType;
    }

    // Return the highest scoring type, but only if significantly higher than others
    const scores = [studentScore, institutionScore, prospectiveScore];
    const maxScore = Math.max(...scores);
    const totalScore = studentScore + institutionScore + prospectiveScore;

    if (maxScore === 0 || maxScore <= 1) {
      return 'unclear';
    }

    if (studentScore === maxScore && studentScore > institutionScore && studentScore > prospectiveScore) {
      return 'student';
    } else if (institutionScore === maxScore && institutionScore > studentScore && institutionScore > prospectiveScore) {
      return 'institution';
    } else if (prospectiveScore === maxScore && prospectiveScore > studentScore && prospectiveScore > institutionScore) {
      return 'prospective';
    }

    return 'unclear';
  }

  setConfirmedUserType(userType) {
    this.confirmedUserType = userType;
  }

  findBestMatch(query, userType) {
    const lowerQuery = query.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    // Search in user type specific FAQs first
    if (this.faqData[userType]) {
      for (const [key, answer] of Object.entries(this.faqData[userType])) {
        const score = this.calculateMatchScore(lowerQuery, key);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = { answer, section: userType };
        }
      }
    }

    // Search in general FAQs
    for (const [key, answer] of Object.entries(this.faqData.general)) {
      const score = this.calculateMatchScore(lowerQuery, key);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { answer, section: 'general' };
      }
    }

    // Search in support FAQs
    for (const [key, answer] of Object.entries(this.faqData.support)) {
      const score = this.calculateMatchScore(lowerQuery, key);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { answer, section: 'support' };
      }
    }

    return bestScore > 0.3 ? bestMatch : null;
  }

  calculateMatchScore(query, faqKey) {
    const queryWords = query.split(' ').filter(word => word.length > 2);
    const faqWords = faqKey.split(' ').filter(word => word.length > 2);
    
    if (queryWords.length === 0 || faqWords.length === 0) return 0;
    
    let matches = 0;
    queryWords.forEach(qWord => {
      faqWords.forEach(fWord => {
        if (qWord.includes(fWord) || fWord.includes(qWord)) {
          matches++;
        }
      });
    });
    
    return matches / Math.max(queryWords.length, faqWords.length);
  }

  generateResponse(prompt, conversationHistory = [], currentUserType = 'unclear') {
    // Handle role selection
    const lowerPrompt = prompt.toLowerCase().trim();
    
    if (lowerPrompt === '1' || lowerPrompt === 'student') {
      this.setConfirmedUserType('student');
      return {
        response: "Great! I'll help you with student-related questions about ID applications, photo requirements, SMS notifications, and collection processes. What would you like to know?",
        userType: 'student',
        confirmed: true
      };
    }

    if (lowerPrompt === '2' || lowerPrompt === 'institution') {
      this.setConfirmedUserType('institution');
      return {
        response: "Excellent! I'll assist you with institution portal access, student management, payments, and administrative functions. What would you like to know?",
        userType: 'institution',
        confirmed: true
      };
    }

    if (lowerPrompt === '3' || lowerPrompt === 'prospective' || lowerPrompt === 'partner') {
      this.setConfirmedUserType('prospective');
      return {
        response: "Perfect! I can provide information about partnership opportunities, institution registration, and platform features. What would you like to know?",
        userType: 'prospective',
        confirmed: true
      };
    }

    // Detect user type from conversation
    const detectedUserType = this.detectUserTypeFromMessage(prompt, conversationHistory);
    
    // If user type is unclear and we don't have a confirmed type, ask for clarification
    if (detectedUserType === 'unclear' && !this.confirmedUserType) {
      return {
        response: "I'd love to help you! To give you the most accurate information, could you please tell me if you are:\n\n1. A **Student** - asking about ID applications, photos, or collection\n2. An **Institution** - asking about admin portal, payments, or student management\n3. A **Prospective Partner** - interested in partnership or registration\n\nJust type 1, 2, or 3, or tell me which category you belong to.",
        userType: 'unclear',
        needsClarification: true
      };
    }

    // Use confirmed user type or detected type
    const userTypeToUse = this.confirmedUserType || detectedUserType;

    // Try to find FAQ match
    const match = this.findBestMatch(prompt, userTypeToUse);

    if (match) {
      return {
        response: match.answer,
        userType: userTypeToUse,
        confirmed: !!this.confirmedUserType
      };
    }

    // Default responses based on user type
    const defaultResponses = {
      student: "I can help you with student ID applications, photo requirements, SMS notifications, and collection procedures. Please ask about any specific aspect of the student ID process, and I'll provide the exact information from our FAQ.",
      institution: "I can assist with institution portal access, payment processes, student management, and administrative functions. Please ask about any specific institutional process, and I'll provide the exact information from our FAQ.",
      prospective: "For partnership inquiries, institution registration, or demo requests, please contact our partnerships team directly. I can provide general information about Instipass services from our FAQ.",
      general: "I'm here to help with Instipass services. Please ask about student applications, institutional processes, or general information, and I'll provide the exact answer from our FAQ."
    };

    return {
      response: defaultResponses[userTypeToUse] || defaultResponses.general,
      userType: userTypeToUse,
      confirmed: !!this.confirmedUserType
    };
  }
}

// Initialize FAQ service
const faqService = new FAQService();

// User Type Indicator Component
const UserTypeIndicator = ({ userType }) => {
  const getIcon = () => {
    switch (userType) {
      case 'student': return <GraduationCap className="w-3 h-3" />;
      case 'institution': return <Building className="w-3 h-3" />;
      case 'prospective': return <Users className="w-3 h-3" />;
      case 'unclear': return <User className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  const getLabel = () => {
    switch (userType) {
      case 'student': return 'Student';
      case 'institution': return 'Institution';
      case 'prospective': return 'Prospective Partner';
      case 'unclear': return 'Role Not Set';
      default: return 'User';
    }
  };

  const getColor = () => {
    switch (userType) {
      case 'student': return 'bg-blue-500';
      case 'institution': return 'bg-green-500';
      case 'prospective': return 'bg-purple-500';
      case 'unclear': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${getColor()} ml-2`}>
      {getIcon()}
      <span className="ml-1">{getLabel()}</span>
    </div>
  );
};

// Role Selection Buttons Component
const RoleSelectionButtons = ({ onRoleSelect, darkMode }) => {
  return (
    <div className="flex flex-col space-y-2 mt-3">
      <span className="text-sm font-medium">Select your role:</span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onRoleSelect('student')}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
          }`}
        >
          👨‍🎓 Student
        </button>
        <button
          onClick={() => onRoleSelect('institution')}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-100 hover:bg-green-200 text-green-800'
          }`}
        >
          🏫 Institution
        </button>
        <button
          onClick={() => onRoleSelect('prospective')}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            darkMode 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
          }`}
        >
          🤝 Prospective Partner
        </button>
      </div>
    </div>
  );
};

// Main Chatbot Component
const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Instipass FAQ Assistant. I can help students, institutions, and prospective partners with questions about our student ID services.\n\nTo give you the best assistance, could you tell me which category you belong to?",
      isUser: false, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userType: 'unclear',
      showRoleButtons: true
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentUserType, setCurrentUserType] = useState('unclear');
  const [needsRoleClarification, setNeedsRoleClarification] = useState(true);
  
  // Desktop-only dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognitionError, setRecognitionError] = useState('');
  
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);
  const recognitionRef = useRef(null);

  // Custom hook to determine if we are on a mobile screen
  const isMobileView = useIsMobile(768);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setRecognitionError('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }

        setInterimTranscript(interim);
        
        if (finalTranscript) {
          setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
          setInterimTranscript('');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setRecognitionError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
    } else {
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Listen for theme changes
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

  // Set initial position when opening (Desktop only)
  useEffect(() => {
    if (isOpen && !isMobileView) {
      const modalWidth = 384;
      const modalHeight = 500;
      setPosition({
        x: window.innerWidth - modalWidth - 24,
        y: window.innerHeight - modalHeight - 24
      });
    }
  }, [isOpen, isMobileView]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Speech recognition functions
  const startListening = () => {
    if (recognitionRef.current && isSpeechSupported) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setRecognitionError('Failed to start speech recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isSpeechSupported) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    const roleMessages = {
      student: "I'm a student asking about ID applications",
      institution: "I'm from an institution asking about admin portal",
      prospective: "I'm interested in partnership for our institution"
    };

    setInput(roleMessages[role]);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Handle send message with FAQ-based responses
  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userType: currentUserType
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
    setApiError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = faqService.generateResponse(input.trim(), messages, currentUserType);
      
      const botResponse = {
        id: Date.now() + 1,
        text: response.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userType: response.userType,
        showRoleButtons: response.needsClarification
      };
      
      setCurrentUserType(response.userType);
      setNeedsRoleClarification(response.needsClarification || false);
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      setApiError('Failed to generate response. Please try again.');
      
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "I'm currently experiencing technical difficulties. Please try again in a moment or contact Instipass support directly for immediate assistance.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userType: currentUserType
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setApiError('');
      setRecognitionError('');
      // Reset to initial state when reopening
      if (isOpen === false) {
        setMessages([
          { 
            id: 1, 
            text: "Hello! I'm Instipass FAQ Assistant. I can help students, institutions, and prospective partners with questions about our student ID services.\n\nTo give you the best assistance, could you tell me which category you belong to?",
            isUser: false, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            userType: 'unclear',
            showRoleButtons: true
          },
        ]);
        setCurrentUserType('unclear');
        setNeedsRoleClarification(true);
        faqService.confirmedUserType = null;
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    if (isMobileView) return;
    if (e.target.closest('input, button, a')) return;
    
    const modalRect = modalRef.current.getBoundingClientRect();
    const offsetX = e.clientX - modalRect.left;
    const offsetY = e.clientY - modalRect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || isMobileView) return;
    
    requestAnimationFrame(() => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setPosition({
        x: newX,
        y: newY
      });
    });
  }, [isDragging, dragOffset, isMobileView]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || isMobileView) return;
    
    setIsDragging(false);
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const modalWidth = 384;
    const modalHeight = 500;

    setPosition(prev => ({
      x: Math.max(0, Math.min(prev.x, viewportWidth - modalWidth)),
      y: Math.max(0, Math.min(prev.y, viewportHeight - modalHeight))
    }));
  }, [isDragging, isMobileView]);

  useEffect(() => {
    if (isDragging && !isMobileView) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, isMobileView]);

  // Message Bubble Component
  const MessageBubble = useCallback(({ message, isUser }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex items-start p-3 rounded-xl shadow-md ${
          isMobileView ? 'max-w-[90%]' : 'max-w-[80%]'
        } ${
          isUser 
            ? 'bg-[#2A9D8F] text-white rounded-br-none' 
            : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-tl-none`
        }`}>
          <div className={`flex items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 p-1 rounded-full ${
              isUser 
                ? 'bg-[#1D3557] ml-2' 
                : `${darkMode ? 'bg-gray-600' : 'bg-gray-500'} mr-2`
            }`}>
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className="flex flex-col">
              <div className="flex items-start mb-1 flex-col">
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                {!isUser && message.showRoleButtons && (
                  <RoleSelectionButtons onRoleSelect={handleRoleSelect} darkMode={darkMode} />
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${
                  isUser ? 'text-white/70' : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }`}>
                  {message.timestamp}
                </span>
                {isUser && <UserTypeIndicator userType={message.userType} />}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }, [darkMode, isMobileView]);

  const modalClasses = isMobileView
    ? "fixed inset-0 w-full h-full rounded-none"
    : "fixed bottom-6 right-6 max-w-md h-[500px] rounded-xl";

  const modalStyle = isMobileView ? {} : { left: position.x, top: position.y };

  return (
    <>
      {/* Floating action button */}
      {!isOpen && (
        <motion.button
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${darkMode ? 'bg-[#2A9D8F]' : 'bg-[#1D3557]'} text-white shadow-lg flex items-center justify-center z-[100]`}
          onClick={toggleChat}
          aria-label="Toggle Chatbot"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: isMobileView ? 1 : 0.5, y: isMobileView ? 0 : 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: isMobileView ? 1 : 0.5, y: isMobileView ? 0 : 50 }}
            transition={{ duration: 0.3 }}
            className={`z-[99] ${isMobileView ? 'bg-black/50' : ''} ${isMobileView ? 'fixed inset-0' : ''}`}
          >
            <motion.div
              ref={modalRef}
              className={`flex flex-col shadow-2xl transition-all duration-300 ${modalClasses} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              style={modalStyle}
            >
              {/* Header */}
              <div 
                className={`flex items-center justify-between p-4 shadow-md flex-shrink-0 ${darkMode ? 'bg-gray-900' : 'bg-[#1D3557]'} text-white rounded-t-xl ${isMobileView ? 'rounded-t-none' : ''} ${!isMobileView ? 'cursor-grab' : ''}`}
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center">
                  <Bot className="w-6 h-6 mr-2" />
                  <div>
                    <h3 className="text-lg font-semibold">Instipass FAQ Assistant</h3>
                    <div className="flex items-center text-xs opacity-80">
                      <span>Role: </span>
                      <UserTypeIndicator userType={currentUserType} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <button onClick={toggleChat} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Close Chat">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {apiError && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 text-sm">
                  {apiError}
                </div>
              )}

              {/* Chat Messages Area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} isUser={message.isUser} />
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`p-3 rounded-xl shadow-md max-w-[80%] ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-tl-none`}>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Searching FAQ...</span>
                        <UserTypeIndicator userType={currentUserType} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-4 border-t flex-shrink-0 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                {isListening && (
                  <div className="text-center mb-2 text-sm font-medium text-green-500">
                    Listening... {interimTranscript}
                  </div>
                )}
                {recognitionError && (
                  <div className="text-center mb-2 text-sm font-medium text-red-500">
                    {recognitionError}
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={needsRoleClarification ? "Type 1, 2, or 3 to select your role..." : "Ask about student IDs, institutional processes..."}
                    className={`flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] transition-all ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={isListening || isTyping}
                  />
                  
                  {isSpeechSupported && (
                    <button
                      onClick={toggleListening}
                      className={`p-3 transition-colors ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : `${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`
                      }`}
                      aria-label={isListening ? "Stop Listening" : "Start Voice Input"}
                      disabled={isTyping}
                    >
                      {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}

                  <button
                    onClick={handleSend}
                    className={`p-3 rounded-r-lg transition-colors ${
                      input.trim() === '' || isTyping || isListening
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-[#2A9D8F] hover:bg-[#207D6E] text-white'
                    }`}
                    disabled={input.trim() === '' || isTyping || isListening}
                    aria-label="Send Message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {needsRoleClarification ? "Select your role to get started • 1=Student, 2=Institution, 3=Partner" : "Strict FAQ-based responses • Instipass Student ID Services"}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotInterface;