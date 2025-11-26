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

// FAQ Service with intelligent context detection
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
        
        "cancel application": "Contact support immediately if you need changes or cancellation. Some corrections are possible if addressed early.",
        
        "lost id": "Contact your institution admin to report a lost ID and request a replacement. Replacement processes and costs are managed by your institution.",
        
        "damaged id": "Contact your institution admin to report a damaged ID and request a replacement. Your institution will guide you on the replacement process.",
        
        "change details": "Once submitted, applications cannot be edited. Contact support or your institution immediately if there's an error in your details.",
        
        "application status": "You will receive SMS updates at each stage. If you haven't received updates, check your phone number was entered correctly or contact support.",
        
        "id not received": "Check with your institution's collection point first. If the issue persists, contact support with your application details."
      },
      institution: {
        "get started": "Book a demo or contact Instipass support. You will be guided on onboarding, portal setup, and the ID application process.",
        
        "after registration": "An administrator from your staff is assigned and recognized by the system. This admin manages the portal, receives updates, and oversees student ID processing.",
        
        "admin role": "The admin monitors student submissions, manages ID preferences, receives notifications, and ensures smooth communication with Instipass.",
        
        "portal features": "Staff can view submissions, monitor processing, select templates, manage preferences, and track payment status. Students do not have portal access.",
        
        "institution payment": "Yes. Institutions handle all payments. Students are not charged.",
        
        "payment process": "Two stages: a down payment before production and a final payment before delivery of IDs. Payments can be made via M-Pesa, bank transfer, or other agreed payment methods.",
        
        "payment methods": "Institutions can pay via M-Pesa, bank transfer, or other pre-arranged payment methods. Contact support for specific payment details.",
        
        "verification": "Instipass verifies applications internally. Institutions do not manually review each submission.",
        
        "customize design": "Yes. Choose from templates or request custom designs including branding, colors, and logos.",
        
        "production time": "Depends on student volume, payment completion, and production workload. Real-time updates are sent to the admin.",
        
        "delivery method": "All IDs are printed and delivered to the institution. Admin receives notifications when dispatched.",
        
        "student notifications": "Instipass sends SMS notifications automatically when IDs are ready for collection.",
        
        "change admin": "Yes. Contact support to request an admin change.",
        
        "delayed payment": "Production pauses until payment is made. Students may still receive general updates.",
        
        "priority processing": "Yes, subject to workload. Contact support to arrange priority.",
        
        "integration": "Integration may be available depending on your institution's needs. Contact support to explore options.",
        
        "bulk upload": "Yes, institutions can upload student data in bulk through the admin portal. Contact support for format specifications.",
        
        "replacement ids": "Replacement IDs for lost or damaged cards are processed through the institution admin portal. Additional costs may apply.",
        
        "reports": "The admin portal provides various reports on application status, completion rates, and other metrics.",
        
        "support contact": "Contact Instipass support via email at support@instipass.com or through the support channel provided during onboarding.",
        
        "portal access": "If you're having trouble accessing the institution portal, contact support to reset your credentials or resolve access issues."
      },
      general: {
        "what does instipass do": "Produces physical student IDs while providing a smooth, fully digital application process for students and a management portal for institutions.",
        
        "why digital": "Eliminates long queues, manual errors, and delays. Students apply online, institutions manage everything centrally.",
        
        "communication channels": "Automated SMS notifications for students; portal notifications for institutions.",
        
        "data security": "Yes. Data is processed securely under strict agreements with each institution.",
        
        "contact support": "For technical issues, contact Instipass support at support@instipass.com. For partnership inquiries, contact partnerships@instipass.com.",
        
        "partnership": "For partnership inquiries or to register your institution, contact our partnerships team at partnerships@instipass.com or book a demo through our website.",
        
        "demo": "Book a demo through our website or contact partnerships@instipass.com to schedule a demonstration of our services.",
        
        "pricing": "Pricing varies based on institution size and requirements. Contact partnerships@instipass.com for detailed pricing information.",
        
        "features": "Key features include digital applications, automated SMS notifications, institution admin portal, customizable ID designs, and bulk processing capabilities."
      },
      support: {
        "technical issues": "Contact Instipass support immediately. Provide a detailed description, including screenshots if possible, to help resolve the issue quickly.",
        
        "sms issues": "Confirm your phone number is correct and can receive messages. If it is correct, contact support to verify your submission.",
        
        "incorrect information": "The institution admin should contact support with correct information for updating.",
        
        "system errors": "Any manual verification issues or anomalies should be reported to support with all relevant details.",
        
        "custom features": "Contact support to discuss requirements or integrations. Instipass can tailor features based on your needs.",
        
        "onboarding": "Book a demo or contact support to get guidance on onboarding and portal setup.",
        
        "bugs": "Direct all such cases to Instipass support. Always include a detailed description and any evidence like screenshots.",
        
        "login issues": "For institution portal login issues, contact support to reset your credentials or resolve access problems."
      }
    };

    this.ambiguousTopics = {
      "payment": {
        student: "No. Students do not make any payments. All financial responsibilities, including down payments and final payments, are handled entirely by the institution.",
        institution: "Institutions handle all payments through two stages: a down payment before production and final payment before delivery. Payments can be made via M-Pesa, bank transfer, or other agreed methods."
      },
      "portal": {
        student: "No. Students do not have portals. Interactions are limited to the online application form and SMS notifications.",
        institution: "Institution admins have access to a comprehensive portal for managing student submissions, monitoring processing, selecting templates, and tracking payment status."
      },
      "application": {
        student: "Students apply through an online form provided by their institution, upload a photo, and receive SMS updates throughout the process.",
        institution: "Institutions provide application links to students and manage the process through the admin portal, including monitoring submissions and processing status."
      },
      "id collection": {
        student: "Students collect their IDs from their institution's designated collection point as notified via SMS.",
        institution: "IDs are delivered in bulk to the institution, which then distributes them to students through designated collection points."
      },
      "problems": {
        student: "For application issues, photo rejections, or missing SMS, students should contact support or their institution admin.",
        institution: "For portal issues, payment problems, or bulk processing, institution admins should contact Instipass support directly."
      }
    };
  }

  detectContext(prompt, conversationHistory = []) {
    const lowerPrompt = prompt.toLowerCase();
    const fullConversation = conversationHistory.map(msg => msg.text).join(' ').toLowerCase();

    // Strong student indicators
    const studentIndicators = [
      'i am a student', 'i\'m a student', 'my id', 'my application', 'collect my id',
      'when will i get', 'my photo', 'student card', 'personal id', 'i need to apply',
      'when do i get', 'where do i collect', 'my sms', 'my notification'
    ];

    // Strong institution indicators
    const institutionIndicators = [
      'i am from', 'our institution', 'our students', 'we need', 'our admin',
      'institution portal', 'admin portal', 'bulk upload', 'multiple students',
      'payment for', 'our payment', 'manage students', 'institution management'
    ];

    // Check for explicit statements first
    for (const indicator of studentIndicators) {
      if (lowerPrompt.includes(indicator) || fullConversation.includes(indicator)) {
        return 'student';
      }
    }

    for (const indicator of institutionIndicators) {
      if (lowerPrompt.includes(indicator) || fullConversation.includes(indicator)) {
        return 'institution';
      }
    }

    // Content-based detection
    const studentKeywords = [
      'apply', 'application', 'photo', 'picture', 'sms', 'notification',
      'collect', 'pick up', 'get id', 'student card', 'lost id', 'damaged',
      'replacement', 'when will i', 'my photo', 'personal id', 'collection point'
    ];

    const institutionKeywords = [
      'portal', 'dashboard', 'bulk', 'upload', 'students list', 'report',
      'analytics', 'payment', 'invoice', 'management', 'credentials',
      'admin access', 'multiple students', 'batch', 'institution', 'school',
      'university', 'college'
    ];

    let studentScore = studentKeywords.filter(keyword => 
      lowerPrompt.includes(keyword)
    ).length;

    let institutionScore = institutionKeywords.filter(keyword => 
      lowerPrompt.includes(keyword)
    ).length;

    // Check for ambiguous topics that need clarification
    const ambiguousTopics = Object.keys(this.ambiguousTopics);
    const isAmbiguous = ambiguousTopics.some(topic => 
      lowerPrompt.includes(topic) && Math.abs(studentScore - institutionScore) <= 1
    );

    if (isAmbiguous) {
      return 'ambiguous';
    }

    if (studentScore > institutionScore) {
      return 'student';
    } else if (institutionScore > studentScore) {
      return 'institution';
    }

    return 'general';
  }

  findBestMatch(query, context) {
    const lowerQuery = query.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    // Search in context-specific FAQs first
    if (context !== 'ambiguous' && this.faqData[context]) {
      for (const [key, answer] of Object.entries(this.faqData[context])) {
        const score = this.calculateMatchScore(lowerQuery, key);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = { answer, section: context };
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
    const queryWords = query.split(' ');
    const faqWords = faqKey.split(' ');
    
    let matches = 0;
    queryWords.forEach(qWord => {
      faqWords.forEach(fWord => {
        if (qWord.length > 2 && fWord.length > 2 && qWord.includes(fWord)) {
          matches++;
        }
      });
    });
    
    return matches / Math.max(queryWords.length, faqWords.length);
  }

  generateResponse(prompt, conversationHistory = []) {
    const context = this.detectContext(prompt, conversationHistory);
    
    // Handle ambiguous topics with contextual responses
    if (context === 'ambiguous') {
      const ambiguousTopic = Object.keys(this.ambiguousTopics).find(topic => 
        prompt.toLowerCase().includes(topic)
      );
      
      if (ambiguousTopic) {
        return {
          text: `I notice you're asking about ${ambiguousTopic}. This works differently depending on your role:\n\n` +
                `**For Students:** ${this.ambiguousTopics[ambiguousTopic].student}\n\n` +
                `**For Institutions:** ${this.ambiguousTopics[ambiguousTopic].institution}\n\n` +
                `Which one applies to you?`,
          context: 'ambiguous',
          isAmbiguous: true
        };
      }
    }

    const match = this.findBestMatch(prompt, context);

    if (match) {
      return {
        text: match.answer,
        context: context,
        isAmbiguous: false
      };
    }

    // Default responses based on detected context
    const defaultResponses = {
      student: "I can help you with student ID applications, photo requirements, SMS notifications, and collection procedures. Please ask about any specific aspect of the student ID process.",
      institution: "I can assist with institution portal access, payment processes, student management, and administrative functions. Please ask about any specific institutional process.",
      general: "I'm here to help with Instipass services. Please ask about student applications, institutional processes, or general information."
    };

    return {
      text: defaultResponses[context] || defaultResponses.general,
      context: context,
      isAmbiguous: false
    };
  }
}

// Initialize FAQ service
const faqService = new FAQService();

// Context Indicator Component
const ContextIndicator = ({ context }) => {
  const getIcon = () => {
    switch (context) {
      case 'student': return <GraduationCap className="w-3 h-3" />;
      case 'institution': return <Building className="w-3 h-3" />;
      case 'ambiguous': return <Users className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  const getLabel = () => {
    switch (context) {
      case 'student': return 'Student Context';
      case 'institution': return 'Institution Context';
      case 'ambiguous': return 'Multiple Contexts';
      default: return 'General';
    }
  };

  const getColor = () => {
    switch (context) {
      case 'student': return 'bg-blue-500';
      case 'institution': return 'bg-green-500';
      case 'ambiguous': return 'bg-purple-500';
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

// Main Chatbot Component
const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Instipass FAQ Assistant. I provide exact answers from our official documentation about student ID applications, institutional processes, and general information. How can I help you today?", 
      isUser: false, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context: 'general'
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentContext, setCurrentContext] = useState('general');
  
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

  // Handle send message with intelligent context detection
  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context: currentContext
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
    setApiError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = faqService.generateResponse(input.trim(), messages);
      
      const botResponse = {
        id: Date.now() + 1,
        text: response.text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        context: response.context
      };
      
      setCurrentContext(response.context);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      setApiError('Failed to generate response. Please try again.');
      
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "I'm currently experiencing technical difficulties. Please try again in a moment or contact Instipass support directly for immediate assistance.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        context: 'general'
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
            <div className="flex flex-col flex-1">
              <div className="flex items-start mb-1">
                <p className="text-sm whitespace-pre-wrap flex-1">{message.text}</p>
                {isUser && <ContextIndicator context={message.context} />}
              </div>
              <span className={`text-xs mt-1 ${
                isUser ? 'text-white/70' : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
              }`}>
                {message.timestamp}
              </span>
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
                      <span>Context: </span>
                      <ContextIndicator context={currentContext} />
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
                        <ContextIndicator context={currentContext} />
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
                    placeholder="Ask about student applications, institutional processes..."
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
                  Intelligent context detection • Instipass Student ID Services
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