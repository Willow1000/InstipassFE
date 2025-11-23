"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Loader2, User, Bot, Move } from 'lucide-react';

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  // Listen for theme changes from the homepage
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

  // Set initial position when opening
  useEffect(() => {
    if (isOpen) {
      const modalWidth = 384; // max-w-md
      const modalHeight = 500;
      setPosition({
        x: window.innerWidth - modalWidth - 24,
        y: window.innerHeight - modalHeight - 24
      });
    }
  }, [isOpen]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

  // Improved drag handlers with better sensitivity
  const handleMouseDown = (e) => {
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
  const handleMouseMove = React.useCallback((e) => {
    if (!isDragging) return;
    
    requestAnimationFrame(() => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setPosition({
        x: newX,
        y: newY
      });
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = React.useCallback(() => {
    if (!isDragging) return;
    
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
  }, [isDragging]);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Message Bubble Component - Memoized to prevent unnecessary re-renders
  const MessageBubble = React.useCallback(({ message, isUser }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex items-start p-3 rounded-xl shadow-md max-w-[80%] ${
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
  }, [darkMode]);

  return (
    <>
      {/* Floating action button */}
      <motion.button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${darkMode ? 'bg-[#2A9D8F]' : 'bg-[#1D3557]'} text-white shadow-lg flex items-center justify-center z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        aria-label="Open chat with Instipass AI"
      >
        <MessageSquare size={24} />
      </motion.button>
      
      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ pointerEvents: 'none' }}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: position.x,
                y: position.y
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`absolute w-full max-w-md h-[500px] rounded-xl shadow-xl flex flex-col overflow-hidden ${
                isDragging ? 'cursor-grabbing shadow-2xl' : 'cursor-grab'
              } ${darkMode ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}
              style={{
                left: 0,
                top: 0,
                pointerEvents: 'all'
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Header - Drag handle */}
              <div 
                className={`flex items-center justify-between p-4 shadow-md ${
                  darkMode ? 'bg-[#1D3557] text-white' : 'bg-[#2A9D8F] text-white'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              >
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold">Instipass AI Chat</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Move className="w-4 h-4 opacity-70" />
                  <button
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    onClick={toggleChat}
                    aria-label="Close chat"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area - Fixed height to prevent layout shifts */}
              <div 
                className={`flex-grow overflow-y-auto p-4 ${
                  darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar'
                }`}
                style={{ height: 'calc(100% - 136px)' }} // Fixed height calculation
              >
                <div className="h-full">
                  {messages.map((msg) => (
                    <MessageBubble 
                      key={msg.id} 
                      message={msg} 
                      isUser={msg.isUser} 
                    />
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`flex items-center p-3 rounded-xl shadow-md ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="text-sm">Instipass AI is typing...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className={`flex p-4 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Instipass AI a question..."
                  disabled={isTyping}
                  className={`flex-grow p-3 rounded-l-lg border transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#2A9D8F]' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#2A9D8F]'
                  } focus:outline-none`}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isTyping || input.trim() === ''}
                  whileHover={{ scale: isTyping || input.trim() === '' ? 1 : 1.02 }}
                  whileTap={{ scale: isTyping || input.trim() === '' ? 1 : 0.98 }}
                  className={`flex items-center justify-center px-4 py-2 font-medium rounded-r-lg transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-[#2A9D8F] text-white hover:bg-[#1D3557]/90' 
                      : 'bg-[#1D3557] text-white hover:bg-[#2A9D8F]/90'
                  } ${
                    isTyping || input.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotInterface;