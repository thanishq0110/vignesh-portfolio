import React from 'react';
import TextScramble from './TextScramble';
import HeroShutterText from './HeroShutterText';
import SocialIconButton from './SocialIconButton';
import './Hero.css';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.263 5.633 5.901-5.633Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const Hero = () => {
  return (
    <section id="top" className="hero-section">
      <div className="hero-content">
        <h2 className="hero-greeting">Hi, I'm</h2>
        <HeroShutterText text="VIGNESH SAI" className="hero-name" />

        <div className="role-container">
          <TextScramble as="span" className="role" duration={1.5} delay={3.0} characterSet="XQKWZPBRTM">UNREAL ENGINE GAME DEV</TextScramble>
          <span className="separator">•</span>
          <TextScramble as="span" className="role" duration={1.5} delay={3.1} characterSet="XQKWZPBRTM">ANIMATION</TextScramble>
          <span className="separator">•</span>
          <TextScramble as="span" className="role" duration={1.5} delay={3.2} characterSet="XQKWZPBRTM">ENVIRONMENT DESIGNER</TextScramble>
        </div>

        <p className="hero-description">
          Crafting immersive worlds and cinematic experiences. I blend technical prowess with creative vision to build high-quality, interactive environments and games.
        </p>

        <div className="hero-social">
          <SocialIconButton
            href="https://www.instagram.com/__lens_09__/"
            icon={<InstagramIcon />}
            label="Instagram"
          />
          <SocialIconButton
            href="https://x.com/SaiVign54978906"
            icon={<XIcon />}
            label="X / Twitter"
          />
        </div>

      </div>

      {/* Abstract background element to simulate 3D/Cinematic lighting */}
      <div className="ambient-light"></div>
    </section>
  );
};

export default Hero;
