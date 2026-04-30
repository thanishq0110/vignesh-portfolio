import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './CircularGallery.css';

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const VolumeOnIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const CircularGallery = ({ items, radius = 600, autoRotateSpeed = 0.04 }) => {
  const ringRef = useRef(null);
  const cardsRef = useRef([]);
  const rotationRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const playerVideoRef = useRef(null);

  const [activeVideo, setActiveVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const anglePerItem = 360 / items.length;

  // Open fullscreen player
  const openPlayer = (item) => {
    document.body.style.overflow = 'hidden';
    setActiveVideo(item);
    setIsMuted(false);
  };

  // Close fullscreen player
  const closePlayer = () => {
    const video = playerVideoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    document.body.style.overflow = '';
    setActiveVideo(null);
  };

  // Toggle mute
  const toggleMute = () => {
    const video = playerVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Play video when player opens
  useEffect(() => {
    if (!activeVideo) return;
    const video = playerVideoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = false;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.play();
      });
    }
  }, [activeVideo]);

  // 3D rotation logic + mouse drag
  useEffect(() => {
    const isDraggingRef = { current: false };
    const dragStartXRef = { current: 0 };
    const dragStartRotRef = { current: 0 };
    const velocityRef = { current: 0 };
    const lastXRef = { current: 0 };
    const lastTimeRef = { current: 0 };

    const updateDOM = (rot) => {
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rot}deg)`;
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const itemAngle = i * anglePerItem;
        const totalRotation = rot % 360;
        const relativeAngle = (itemAngle + totalRotation + 360) % 360;
        const normalizedAngle = Math.abs(
          relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
        );
        const opacity = Math.max(0.3, 1 - normalizedAngle / 180);
        
        card.style.opacity = opacity;
      });
    };

    const handleScroll = () => {
      if (isDraggingRef.current) return;
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      // Smooth interpolation instead of snapping
      const target = scrollProgress * 360;
      rotationRef.current += (target - rotationRef.current) * 0.1;
      updateDOM(rotationRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    // Mouse drag handlers
    const handleStart = (clientX) => {
      isDraggingRef.current = true;
      isScrollingRef.current = true;
      dragStartXRef.current = clientX;
      dragStartRotRef.current = rotationRef.current;
      lastXRef.current = clientX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
      document.body.style.cursor = 'grabbing';
    };

    const handleMove = (clientX) => {
      if (!isDraggingRef.current) return;
      const dx = clientX - dragStartXRef.current;
      const now = Date.now();
      const dt = now - lastTimeRef.current;

      if (dt > 0) {
        velocityRef.current = (clientX - lastXRef.current) / dt;
      }

      lastXRef.current = clientX;
      lastTimeRef.current = now;

      rotationRef.current = dragStartRotRef.current + dx * 0.15;
      updateDOM(rotationRef.current);
    };

    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      isScrollingRef.current = false;
      document.body.style.cursor = '';
    };

    const handleMouseDown = (e) => { handleStart(e.clientX); e.preventDefault(); };
    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleMouseUp = () => handleEnd();

    // Touch handlers
    let touchStartY = 0;
    let isScrollIntent = false;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      isScrollIntent = false;
      handleStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      const dx = Math.abs(touchX - dragStartXRef.current);
      const dy = Math.abs(touchY - touchStartY);

      // If vertical movement is greater than horizontal, it's a page scroll
      if (!isScrollIntent && dy > dx && dy > 5) {
        isScrollIntent = true;
        isDraggingRef.current = false; // Cancel carousel drag
        return;
      }

      if (!isScrollIntent) {
        if (e.cancelable) e.preventDefault();
        handleMove(touchX);
      }
    };

    const handleTouchEnd = () => handleEnd();

    const autoRotate = () => {
      if (!isScrollingRef.current && !isDraggingRef.current) {
        // Apply momentum from drag
        if (Math.abs(velocityRef.current) > 0.001) {
          rotationRef.current += velocityRef.current * 5;
          velocityRef.current *= 0.88;
        } else {
          rotationRef.current += autoRotateSpeed;
        }
        updateDOM(rotationRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate);
    };

    const scene = ringRef.current?.parentElement;
    if (scene) {
      scene.addEventListener('mousedown', handleMouseDown);
      scene.addEventListener('touchstart', handleTouchStart, { passive: true });
      scene.style.cursor = 'grab';
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameRef.current = requestAnimationFrame(autoRotate);
    
    updateDOM(rotationRef.current);

    return () => {
      if (scene) {
        scene.removeEventListener('mousedown', handleMouseDown);
        scene.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [items.length, anglePerItem, autoRotateSpeed]);

  // Fullscreen video player portal
  const playerOverlay = createPortal(
    <AnimatePresence>
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="gallery-player-overlay"
        >
          <video
            ref={playerVideoRef}
            src={activeVideo.video}
            playsInline
            autoPlay
            preload="metadata"
            onEnded={closePlayer}
            className="gallery-player-video"
          />

          {/* Back button — bottom right */}
          <button className="gallery-player-btn gallery-player-back" onClick={closePlayer}>
            <BackIcon />
            <span>Back</span>
          </button>

          {/* Volume button — bottom left */}
          <button className="gallery-player-btn gallery-player-volume" onClick={toggleMute}>
            {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <>
      {playerOverlay}
      <div className="circular-gallery-scene">
        <div 
          className="circular-gallery-ring" 
          ref={ringRef}
          style={{ willChange: 'transform' }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            
            return (
              <div
                key={item.video}
                ref={(el) => (cardsRef.current[i] = el)}
                className="circular-gallery-card"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  willChange: 'opacity',
                }}
                onClick={() => openPlayer(item)}
              >
                <div className="circular-gallery-card-inner">
                  <video
                    src={item.video}
                    poster={item.thumb}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="gallery-card-video"
                    onMouseEnter={(e) => { e.currentTarget.load(); e.currentTarget.play().catch(() => {}); }}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="circular-gallery-card-info">
                    <h3>{item.title}</h3>
                    <em>{item.subtitle}</em>
                  </div>
                  <div className="gallery-card-play-icon">
                    <PlayIcon />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CircularGallery;
