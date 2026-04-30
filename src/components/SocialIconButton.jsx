import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated pill button that expands on hover to reveal a label.
 * @param {string} href - External URL
 * @param {React.ReactNode} icon - SVG icon element
 * @param {string} label - Platform name shown on hover
 */
const SocialIconButton = ({ href, icon, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-no-cursor
      style={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <motion.div
        initial={{ width: 48, height: 48 }}
        whileHover={{ width: 160 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          borderRadius: 24,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {/* Icon — fades out on hover */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          animate={{
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0.7 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>

        {/* Label — fades in on hover */}
        <motion.div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
          <span
            style={{
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </motion.div>
      </motion.div>
    </a>
  );
};

export default SocialIconButton;
