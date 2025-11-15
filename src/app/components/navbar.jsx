"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, CreditCard, Menu, X, BarChart, Shield, Calendar, Users, Mail } from 'lucide-react';

const HomeNavbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('instipass-theme', !darkMode ? 'dark' : 'light');
      
      // Emit an event so other components can react to theme change
      const event = new CustomEvent('themeChange', { detail: { darkMode: !darkMode } });
      window.dispatchEvent(event);
    }
  };
  
  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Add scroll event listener to change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 
       ${scrolled ? 'shadow-lg' : 'shadow-md'} text-${darkMode ? 'white'  : 'gray-900'} ${darkMode? '': 'bg-[#1D3557]'}`}
      style={{ position: 'fixed', width: '100%' }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#1D3557] text-white flex items-center justify-center mr-3">
            <CreditCard size={20} />
          </div>
          <span className={`text-xl font-bold ${darkMode? 'text-white':'text-[#2A9D8F]'}`}>Instipass</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/tutorials" className="hover:text-[#2A9D8F] transition-colors text-white flex items-center dark:text-white" target="_blank" rel="noopener noreferrer">
            <BarChart size={16} className="mr-1" /> Tutorials
          </Link>
          <Link href="#institution-benefits" className="hover:text-[#2A9D8F] text-white transition-colors flex items-center dark:text-white">
            <Shield size={16} className="mr-1" /> Benefits
          </Link>
          <Link href="#testimonials" className="hover:text-[#2A9D8F] text-white transition-colors flex items-center dark:text-white">
            <Users size={16} className="mr-1" /> Testimonials
          </Link>
          <Link href="/about" className="hover:text-[#2A9D8F] text-white transition-colors flex items-center dark:text-white">
            <Mail size={16} className="mr-1" /> About Us
          </Link>
        </div>
        
        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link href="/institution" className="px-4 py-2 rounded-md bg-[#1D3557] text-white hover:bg-opacity-90 transition-colors hover:bg-[#2A9D8F]">
            Sign In
          </Link>
          
          {/* <button 
            onClick={() => setIsBookDemoOpen(true)}
            className="px-4 py-2 rounded-md  bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] text-white hover:bg-opacity-90 transition-colors"
          >
            Book Demo
          </button> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`lg:hidden fixed left-0 right-0 top-[72px] z-50 shadow-lg ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex flex-col px-6 py-4 space-y-4 animate-fadeIn">
            <Link 
              href="/tutorials" 
              className="hover:text-[#2A9D8F] transition-colors py-2 border-b border-gray-200 dark:border-gray-700 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart size={16} className="mr-2" /> Tutorials
            </Link>
            <Link 
              href="#institution-benefits" 
              className="hover:text-[#2A9D8F] transition-colors py-2 border-b border-gray-200 dark:border-gray-700 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={16} className="mr-2" /> Benefits
            </Link>
            <Link 
              href="#testimonials" 
              className="hover:text-[#2A9D8F] transition-colors py-2 border-b border-gray-200 dark:border-gray-700 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users size={16} className="mr-2" /> Testimonials
            </Link>
            <Link 
              href="/about" 
              className="hover:text-[#2A9D8F] transition-colors py-2 border-b border-gray-200 dark:border-gray-700 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail size={16} className="mr-2" /> About Us
            </Link>
            
            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                href="institution" 
                className="px-4 py-2 rounded-md bg-[#1D3557] text-white hover:bg-opacity-90 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              
              {/* <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBookDemoOpen(true);
                }}
                className="px-4 py-2 rounded-md  bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] text-white hover:bg-opacity-90 transition-colors text-center"
              >
                Book Demo
              </button> */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
