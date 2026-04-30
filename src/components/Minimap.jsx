import React, { useEffect, useState } from 'react';
import './Minimap.css';

const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export function Minimap({ inWorksScene = false }) {
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
    // Intersect Observer to track which section is highly visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section hits upper/middle portion of screen
        threshold: 0,
      }
    );

    // Observe each section
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="minimap-container"
      style={{
        opacity: inWorksScene ? 0 : 1,
        pointerEvents: inWorksScene ? 'none' : 'auto',
        transition: 'opacity 0.8s ease',
      }}
    >
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => handleClick(e, id)}
          className={`minimap-item ${activeSection === id ? 'active' : ''}`}
        >
          <span className="minimap-label">{label}</span>
          <div className="minimap-dot" />
        </a>
      ))}
    </div>
  );
}

export default Minimap;
