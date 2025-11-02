"use client";
import React from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

const Footer = ({ darkMode = false }) => {
  return (
    <footer className={`mt-auto py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1D3557] text-white flex items-center justify-center mr-3">
                <CreditCard size={20} />
              </div>
              <span className="text-xl font-bold text-[#1D3557]">Instipass</span>
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Streamlining student identification for modern educational institutions.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#features" className="hover:text-[#2A9D8F]">Features</a></li>
              <li><a href="#testimonials" className="hover:text-[#2A9D8F]">Testimonials</a></li>
              <li><a href="#team" className="hover:text-[#2A9D8F]">Our Team</a></li>
              <li><a href="#contact" className="hover:text-[#2A9D8F]">Contact Us</a></li>
            </ul>
          </div>
          

          
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="/instipass/privacy_policy" className="hover:text-[#2A9D8F]" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="/instipass/terms_and_conditions" className="hover:text-[#2A9D8F]" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} Instipass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

