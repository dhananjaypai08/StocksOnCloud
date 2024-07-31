
import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export const Landing = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    // ... (keep the existing particles options)
  };

  return (
    <div className="m-0 p-0 font-comic-sans bg-gray-900 text-yellow-500 min-h-screen overflow-hidden relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      <nav className="w-full bg-gray-800 bg-opacity-80 flex justify-between items-center p-4 fixed top-0 left-0 shadow-md z-10">
        <div className="text-xl font-bold text-yellow-500">TradeMaster</div>
        <div className="flex gap-2 mr-5">
          <a
            href="#register"
            className="px-3 py-1 text-sm text-white bg-yellow-500 rounded transition hover:bg-yellow-600"
          >
            Register
          </a>
          <a
            href="#signin"
            className="px-3 py-1 text-sm text-white bg-yellow-500 rounded transition hover:bg-yellow-600"
          >
            Sign In
          </a>
        </div>
      </nav>
      <div className="flex justify-between items-center h-screen px-10">
        <div className="w-1/2 text-left z-10">
          <h2 className="text-4xl font-bold mb-4">
            Transform Your Trading Experience
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            A platform to trade securely, anytime and anywhere with proper
            trading analysis
          </p>
          <a
            href="#register"
            className="px-6 py-3 text-lg text-white bg-yellow-500 rounded-full transition hover:bg-yellow-600"
          >
            Register Now
          </a>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <img
            src="https://www.pngall.com/wp-content/uploads/8/Forex-Trading-PNG-Image.png"
            alt="Trading Platform Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
      <footer className="text-xs text-gray-400 fixed bottom-2 right-5 z-10">
        <p>&copy; 2024 TradeMaster.</p>
      </footer>
    </div>
  );
};

// export default TradingPlatform;
