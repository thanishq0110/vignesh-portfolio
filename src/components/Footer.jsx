import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Vignesh Sai. All rights reserved.</p>
        <div className="social-links">
          <a href="https://www.instagram.com/__lens_09__/" target="_blank" rel="noopener noreferrer">Insta</a>
          <a href="https://x.com/SaiVign54978906" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
