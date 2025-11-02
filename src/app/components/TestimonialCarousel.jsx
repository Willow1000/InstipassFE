"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getTestimonials, getLogos } from "../utils/fetch";

const TestimonialCarousel = ({ darkMode }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);

  // Range for random slice
  const MIN_COUNT = 3;
  const MAX_COUNT = 6;

  // Shuffle + slice helper
  const getRandomSlice = (arr) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const sliceCount =
      Math.floor(Math.random() * (MAX_COUNT - MIN_COUNT + 1)) + MIN_COUNT;
    return shuffled.slice(0, sliceCount);
  };

  // Fetch both testimonials and logos
  useEffect(() => {
    async function fetchData() {
      try {
        const [testimonialsData, logosData] = await Promise.all([
          getTestimonials(),
          getLogos(),
        ]);
        setTestimonials(testimonialsData || []);
        setLogos(logosData || []);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper functions
  const getInstitutionLogo = (institutionId) => {
    const institution = logos.find((l) => l.id === institutionId);
    return institution ? institution.logo : null;
  };

  const getInstitutionName = (institutionId) => {
    const institution = logos.find((l) => l.id === institutionId);
    return institution ? institution.name : "Unknown Institution";
  };

  // State for randomized testimonials
  const [shuffledTestimonials, setShuffledTestimonials] = useState([]);

  // Initialize shuffled testimonials after load
  useEffect(() => {
    if (testimonials.length > 0) {
      setShuffledTestimonials(getRandomSlice(testimonials));
    }
  }, [testimonials]);

  const nextSlide = () => {
    if (activeIndex + 1 >= shuffledTestimonials.length) {
      setShuffledTestimonials(getRandomSlice(testimonials));
      setActiveIndex(0);
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) =>
        (prev - 1 + shuffledTestimonials.length) % shuffledTestimonials.length
    );
  };

  // Handle autoplay
  useEffect(() => {
    if (autoplay && shuffledTestimonials.length > 0) {
      autoplayRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, activeIndex, shuffledTestimonials]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Early exit if still loading
  if (loading) {
    return (
      <section
        id="testimonials"
        className={`py-16 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-6 text-center">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading testimonials...
          </p>
        </div>
      </section>
    );
  }

  if (!shuffledTestimonials || shuffledTestimonials.length === 0) {
    return (
      <section
        id="testimonials"
        className={`py-16 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-6 text-center">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No testimonials available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className={`py-16 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p
            className={`max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Hear from institutions that have transformed their ID management
            with Instipass.
          </p>
        </motion.div>

        <div
          className="max-w-2xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {shuffledTestimonials.map((testimonial, index) => {
                const logo = getInstitutionLogo(testimonial.institution);
                const name = getInstitutionName(testimonial.institution);

                return (
                  <div
                    key={testimonial.id || index}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div
                      className={`p-6 rounded-xl ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } shadow-lg max-w-lg mx-auto`}
                    >
                      <div className="mb-4 h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Institution logo"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <p className="text-xs text-gray-500">Logo</p>
                        )}
                      </div>
                      <div className="flex justify-center mb-4">
                        {[...Array(Math.floor(testimonial.rating))].map(
                          (_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className="text-yellow-400"
                              fill="currentColor"
                            />
                          )
                        )}
                        {testimonial.rating % 1 === 0.5 && (
                          <div className="relative">
                            <Star
                              size={20}
                              className="text-yellow-400"
                              fill="currentColor"
                            />
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-100 opacity-80"></div>
                          </div>
                        )}
                      </div>
                      <blockquote className="mb-4 text-base italic leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {testimonial.author}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className={`absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-white"
            } shadow-lg flex items-center justify-center z-10 focus:outline-none`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} className="text-[#1D3557]" />
          </button>

          <button
            onClick={nextSlide}
            className={`absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-white"
            } shadow-lg flex items-center justify-center z-10 focus:outline-none`}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} className="text-[#2A9D8F]" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-6">
            {shuffledTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === activeIndex
                    ? "bg-[#2A9D8F]"
                    : darkMode
                    ? "bg-gray-600"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
