"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Loader2, User, Bot, Move, Mic, MicOff, Square } from 'lucide-react';

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

// Main Chatbot Component
const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Instipass AI, your digital ID assistant. How can I help you today?", 
      isUser: false, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
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
  const isMobileView = useIsMobile(768); // md breakpoint is 768px

  // Initialize speech recognition (unchanged)
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
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Listen for theme changes (unchanged)
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
      const modalWidth = 384; // max-w-md
      const modalHeight = 500;
      setPosition({
        x: window.innerWidth - modalWidth - 24,
        y: window.innerHeight - modalHeight - 24
      });
    }
  }, [isOpen, isMobileView]);

  // Scroll to bottom of chat (unchanged)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Speech recognition functions (unchanged)
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

  // Handle send message (unchanged)
  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: `I received your message: "${newMessage.text}". This is a simulated response. For real assistance, please book a demo session!`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Improved drag handlers with conditional check for mobile view
  const handleMouseDown = (e) => {
    if (isMobileView) return; // Disable dragging on mobile

    // Don't start drag if clicking on interactive elements
    if (e.target.closest('input, button, a')) return;
    
    const modalRect = modalRef.current.getBoundingClientRect();
    const offsetX = e.clientX - modalRect.left;
    const offsetY = e.clientY - modalRect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Use requestAnimationFrame for smoother dragging
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
    
    // Ensure the modal stays within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const modalWidth = 384;
    const modalHeight = 500;

    setPosition(prev => ({
      x: Math.max(0, Math.min(prev.x, viewportWidth - modalWidth)),
      y: Math.max(0, Math.min(prev.y, viewportHeight - modalHeight))
    }));
  }, [isDragging, isMobileView]);

  // Add global mouse event listeners for dragging (conditional on isDragging and not mobile)
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

  // Message Bubble Component - Memoized to prevent unnecessary re-renders (unchanged)
  const MessageBubble = useCallback(({ message, isUser }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex items-start p-3 rounded-xl shadow-md ${
          // Increased max-width for better text flow on small screens
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
              <p className="text-sm">{message.text}</p>
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

  // Determine the modal style based on screen size
  const modalClasses = isMobileView
    ? "fixed inset-0 w-full h-full rounded-none" // Full screen on mobile
    : "fixed bottom-6 right-6 max-w-md h-[500px] rounded-xl"; // Floating widget on desktop

  // Determine the modal position style (only for desktop)
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key="open"
            initial={{ rotate: 0, opacity: 1 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <MessageSquare className="w-6 h-6" />
          </motion.div>
        </AnimatePresence>
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
            className={`z-[99] ${isMobileView ? 'bg-black/50' : ''} ${isMobileView ? 'fixed inset-0' : ''}`} // Add overlay on mobile
          >
            <motion.div
              ref={modalRef}
              className={`flex flex-col shadow-2xl transition-all duration-300 ${modalClasses} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              style={modalStyle}
              onMouseDown={handleMouseDown}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-4 shadow-md flex-shrink-0 ${darkMode ? 'bg-gray-900' : 'bg-[#1D3557]'} text-white rounded-t-xl ${isMobileView ? 'rounded-t-none' : ''}`}>
                <div className="flex items-center">
                  <Bot className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold">Instipass AI Chatbot</h3>
                </div>
                <div className="flex items-center">
                  {/* Drag Handle (Desktop only) */}
                  {!isMobileView && (
                    <Move className={`w-5 h-5 mr-3 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`} />
                  )}
                  <button onClick={toggleChat} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Close Chat">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar" style={{ minHeight: 0 }}>
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} isUser={message.isUser} />
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`p-3 rounded-xl shadow-md max-w-[80%] ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-tl-none`}>
                      <Loader2 className="w-5 h-5 animate-spin" />
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
                    placeholder="Type your message..."
                    className={`flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] transition-all ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={isListening}
                  />
                  
                  {/* Speech Recognition Button */}
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

                  {/* Send Button */}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotInterface;
