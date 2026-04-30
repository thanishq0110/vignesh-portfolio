import React, { useEffect, useRef, useState } from 'react';

export function TubesCursorEffect({ color = '#ffffff' }) {
  const canvasRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);

  // Check if we are on desktop
  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    updateMedia();
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let mouseMoved = false;
    let reqId = null;
    let isCursorPaused = false;

    // Initialize off-screen so it's not a visible dot
    const pointer = {
      x: -1000,
      y: -1000,
    };
    
    const params = {
      pointsNumber: 40,
      widthFactor: 0.3,
      mouseThreshold: 0.6,
      spring: 0.4,
      friction: 0.5,
    };

    const trail = new Array(params.pointsNumber).fill(null).map(() => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));

    function updateMousePosition(eX, eY) {
      if (!mouseMoved) {
        // Snap trail to first touch/mouse location immediately
        mouseMoved = true;
        trail.forEach(p => {
          p.x = eX;
          p.y = eY;
        });
      }
      pointer.x = eX;
      pointer.y = eY;
    }

    const handleClick = (e) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    function setupCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleMouseOver = (e) => {
      if (e.target.closest('[data-no-cursor]')) isCursorPaused = true;
    };
    const handleMouseOut = (e) => {
      if (e.target.closest('[data-no-cursor]')) isCursorPaused = false;
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', setupCanvas);

    setupCanvas();

    function update(t) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Do not draw anything until the user has actually moved their mouse
      // or when cursor is paused over a no-cursor element
      if (!mouseMoved || isCursorPaused) {
        reqId = window.requestAnimationFrame(update);
        return;
      }

      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
        
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
      }
      
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      reqId = window.requestAnimationFrame(update);
    }

    reqId = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', setupCanvas);
      if (reqId) cancelAnimationFrame(reqId);
    };
  }, [color, isDesktop]);

  if (!isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999, // Make sure it sits on top of the content
      }}
    />
  );
}

export default TubesCursorEffect;
