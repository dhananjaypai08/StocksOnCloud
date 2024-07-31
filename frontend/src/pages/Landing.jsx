// import React, { useEffect, useRef } from 'react';
// import styled, { createGlobalStyle, keyframes } from 'styled-components';

// const GlobalStyle = createGlobalStyle`
//   body {
//     margin: 0;
//     padding: 0;
//     font-family: Arial, sans-serif;
//     background-color: #121212;
//     color: #f1c40f;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     min-height: 100vh;
//     overflow: hidden;
//     position: relative;
//   }
// `;

// const Navbar = styled.nav`
//   width: 100%;
//   background-color: #1f1f1f;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 10px 20px;
//   position: fixed;
//   top: 0;
//   left: 0;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
// `;

// const Logo = styled.div`
//   font-size: 1.5em;
//   font-weight: bold;
//   color: #f1c40f;
// `;

// const NavButtons = styled.div`
//   display: flex;
//   gap: 10px;
//   margin-right: 20px;
// `;

// const NavButton = styled.a`
//   padding: 6px 12px;
//   font-size: 0.8em;
//   color: #ffffff;
//   background-color: #f1c40f;
//   text-decoration: none;
//   border-radius: 5px;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #d4ac0d;
//   }
// `;

// const Container = styled.div`
//   text-align: center;
//   padding: 20px;
//   margin-top: 60px;
// `;

// const Title = styled.h2`
//   font-size: 2em;
//   margin-bottom: 0.5em;
// `;

// const Footer = styled.footer`
//   margin-top: 2em;
//   font-size: 0.7em;
//   color: #aaaaaa;
//   position: absolute;
//   bottom: 10px;
// `;

// const Background = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: -1;
//   overflow: hidden;
// `;

// const moveAnimation = keyframes`
//   0% {
//     transform: translateY(0) translateX(0);
//     opacity: 0.7;
//   }
//   50% {
//     opacity: 0.4;
//   }
//   100% {
//     transform: translateY(100vh) translateX(calc(100vw - 2px));
//     opacity: 0.1;
//   }
// `;

// const Line = styled.div`
//   position: absolute;
//   width: 2px;
//   height: 100px;
//   background: #f1c40f;
//   opacity: 0.7;
//   animation: ${moveAnimation} 10s linear infinite;
// `;

// const TradingPlatform = () => {
//   const backgroundRef = useRef(null);

//   useEffect(() => {
//     const createLine = () => {
//       const line = document.createElement('div');
//       line.style.left = `${Math.random() * 100}vw`;
//       line.style.animationDuration = `${Math.random() * 10 + 5}s`;
//       backgroundRef.current.appendChild(line);

//       setTimeout(() => {
//         line.remove();
//       }, 15000);

//       return line;
//     };

//     const interval = setInterval(() => {
//       const line = createLine();
//       line.className = Line.styledComponentId;
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <GlobalStyle />
//       <Navbar>
//         <Logo>TradeMaster</Logo>
//         <NavButtons>
//           <NavButton href="#register">Register Now</NavButton>
//           <NavButton href="#signin">Sign In</NavButton>
//         </NavButtons>
//       </Navbar>
//       <Container>
//         <main>
//           <Title>Unlock Your Trading Potential</Title>
//         </main>
//       </Container>
//       <Footer>
//         <p>&copy; 2024 TradeMaster. All rights reserved.</p>
//       </Footer>
//       <Background ref={backgroundRef} />
//     </>
//   );
// };

// export default TradingPlatform;
// ****************************
// import React from "react";
// import { motion } from "framer-motion";

// export const Landing = () => {
//   return (
//     <div className="min-h-screen bg-black text-yellow-400 flex flex-col">
//       <Header />
//       <main className="flex-grow flex items-center justify-center px-4 relative overflow-hidden">
//         <AnimatedBackground />
//         <div className="z-10 text-center max-w-3xl">
//           <motion.h1
//             className="text-5xl md:text-6xl font-bold mb-6"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             ABSTRACT LANDING PAGE
//           </motion.h1>
//           <motion.p
//             className="text-sm md:text-base mb-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
//             ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
//             aliquip ex ea commodo consequat. Duis aute irure dolor in
//             reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
//             pariatur
//           </motion.p>
//           <motion.button
//             className="bg-yellow-400 text-black py-2 px-6 rounded-full text-sm font-semibold hover:bg-yellow-300 transition duration-300"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//           >
//             GET STARTED
//           </motion.button>
//         </div>
//       </main>
//     </div>
//   );
// };

// const Header = () => {
//   return (
//     <header className="py-2 px-6">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="w-12 h-12 bg-yellow-400 opacity-50">
//           {/* Placeholder for logo */}
//         </div>
//         <div className="space-x-4">
//           <button className="bg-yellow-400 text-black px-3 py-1 rounded text-sm hover:bg-yellow-300 transition duration-300">
//             Sign Up
//           </button>
//           <button className="border border-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-400 hover:text-black transition duration-300">
//             Login
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// const AnimatedBackground = () => {
//   const lines = Array.from({ length: 20 }, (_, i) => (
//     <motion.div
//       key={i}
//       className="absolute bg-yellow-400 opacity-20"
//       style={{
//         width: "1px",
//         height: "100%",
//         left: `${Math.random() * 100}%`,
//         top: "-100%",
//       }}
//       animate={{
//         top: "200%",
//         left: `${Math.random() * 100}%`,
//       }}
//       transition={{
//         duration: Math.random() * 10 + 5,
//         repeat: Infinity,
//         ease: "linear",
//       }}
//     />
//   ));

//   return <div className="absolute inset-0">{lines}</div>;
// };

// export default Landing;
// ****************************
// import React, { useEffect } from "react";

// export const Landing = () => {
//   useEffect(() => {
//     const background = document.getElementById("background");

//     function createLine() {
//       const line = document.createElement("div");
//       line.classList.add("line");
//       line.style.left = `${Math.random() * 100}vw`;
//       line.style.animationDuration = `${Math.random() * 10 + 5}s`;
//       background.appendChild(line);

//       setTimeout(() => {
//         line.remove();
//       }, 15000);
//     }

//     const interval = setInterval(createLine, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="m-0 p-0 font-comic-sans bg-gray-900 text-yellow-500 flex flex-col justify-center items-center min-h-screen overflow-hidden relative">
//       <nav className="w-full bg-gray-800 flex justify-between items-center p-4 fixed top-0 left-0 shadow-md">
//         <div className="text-xl font-bold text-yellow-500">TradeMaster</div>
//         <div className="flex gap-2 mr-5">
//           <a
//             href="#register"
//             className="px-3 py-1 text-sm text-white bg-yellow-500 rounded transition hover:bg-yellow-600"
//           >
//             Register Now
//           </a>
//           <a
//             href="#signin"
//             className="px-3 py-1 text-sm text-white bg-yellow-500 rounded transition hover:bg-yellow-600"
//           >
//             Sign In
//           </a>
//         </div>
//       </nav>
//       <div className="text-center p-5 mt-20">
//         <main>
//           <h2 className="text-2xl mb-0">Transform Your Trading Experience</h2>
//           <p className="text-lg text-gray-400 mb-10">
//             A platform to trade securely, anytime and anywhere with proper
//             trading analysis
//           </p>
//           <a
//             href="#register"
//             className="px-5 py-2 text-lg text-white bg-yellow-500 rounded transition hover:bg-yellow-600"
//           >
//             Register Now
//           </a>
//         </main>
//       </div>
//       <footer className="mt-auto text-xs text-gray-400 fixed bottom-2 right-5">
//         <p>&copy; 2024 TradeMaster.</p>
//       </footer>
//       <div id="background"></div>

//       <style jsx>{`
//         #background {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           z-index: -1;
//           overflow: hidden;
//         }

//         .line {
//           position: absolute;
//           width: 2px;
//           height: 100px;
//           background: #f1c40f;
//           opacity: 0.7;
//           animation: move 10s linear infinite;
//         }

//         @keyframes move {
//           0% {
//             transform: translateY(0) translateX(0);
//             opacity: 0.7;
//           }
//           50% {
//             opacity: 0.4;
//           }
//           100% {
//             transform: translateY(100vh) translateX(calc(100vw - 2px));
//             opacity: 0.1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };
// **************************
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
