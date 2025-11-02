"use client"
import React, { useEffect, useState } from 'react';

const NotFoundPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('instipass-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    // Optional: Listen for changes to localStorage 'instipass-theme' from other parts of the app
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem('instipass-theme');
      setIsDarkMode(updatedTheme === 'dark');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary-dark: #1D3557;
          --primary-teal: #2A9D8F;
          --white: #FFFFFF;
          --light-gray: #F9FAFB;
          --border-gray: #E5E7EB;
          --text-gray-400: #9CA3AF;
          --text-gray-500: #6B7280;
          --text-gray-600: #4B5563;
          --text-gray-700: #374151;
          --text-gray-900: #111827;
          --dark-bg: #1F2937;
          --dark-card: #374151;
          --dark-border: #4B5563;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        body.dark {
          background: linear-gradient(135deg, var(--dark-bg) 0%, var(--text-gray-900) 100%);
          color: var(--white);
        }

        .container {
          text-align: center;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
        }

        .error-code {
          font-size: clamp(8rem, 15vw, 12rem);
          font-weight: 900;
          color: var(--primary-teal);
          line-height: 1;
          margin-bottom: 1rem;
          text-shadow: 0 4px 8px rgba(42, 157, 143, 0.3);
          animation: bounce 2s infinite;
          position: relative;
        }

        .error-code::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, rgba(42, 157, 143, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
          animation: pulse 3s infinite;
        }

        .error-title {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 1rem;
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        body.dark .error-title {
          color: var(--white);
        }

        .error-message {
          font-size: 1.125rem;
          color: var(--text-gray-600);
          margin-bottom: 2rem;
          line-height: 1.6;
          animation: fadeInUp 1s ease-out 0.6s both;
        }

        body.dark .error-message {
          color: var(--text-gray-400);
        }

        .buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 1s ease-out 0.9s both;
        }

        .btn {
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: var(--primary-teal);
          color: var(--white);
          box-shadow: 0 4px 12px rgba(42, 157, 143, 0.3);
        }

        .btn-primary:hover {
          background: #238276;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: var(--primary-dark);
          border: 2px solid var(--primary-dark);
        }

        body.dark .btn-secondary {
          color: var(--white);
          border-color: var(--white);
        }

        body.dark .btn-secondary:hover {
          background: var(--white);
          color: var(--primary-dark);
        }

        .floating-shapes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .shape {
          position: absolute;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .shape:nth-child(1) {
          top: 20%;
          left: 10%;
          width: 60px;
          height: 60px;
          background: var(--primary-teal);
          border-radius: 50%;
          animation-delay: 0s;
        }

        .shape:nth-child(2) {
          top: 60%;
          right: 15%;
          width: 40px;
          height: 40px;
          background: var(--primary-dark);
          border-radius: 4px;
          animation-delay: 2s;
        }

        .shape:nth-child(3) {
          bottom: 30%;
          left: 20%;
          width: 80px;
          height: 80px;
          background: var(--primary-teal);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation-delay: 4s;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }

        @media (max-width: 640px) {
          .container {
            padding: 1rem;
          }
          .buttons {
            flex-direction: column;
            align-items: center;
          }
          .btn {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>

      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="container">
        <div className="error-code">404</div>
        <h1 className="error-title">Oops! Page Not Found</h1>
        <p className="error-message">
          The page you're looking for seems to have wandered off into the digital wilderness.
          Don't worry, even the best explorers sometimes take a wrong turn!
        </p>

        <div className="buttons">
          <a href="/" className="btn btn-primary">
            <span>🏠</span>
            Go Home
          </a>
          <button onClick={goBack} className="btn btn-secondary">
            <span>←</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Go back functionality (can be moved inside the component if preferred)
const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
};

export default NotFoundPage;


