"use client"
import React, { useState, useEffect } from 'react';

import { ArrowUp } from 'lucide-react';

const TermsAndConditions = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize dark mode from localStorage and listen for theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
      
      // Listen for theme changes from 
      const handleThemeChange = (event: CustomEvent) => {
        setDarkMode(event.detail.darkMode);
      };
      
      window.addEventListener('themeChange', handleThemeChange as EventListener);
      return () => {
        window.removeEventListener('themeChange', handleThemeChange as EventListener);
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#1D3557]">Terms and Conditions</h1>
          <div className="w-24 h-1 bg-[#2A9D8F] mb-8"></div>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">1. Introduction</h2>
              <p className="mb-4">
                Welcome to InstiPass. These Terms and Conditions govern your use of our website, mobile applications, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Services.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">2. Definitions</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>"Company"</strong>, "We", "Us", or "Our" refers to InstiPass.</li>
                <li><strong>"User"</strong>, "You", or "Your" refers to the individual, institution, or entity accessing or using our Services.</li>
                <li><strong>"Institution"</strong> refers to any educational institution, healthcare facility, or corporate campus that implements the InstiPass system.</li>
                <li><strong>"Digital ID"</strong> refers to the digital identification credentials issued through our platform.</li>
              </ul>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">3. Account Registration</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">3.1 User Accounts</h3>
              <p className="mb-4">
                To access certain features of our Services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">3.2 Account Security</h3>
              <p className="mb-4">
                You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lowercase letters, numbers, and symbols) with your account.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">3.3 Institutional Accounts</h3>
              <p className="mb-4">
                Institutions are responsible for managing access to their administrative accounts and for ensuring that only authorized personnel have access to the InstiPass administrative dashboard.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">4. Service Description</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.1 Digital ID Management</h3>
              <p className="mb-4">
                InstiPass provides a platform for institutions to create, distribute, and validate digital identification credentials for their members, including students, staff, and visitors.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.2 Service Availability</h3>
              <p className="mb-4">
                We strive to ensure that our Services are available 24/7. However, we do not guarantee that the Services will be available at all times. We may experience hardware, software, or other problems, or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">4.3 Service Modifications</h3>
              <p className="mb-4">
                We reserve the right to modify or discontinue, temporarily or permanently, the Services (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Services.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">5. User Conduct</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">5.1 Prohibited Activities</h3>
              <p className="mb-2">You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Using the Services for any illegal purpose or in violation of any local, state, national, or international law</li>
                <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Services</li>
                <li>Using the Services to impersonate another person or entity</li>
                <li>Creating or distributing counterfeit digital IDs</li>
                <li>Attempting to access, search, or create accounts for the Services by any means other than our publicly supported interfaces</li>
                <li>Collecting or harvesting any personally identifiable information from the Services</li>
                <li>Using the Services for any commercial solicitation purposes without our prior written consent</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">5.2 Content Guidelines</h3>
              <p className="mb-2">You agree not to upload, post, or transmit any content that:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Infringes any intellectual property or other proprietary rights of any party</li>
                <li>Contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
                <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Constitutes unsolicited or unauthorized advertising, promotional materials, "junk mail," "spam," "chain letters," or any other form of solicitation</li>
              </ul>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">6. Intellectual Property</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">6.1 Our Intellectual Property</h3>
              <p className="mb-4">
                The Services and their original content, features, and functionality are and will remain the exclusive property of InstiPass and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">6.2 License to Use</h3>
              <p className="mb-4">
                Subject to these Terms and Conditions, we grant you a limited, non-exclusive, non-transferable, and revocable license to use the Services for their intended purposes.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">6.3 Feedback</h3>
              <p className="mb-4">
                If you provide us with any feedback or suggestions regarding the Services, you hereby assign to us all rights in such feedback and agree that we shall have the right to use such feedback and related information in any manner we deem appropriate.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">7. Data Privacy</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.1 Privacy Policy</h3>
              <p className="mb-4">
                Your use of the Services is also governed by our Privacy Policy, which is incorporated into these Terms and Conditions by reference. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your information.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">7.2 Data Processing</h3>
              <p className="mb-4">
                For institutions, we process data on your behalf as a data processor. You remain the data controller and are responsible for ensuring that your use of our Services complies with applicable data protection laws.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">8. Third-Party Services</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">8.1 Third-Party Links</h3>
              <p className="mb-4">
                The Services may contain links to third-party websites or services that are not owned or controlled by InstiPass. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">8.2 Integration Partners</h3>
              <p className="mb-4">
                We may partner with third-party service providers to facilitate the Services. These third parties have their own terms of service and privacy policies, and we encourage you to read them.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">9. Payments and Billing</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">9.1 Fees</h3>
              <p className="mb-4">
                Institutions may be charged fees for the use of certain aspects of the Services. You agree to pay all fees in accordance with the fees, charges, and billing terms in effect at the time a fee is due and payable.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">9.2 Payment Information</h3>
              <p className="mb-4">
                You must provide current, complete, and accurate billing and payment information. By submitting payment information, you authorize us to charge all fees to the payment method you provide.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">9.3 Subscription Terms</h3>
              <p className="mb-4">
                Subscription fees are billed in advance on a monthly or annual basis, depending on the subscription plan selected. Unless otherwise stated, subscriptions automatically renew for additional periods equal to the initial subscription term.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">10. Termination</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">10.1 Termination by You</h3>
              <p className="mb-4">
                You may terminate your account at any time by contacting us or by following the instructions provided in the Services.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">10.2 Termination by Us</h3>
              <p className="mb-4">
                We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">10.3 Effect of Termination</h3>
              <p className="mb-4">
                Upon termination, your right to use the Services will immediately cease. If your account is terminated, we may delete any content or data associated with your account.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">11. Limitation of Liability</h2>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">11.1 Disclaimer of Warranties</h3>
              <p className="mb-4">
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. INSTIPASS EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">11.2 Limitation of Liability</h3>
              <p className="mb-4">
                IN NO EVENT SHALL INSTIPASS, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
              </p>
              
              <h3 className="text-xl font-bold mb-3 text-[#1D3557] dark:text-[#2A9D8F]">11.3 Maximum Liability</h3>
              <p className="mb-4">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING OR USING OUR SERVICES DURING THE TWELVE (12) MONTHS PRIOR TO BRINGING THE CLAIM.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">12. Indemnification</h2>
              <p className="mb-4">
                You agree to defend, indemnify, and hold harmless InstiPass, its parent, subsidiaries, affiliates, and their respective directors, officers, employees, and agents from and against all claims, damages, obligations, losses, liabilities, costs or debt, and expenses arising from your use of and access to the Services.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">13. Governing Law</h2>
              <p className="mb-4">
                These Terms and Conditions shall be governed and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding relating to your access to or use of the Services shall be instituted in the federal or state courts located in San Francisco County, California.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">14. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms and Conditions at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">15. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Email: legal@instipass.com</li>
                <li>Address: 123 Tech Avenue, Suite 400, San Francisco, CA 94107</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">16. Severability</h2>
              <p className="mb-4">
                If any provision of these Terms and Conditions is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">17. Entire Agreement</h2>
              <p className="mb-4">
                These Terms and Conditions, together with our Privacy Policy, constitute the entire agreement between you and InstiPass regarding your use of the Services and supersede all prior agreements and understandings, whether written or oral.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1D3557] dark:text-[#2A9D8F]">18. Waiver</h2>
              <p className="mb-4">
                Our failure to enforce any right or provision of these Terms and Conditions will not be considered a waiver of those rights. The waiver of any such right or provision will be effective only if in writing and signed by a duly authorized representative of InstiPass.
              </p>
            </section>
            
            <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last Updated: May 30, 2025
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

export default TermsAndConditions;
