import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const PLAY_THRESHOLD = 0.5;

/**
 * Zoom parallax grid with fullscreen video trigger.
 * Center zooms in like a photo → at threshold a fullscreen overlay takes over,
 * plays the video with audio, locks scroll until ended.
 *
 * @param {string} videoSrc - Video asset for the center
 * @param {{ src: string, alt?: string }[]} images - Up to 6 surrounding images
 */
const ZoomParallax = ({ videoSrc, thumbnailSrc, images }) => {
  const container = useRef(null);
  const videoRef = useRef(null);
  const hasPlayedRef = useRef(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const surroundingScales = [scale5, scale6, scale5, scale6, scale8, scale9];

  const desktopPositions = [
    { top: '-30vh',   left: '5vw',     height: '30vh', width: '35vw' },
    { top: '-10vh',   left: '-25vw',   height: '45vh', width: '20vw' },
    { top: '0',       left: '27.5vw',  height: '25vh', width: '25vw' },
    { top: '27.5vh',  left: '5vw',     height: '25vh', width: '20vw' },
    { top: '27.5vh',  left: '-22.5vw', height: '25vh', width: '30vw' },
    { top: '22.5vh',  left: '25vw',    height: '15vh', width: '15vw' },
  ];

  // On mobile, the cleanest and most premium look is a single central video zooming in,
  // without the distraction of cluttered surrounding images.
  const mobilePositions = [];

  const positions = isMobile ? mobilePositions : desktopPositions;
  const visibleImages = isMobile ? [] : images.slice(0, 6);
  const thumbnailWidth = isMobile ? '85vw' : '25vw';

  const enterFullscreen = () => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Prevent default on wheel and touchmove as a fallback
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    window.__preventScroll = preventScroll;
    
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    if (window.__preventScroll) {
      document.removeEventListener('wheel', window.__preventScroll);
      document.removeEventListener('touchmove', window.__preventScroll);
      delete window.__preventScroll;
    }
    
    setIsFullscreen(false);
    setHasFinished(true);
  };

  // Trigger once when scroll passes threshold
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (hasPlayedRef.current) return;
    if (progress < PLAY_THRESHOLD) return;

    hasPlayedRef.current = true;
    enterFullscreen();
  });

  // Play video once the overlay is mounted
  useEffect(() => {
    if (!isFullscreen) return;
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = false;
    setIsMuted(false);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked unmuted autoplay — fall back to muted
        video.muted = true;
        setIsMuted(true);
        video.play();
      });
    }
  }, [isFullscreen]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Portal the fullscreen overlay to document.body so parent opacity can't hide it
  const fullscreenOverlay = createPortal(
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            poster={thumbnailSrc}
            playsInline
            autoPlay
            preload="metadata"
            onEnded={exitFullscreen}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              background: '#000',
            }}
          />

          {/* Unmute button */}
          <button
            onClick={toggleMute}
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '2.5rem',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>

          {/* Skip button */}
          <button
            onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.pause();
                video.currentTime = 0;
              }
              exitFullscreen();
            }}
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              right: '2.5rem',
              padding: '0.6rem 1.6rem',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
            }}
          >
            Skip ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <>
      {fullscreenOverlay}

      {/* ── Zoom parallax scene ── */}
      <div ref={container} style={{ position: 'relative', height: '300vh', zIndex: 1 }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', willChange: 'transform' }}>

          {/* Center — thumbnail zooms in */}
          <motion.div
            style={{
              scale: scale4,
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            <div style={{
              position: 'relative',
              width: thumbnailWidth,
              height: `calc(${thumbnailWidth} * 9 / 16)`,
            }}>
              <img
                src={thumbnailSrc}
                alt="Video Thumbnail"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'auto',
                  filter: 'grayscale(100%) contrast(1.1)',
                  transition: 'filter 0.5s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%) contrast(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(100%) contrast(1.1)'}
              />
              
              {/* Replay Overlay */}
              <AnimatePresence>
                {hasFinished && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={enterFullscreen}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      zIndex: 50,
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        borderLeft: '14px solid white',
                        marginLeft: '4px'
                      }} />
                    </div>
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.8rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      fontWeight: 500
                    }}>Replay Video</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Surrounding images */}
          {visibleImages.map(({ src, alt }, index) => {
            const scale = surroundingScales[index % surroundingScales.length];
            const pos = positions[index];

            return (
              <motion.div
                key={index}
                style={{
                  scale,
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    height: pos.height,
                    width: pos.width,
                    top: pos.top,
                    left: pos.left,
                  }}
                >
                  <img
                    src={src}
                    alt={alt || `Work ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'auto',
                      filter: 'grayscale(100%) contrast(1.1)',
                      transition: 'filter 0.5s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%) contrast(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(100%) contrast(1.1)'}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ZoomParallax;
