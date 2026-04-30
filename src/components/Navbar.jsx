import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ inWorksScene = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="navbar"
      style={{
        opacity: inWorksScene ? 0 : 1,
        pointerEvents: inWorksScene ? 'none' : 'auto',
        transition: 'opacity 0.8s ease',
      }}
    >
      <div className="navbar-container">
        <div className="logo">
          <a href="#top">VS.</a>
        </div>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
          <li><a href="#projects" onClick={closeMenu}>Work</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
