"use client"

import React, { useState, useEffect } from 'react';

import { ArrowUp } from 'lucide-react';

const PrivacyPolicy = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize dark mode from localStorage and listen for theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
      
      // Listen for theme changes from 
      const handleThemeChange = (event) => {
        setDarkMode(event.detail.darkMode);
      };
      
      window.addEventListener('themeChange', handleThemeChange);
      return () => {
        window.removeEventListener('themeChange', handleThemeChange);
      };
    }
  }, []);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
     
      
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#1D3557]">Privacy Policy</h1>
          <div className="w-24 h-1 bg-[#2A9D8F] mb-8"></div>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">1. Introduction</h2>
              <p className="mb-4">
                InstiPass ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, and services (collectively, the "Services").
              </p>
              <p className="mb-4">
                Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">2. Information We Collect</h2>
              <p className="mb-4">
                We collect several types of information from and about users of our Services:
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">2.1 Personal Information</h3>
              <p className="mb-2">
                Depending on how you interact with our Services, we may collect the following categories of personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Identity Information</strong>: Name, date of birth, student/employee ID numbers, photographs for ID cards</li>
                <li><strong>Contact Information</strong>: Email address, telephone number, mailing address</li>
                <li><strong>Institutional Information</strong>: Educational institution, department, role, enrollment/employment status</li>
                <li><strong>Account Information</strong>: Username, password, account preferences</li>
                <li><strong>Transaction Information</strong>: Information about services you have purchased from us, billing address, and payment method details</li>
                <li><strong>Technical Information</strong>: Internet protocol (IP) address, browser type, operating system, device information, and other technology identifiers on the devices you use to access our Services</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">2.2 Non-Personal Information</h3>
              <p className="mb-2">
                We also collect non-personal information that does not directly identify you, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Usage Data</strong>: Information about how you use our Services, including pages visited, features used, and time spent on the platform</li>
                <li><strong>Aggregated Data</strong>: Statistical or demographic data that does not directly identify you</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">2.3 Information Collection Methods</h3>
              <p className="mb-2">
                We collect information through:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Direct Interactions</strong>: Information you provide when creating an account, filling out forms, or communicating with us</li>
                <li><strong>Automated Technologies</strong>: Cookies, web beacons, and similar technologies that collect information about your equipment and browsing actions</li>
                <li><strong>Third Parties</strong>: Information we receive from your institution, service providers, or business partners</li>
              </ul>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">3. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect for various purposes, including:
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">3.1 Service Provision and Improvement</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To provide, maintain, and improve our Services</li>
                <li>To process and fulfill your requests, including issuing digital IDs</li>
                <li>To personalize your experience and deliver content relevant to your interests</li>
                <li>To develop new products, services, features, and functionality</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">3.2 Communication</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To communicate with you about your account or use of our Services</li>
                <li>To respond to your inquiries, comments, or questions</li>
                <li>To provide you with news, special offers, and general information about other services we offer</li>
                <li>To send administrative information, such as updates to our terms, conditions, and policies</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">3.3 Security and Protection</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To protect our Services and users</li>
                <li>To detect, prevent, and address technical issues, fraud, or illegal activity</li>
                <li>To enforce our Terms and Conditions and other agreements</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">3.4 Analytics and Research</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To understand how users access and use our Services</li>
                <li>To evaluate and improve our Services, marketing, and user experience</li>
                <li>To develop and test new products and features</li>
              </ul>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">4. Information Sharing and Disclosure</h2>
              <p className="mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.1 With Your Institution</h3>
              <p className="mb-4">
                If you are accessing our Services through an institutional account, we may share your information with your institution as necessary to provide the Services.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.2 Service Providers</h3>
              <p className="mb-4">
                We may share your information with third-party vendors, service providers, contractors, or agents who perform services on our behalf.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.3 Business Transfers</h3>
              <p className="mb-4">
                If we are involved in a merger, acquisition, financing, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.4 Legal Requirements</h3>
              <p className="mb-4">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.5 Protection of Rights</h3>
              <p className="mb-4">
                We may disclose your information to protect the rights, property, or safety of InstiPass, our users, or others.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.6 With Your Consent</h3>
              <p className="mb-4">
                We may share your information with third parties when we have your consent to do so.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">5. Data Security</h2>
              <p className="mb-4">
                We have implemented appropriate technical and organizational measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">6. Data Retention</h2>
              <p className="mb-4">
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">7. Your Privacy Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, which may include:
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.1 Access and Information</h3>
              <p className="mb-4">
                The right to request access to your personal information and information about how we process it.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.2 Correction</h3>
              <p className="mb-4">
                The right to request that we correct inaccurate or incomplete personal information about you.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.3 Deletion</h3>
              <p className="mb-4">
                The right to request that we delete your personal information in certain circumstances.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.4 Restriction</h3>
              <p className="mb-4">
                The right to request that we restrict the processing of your personal information in certain circumstances.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.5 Data Portability</h3>
              <p className="mb-4">
                The right to receive the personal information you have provided to us in a structured, commonly used, and machine-readable format.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.6 Objection</h3>
              <p className="mb-4">
                The right to object to the processing of your personal information in certain circumstances.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.7 Automated Decision-Making</h3>
              <p className="mb-4">
                The right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.8 Exercising Your Rights</h3>
              <p className="mb-4">
                To exercise any of these rights, please contact us using the information provided in the "Contact Information" section below. We may need to verify your identity before responding to your request.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">8. Children's Privacy</h2>
              <p className="mb-4">
                Our Services are not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">9. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we transfer the information to the United States and process it there.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">10. Cookies and Tracking Technologies</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">10.1 Cookies</h3>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track activity on our Services and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">10.2 Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Essential Cookies</strong>: Necessary for the operation of our Services</li>
                <li><strong>Analytical/Performance Cookies</strong>: Allow us to recognize and count the number of visitors and see how visitors move around our Services</li>
                <li><strong>Functionality Cookies</strong>: Enable us to personalize our content for you</li>
                <li><strong>Targeting Cookies</strong>: Record your visit to our Services, the pages you have visited, and the links you have followed</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">10.3 Your Choices Regarding Cookies</h3>
              <p className="mb-4">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">11. Third-Party Links and Services</h2>
              <p className="mb-4">
                Our Services may contain links to third-party websites and services that are not owned or controlled by InstiPass. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">12. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">13. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Email: privacy@instipass.com</li>
                <li>Address: 123 Tech Avenue, Suite 400, San Francisco, CA 94107</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">14. California Privacy Rights</h2>
              <p className="mb-4">
                If you are a California resident, California law may provide you with additional rights regarding our use of your personal information. To learn more about your California privacy rights, visit our California Privacy Notice.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">15. European Union Data Protection</h2>
              <p className="mb-4">
                If you are a resident of the European Union, you have certain data protection rights under the General Data Protection Regulation (GDPR). We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information.
              </p>
              <p className="mb-4">
                The data controller of your personal information is InstiPass. If you wish to be informed what personal information we hold about you and if you want it to be removed from our systems, please contact us.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">16. Do Not Track Signals</h2>
              <p className="mb-4">
                Some browsers have a "Do Not Track" feature that signals to websites that you visit that you do not want to have your online activity tracked. Our Services do not currently respond to "Do Not Track" signals.
              </p>
            </section>
            
            <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last Updated: May 31, 2025
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-6 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 InstiPass. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="/terms" className="text-sm hover:text-[#2A9D8F] transition-colors">Terms & Conditions</a>
              <a href="/privacy" className="text-sm hover:text-[#2A9D8F] transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[#2A9D8F] text-white shadow-lg hover:bg-[#1D3557] transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default PrivacyPolicy;
