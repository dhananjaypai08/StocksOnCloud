import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const background = document.getElementById('background');
    function createLine() {
      const line = document.createElement('div');
      line.classList.add('line');
      line.style.left = `${Math.random() * 100}vw`;
      line.style.animationDuration = `${Math.random() * 10 + 5}s`;
      background.appendChild(line);
      setTimeout(() => {
        line.remove();
      }, 15000);
    }
    const intervalId = setInterval(createLine, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 text-yellow-400 overflow-hidden">
      <nav className="fixed top-0 left-0 w-full bg-gray-800 bg-opacity-90 backdrop-blur-sm flex justify-between items-center p-4 shadow-lg z-10">
        <div className="text-2xl font-bold tracking-tight">TradeMaster</div>
        <div className="hidden md:flex gap-4">
          <a href="#features" className="hover:text-yellow-300 transition-colors duration-300">Features</a>
          <a href="#pricing" className="hover:text-yellow-300 transition-colors duration-300">Pricing</a>
          <a href="#about" className="hover:text-yellow-300 transition-colors duration-300">About</a>
        </div>
        <div className="hidden md:flex gap-2">
          <a href="#signin" className="px-4 py-2 text-gray-900 bg-yellow-400 rounded-full transition-all duration-300 hover:bg-yellow-300 hover:shadow-lg">Sign In</a>
          <a href="#register" className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded-full transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900">Register</a>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-yellow-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-20 flex flex-col items-center justify-center">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <a href="#features" className="text-xl mb-4 hover:text-yellow-300 transition-colors duration-300">Features</a>
          <a href="#pricing" className="text-xl mb-4 hover:text-yellow-300 transition-colors duration-300">Pricing</a>
          <a href="#about" className="text-xl mb-4 hover:text-yellow-300 transition-colors duration-300">About</a>
          <a href="#signin" className="text-xl mb-4 hover:text-yellow-300 transition-colors duration-300">Sign In</a>
          <a href="#register" className="text-xl hover:text-yellow-300 transition-colors duration-300">Register</a>
        </div>
      )}

      <div className="text-center pt-32 px-4">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-2 leading-tight">Transform Your Trading Experience</h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">A platform to trade securely, anytime and anywhere with advanced analytics and real-time market insights.</p>
          <motion.a
            href="#register"
            className="px-8 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-full transition-all duration-300 hover:bg-yellow-300 hover:shadow-lg inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.a>
        </motion.main>
      </div>

      <footer className="fixed bottom-4 left-4 right-4 flex justify-between items-center text-gray-400 text-sm">
        <p>&copy; 2024 TradeMaster. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-yellow-300 transition-colors duration-300">Privacy Policy</a>
          <a href="#terms" className="hover:text-yellow-300 transition-colors duration-300">Terms of Service</a>
        </div>
      </footer>

      <div className="absolute inset-0 overflow-hidden z-[-1]" id="background">
        {/* Background lines animation */}
      </div>

      <style jsx>{`
        .line {
          position: absolute;
          width: 1px;
          height: 100px;
          background: linear-gradient(180deg, transparent, #f1c40f, transparent);
          opacity: 0.4;
          animation: move 15s linear infinite;
        }
        @keyframes move {
          0% {
            transform: translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateY(100vh) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

