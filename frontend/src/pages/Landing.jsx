import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #121212;
    color: #f1c40f;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
  }
`;

const Navbar = styled.nav`
  width: 100%;
  background-color: #1f1f1f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  color: #f1c40f;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 20px;
`;

const NavButton = styled.a`
  padding: 6px 12px;
  font-size: 0.8em;
  color: #ffffff;
  background-color: #f1c40f;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4ac0d;
  }
`;

const Container = styled.div`
  text-align: center;
  padding: 20px;
  margin-top: 60px;
`;

const Title = styled.h2`
  font-size: 2em;
  margin-bottom: 0.5em;
`;

const Footer = styled.footer`
  margin-top: 2em;
  font-size: 0.7em;
  color: #aaaaaa;
  position: absolute;
  bottom: 10px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

const moveAnimation = keyframes`
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(100vh) translateX(calc(100vw - 2px));
    opacity: 0.1;
  }
`;

const Line = styled.div`
  position: absolute;
  width: 2px;
  height: 100px;
  background: #f1c40f;
  opacity: 0.7;
  animation: ${moveAnimation} 10s linear infinite;
`;

const TradingPlatform = () => {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const createLine = () => {
      const line = document.createElement('div');
      line.style.left = `${Math.random() * 100}vw`;
      line.style.animationDuration = `${Math.random() * 10 + 5}s`;
      backgroundRef.current.appendChild(line);

      setTimeout(() => {
        line.remove();
      }, 15000);

      return line;
    };

    const interval = setInterval(() => {
      const line = createLine();
      line.className = Line.styledComponentId;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Navbar>
        <Logo>TradeMaster</Logo>
        <NavButtons>
          <NavButton href="#register">Register Now</NavButton>
          <NavButton href="#signin">Sign In</NavButton>
        </NavButtons>
      </Navbar>
      <Container>
        <main>
          <Title>Unlock Your Trading Potential</Title>
        </main>
      </Container>
      <Footer>
        <p>&copy; 2024 TradeMaster. All rights reserved.</p>
      </Footer>
      <Background ref={backgroundRef} />
    </>
  );
};

export default TradingPlatform;