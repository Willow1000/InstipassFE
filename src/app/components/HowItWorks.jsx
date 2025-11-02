import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Cog, BarChart, FileText, Bell, Cloud, University, Users, ArrowRight } from 'lucide-react';

const AnimatedHowItWorks = ({ darkMode }) => {
  const [activeInstitutionStep, setActiveInstitutionStep] = useState(0);
  const [activeStudentStep, setActiveStudentStep] = useState(0);

  useEffect(() => {
    const institutionTimer = setTimeout(() => {
      setActiveInstitutionStep((prevStep) => (prevStep + 1) % 3);
    }, 3000); // Change step every 3 seconds

    const studentTimer = setTimeout(() => {
      setActiveStudentStep((prevStep) => (prevStep + 1) % 3);
    }, 3000); // Change step every 3 seconds

    return () => {
      clearTimeout(institutionTimer);
      clearTimeout(studentTimer);
    };
  }, [activeInstitutionStep, activeStudentStep]);

  const institutionSteps = [
    {
      icon: <UserPlus size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Register Your Institution",
      description: "Complete a simple registration process to join our network of partner institutions and gain access to our digital ID management platform."
    },
    {
      icon: <Cog size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Configure Your Settings",
      description: "Customize your institution\'s branding, ID templates, verification requirements, and administrative permissions."
    },
    {
      icon: <BarChart size={48} className="text-[#1D3557] dark:text-[#2A9D8F]" />,
      title: "Monitor via Dashboard",
      description: "Access a comprehensive dashboard to monitor student registrations, track ID processing status, and oversee all digital IDs issued by your institution."
    }
  ];

  const studentSteps = [
    {
      icon: <FileText size={40} className="text-[#2A9D8F]" />,
      title: "Apply for ID",
      description: "Students complete the application form with their personal details and required documentation."
    },
    {
      icon: <Bell size={40} className="text-[#2A9D8F]" />,
      title: "Receive Digital ID",
      description: "Once approved, students receive their digital ID card accessible on mobile and web platforms."
    },
    {
      icon: <Cloud size={40} className="text-[#2A9D8F]" />,
      title: "Access Anywhere",
      description: "Students can access their ID anytime, anywhere with automatic backups and updates."
    }
  ];

  return (
    <section id="how-it-works" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span  className="inline-block px-4 py-2 rounded-full bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] font-medium mb-4">
            Implementation Process
          </span>
          <h2 className="text-4xl font-bold mb-6">How It Works</h2>
          <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            InstiPass streamlines the entire ID management process for your institution with our comprehensive platform.
          </p>
        </motion.div>

        {/* For Institutions Section - ENHANCED */}
        <div className="mb-20">
          <motion.h3
            className="text-2xl font-bold mb-10 text-center flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <University className="mr-3 text-[#1D3557] dark:text-[#2A9D8F]" size={32} />
            For Institutions
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {institutionSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.5, y: 20 }}
                animate={{ opacity: index === activeInstitutionStep ? 1 : 0.5, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative flex gap-8"
              >
                <motion.div
                  className={`p-8 rounded-xl text-center transition-all duration-300 h-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } border border-transparent ${index === activeInstitutionStep ? 'border-[#2A9D8F] border-opacity-30' : ''}`}
                  animate={index === activeInstitutionStep ? { y: -5, boxShadow: darkMode ? "0 15px 35px rgba(0, 0, 0, 0.3)" : "0 15px 35px rgba(0, 0, 0, 0.1)" } : { y: 0, boxShadow: "none" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="absolute -top-4 -left-4"
                    animate={index === activeInstitutionStep ? { scale: 1.2, color: '#FFFFFF' } : { scale: 1, color: '#FFFFFF' }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1D3557] text-white font-bold">
                      {index + 1}
                    </div>
                  </motion.div>
                  <motion.div
                    className="mb-6 flex justify-center"
                    animate={index === activeInstitutionStep ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-[#1D3557] bg-opacity-10'}`}>
                      {step.icon}
                    </div>
                  </motion.div>
                  <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{step.description}</p>
                </motion.div>
                {index < institutionSteps.length - 1 && (
                  <AnimatePresence>
                    {index === activeInstitutionStep && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                      >
                        <ArrowRight size={24} className="text-[#2A9D8F]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <motion.h3
            className="text-2xl font-bold mb-10 text-center flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Users className="mr-3 text-[#2A9D8F]" size={32} />
            Student Experience
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {studentSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.5, y: 20 }}
                animate={{ opacity: index === activeStudentStep ? 1 : 0.5, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <motion.div
                  className={`p-6 rounded-xl text-center transition-all duration-300 ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                  } border border-transparent ${index === activeStudentStep ? 'border-[#2A9D8F] border-opacity-30' : ''}`}
                  animate={index === activeStudentStep ? { y: -5, boxShadow: darkMode ? "0 15px 35px rgba(0, 0, 0, 0.3)" : "0 15px 35px rgba(0, 0, 0, 0.1)" } : { y: 0, boxShadow: "none" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="absolute -top-4 -left-4"
                    animate={index === activeStudentStep ? { scale: 1.2, color: '#FFFFFF' } : { scale: 1, color: '#FFFFFF' }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A9D8F] text-white font-bold">
                      {index + 1}
                    </div>
                  </motion.div>
                  <div className="mb-4 flex justify-center">
                    <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      {step.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{step.description}</p>
                </motion.div>
                {index < studentSteps.length - 1 && (
                  <AnimatePresence>
                    {index === activeStudentStep && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                      >
                        <ArrowRight size={24} className="text-[#2A9D8F]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHowItWorks;


