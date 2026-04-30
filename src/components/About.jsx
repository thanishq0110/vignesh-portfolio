import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import Photo from '../assets/Photo.jpg';
import './About.css';

const About = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="about" className="about-section" ref={ref}>
      <div className={`about-content reveal-container ${isVisible ? 'visible' : ''}`}>
        <h2 className="section-title">01. About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I am a passionate Unreal Engine Game Developer and Environment Designer, dedicated to creating visually stunning, performance-optimized, and highly immersive worlds. 
            </p>
            <p>
              With a strong foundation in animation and cinematic lighting, my workflow spans from initial concept to final render. I focus on realistic texturing, advanced materials, and intricate level design that tell a story without speaking a word.
            </p>
            <div className="skills-list">
              <div className="skill-item">Unreal Engine 5</div>
              <div className="skill-item">Level Design</div>
              <div className="skill-item">Environment Art</div>
              <div className="skill-item">Animation Pipeline</div>
              <div className="skill-item">Cinematic Lighting</div>
              <div className="skill-item">Blueprints</div>
            </div>
          </div>
          <div className="about-image-container">
            <div className="about-image-wrapper">
              <img src={Photo} alt="Vignesh Sai" className="about-image" />
              <div className="corner-accent top-left"></div>
              <div className="corner-accent bottom-right"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
