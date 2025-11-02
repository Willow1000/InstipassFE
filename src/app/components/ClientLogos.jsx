"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Building, Award, CheckCircle } from "lucide-react";
import { getLogos } from "../utils/fetch";

const ClientLogos = ({ darkMode }) => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- fetch logos on mount ---
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLogos();
        setLogos(data || []);
      } catch (err) {
        console.error("Error fetching logos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- intersection + animation ---
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  // --- live notifications ---
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const activities = [
    "New student registered from University of Excellence",
    "Tech Institute just issued 50 new IDs",
    "Global Academy renewed their subscription",
    "Summit Education Group just joined Instipass",
    "Westlake University verified 120 students today",
  ];

  useEffect(() => {
    const randomNotify = () => {
      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];
      const newNotification = {
        id: Date.now(),
        text: randomActivity,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 3));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    const interval = setInterval(randomNotify, 15000);
    setTimeout(randomNotify, 3000); // initial notification
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`py-16 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Leading Institutions
          </h2>
          <p
            className={`max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Join hundreds of educational institutions that have transformed
            their ID management with Instipass.
          </p>
        </motion.div>

        {/* Client logos */}
        {loading ? (
          <div className="text-center text-gray-500">Loading institutions...</div>
        ) : (
          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {logos.slice(0, 24).map((logo, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`flex flex-col items-center justify-center p-6 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                } hover:shadow-md transition-shadow`}
              >
                <div className="w-12 h-12 rounded-full bg-[#1D3557] bg-opacity-10 flex items-center justify-center mb-3">
                  {logo.logo ? (
                    <img
                      src={logo.logo}
                      alt="Institution Logo"
                      className="rounded-full h-9 w-9"
                    />
                  ) : logo.institution_type?.includes("University") ? (
                    <Building size={24} className="text-[#1D3557]" />
                  ) : logo.institution_type?.includes("College") ? (
                    <Users size={24} className="text-[#1D3557]" />
                  ) : logo.institution_type?.includes("Technical") ? (
                    <Award size={24} className="text-[#1D3557]" />
                  ) : (
                    <CheckCircle size={24} className="text-[#1D3557]" />
                  )}
                </div>
                <h3 className="font-medium text-center">{logo.name}</h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {logo.institution_type}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Live activity notification */}
        <AnimatePresence>
          {showNotification && notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed bottom-24 right-6 z-40"
            >
              <div
                className={`p-4 rounded-lg shadow-lg max-w-xs ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {notifications[0].text}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {notifications[0].time}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ClientLogos;
