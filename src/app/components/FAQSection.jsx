import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('instipass-theme');
        setDarkMode(savedTheme === 'dark');
        
        // Listen for theme changes from Navbar
        const handleThemeChange = (event) => {
          setDarkMode(event.detail.darkMode);
        };
        
        window.addEventListener('themeChange', handleThemeChange);
        return () => {
          window.removeEventListener('themeChange', handleThemeChange);
        };
      }
    }, []);
  return (
    <motion.div 
      className={`border-b border-gray-200 py-4 ${isOpen ? 'bg-opacity-5 bg-[#2A9D8F] rounded-lg' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <ChevronUp className="text-[#2A9D8F]" /> : <ChevronDown />}
        </motion.div>
      </button>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className={`pt-4 ${darkMode?'text-white':'text-black'}`}>{answer}</p>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = ({ darkMode }) => {
  const faqs = [
    {
    question: "How does Instipass work for schools?",
    answer: "Once your institution is onboarded, you can upload or design your ID template. Instipass manages submissions, verifies all documents, and generates digital IDs automatically. Institutions mainly monitor progress and review final outputs."
  },
  {
    question: "What documents are required and who verifies them?",
    answer: "Required documents vary by institution (e.g., admission letters, ID cards, photos). Instipass verifies all submissions for authenticity and quality, ensuring institutions only see the final approved IDs, not raw student data."
  },
  {
    question: "Can institutions customize their ID templates?",
    answer: "Yes. Institutions can fully customize ID templates, including logos, colors, text fields, layout, and other features. Changes can be made anytime through the dashboard before or during processing."
  },
  {
    question: "Is data secure?",
    answer: "All submitted data, documents, and generated IDs are encrypted and stored securely. Only verified outputs are accessible to institutions, ensuring confidentiality and integrity throughout the process."
  },
  {
    question: "Is Instipass compatible with existing management systems?",
    answer: "Absolutely. Instipass integrates seamlessly with most popular management systems through our API, and we also provide custom integration services for specialized systems."
  }
  ];

  return (
    <section id="faq" className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
        
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
