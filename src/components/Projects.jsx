import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ZoomParallax from './ZoomParallax';
import CircularGallery from './CircularGallery';
import videoThumbnail from '../assets/video-thumbnail.jpg';
import imgBat from '../assets/work-bat.jpg';
import imgBlackhole from '../assets/work-blackhole.jpg';
import imgFantasyValley from '../assets/work-fantasy-valley.jpg';
import imgLandscape1 from '../assets/work-landscape-1.jpg';
import imgLandscape2 from '../assets/work-landscape-2.jpg';
import imgLandscape3 from '../assets/work-landscape-3.jpg';
import './Projects.css';

const surroundingImages = [
  {
    src: imgBlackhole,
    alt: 'Blackhole VFX',
  },
  {
    src: imgBat,
    alt: 'Bat Character Design',
  },
  {
    src: imgFantasyValley,
    alt: 'Fantasy Valley Environment',
  },
  {
    src: imgLandscape1,
    alt: 'High Res Landscape 1',
  },
  {
    src: imgLandscape2,
    alt: 'High Res Landscape 2',
  },
  {
    src: imgLandscape3,
    alt: 'High Res Landscape 3',
  },
];

const galleryItems = [
  {
    title: 'Hidden Temple',
    subtitle: 'Environment Design',
    video: '/gallery/reel-01.mp4',
    thumb: '/gallery/thumbs/reel-01.jpg',
  },
  {
    title: 'Horror Story',
    subtitle: 'Cinematic Sequence',
    video: '/gallery/reel-02.mp4',
    thumb: '/gallery/thumbs/reel-02.jpg',
  },
  {
    title: 'Relaxing',
    subtitle: 'Ambient Scene',
    video: '/gallery/reel-03.mp4',
    thumb: '/gallery/thumbs/reel-03.jpg',
  },
  {
    title: 'Last of Us',
    subtitle: 'Game Environment',
    video: '/gallery/reel-04.mp4',
    thumb: '/gallery/thumbs/reel-04.jpg',
  },
  {
    title: 'Blade Runner 2045',
    subtitle: 'Sci-Fi Environment',
    video: '/gallery/reel-05.mp4',
    thumb: '/gallery/thumbs/reel-05.jpg',
  },
  {
    title: 'Spiderman',
    subtitle: 'Character Animation',
    video: '/gallery/reel-06.mp4',
    thumb: '/gallery/thumbs/reel-06.jpg',
  },
  {
    title: 'Batman',
    subtitle: 'Dark Knight Scene',
    video: '/gallery/reel-07.mp4',
    thumb: '/gallery/thumbs/reel-07.jpg',
  },
  {
    title: 'Forest',
    subtitle: 'Environment Design',
    video: '/gallery/reel-08.mp4',
    thumb: '/gallery/thumbs/reel-08.jpg',
  },
  {
    title: 'House',
    subtitle: 'Architecture Visualization',
    video: '/gallery/reel-09.mp4',
    thumb: '/gallery/thumbs/reel-09.jpg',
  },
];

const Projects = ({ inWorksScene }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="projects"
      className="projects-section"
      style={{ padding: 0, maxWidth: '100%', margin: 0, position: 'relative' }}
    >
      {/* Section header */}
      <motion.div
        className="works-header"
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: inWorksScene ? 1 : 0,
          y: inWorksScene ? 0 : 40,
        }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="section-title works-title">02. Selected Works</h2>
        <p className="works-subtitle">{isMobile ? 'Tap to explore' : 'Scroll to explore'}</p>
      </motion.div>

      {/* Zoom Parallax gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inWorksScene ? 1 : 0 }}
        transition={{ duration: 1.0, delay: 0.5, ease: 'easeInOut' }}
      >
        <ZoomParallax videoSrc="/portfolio-showcase.mp4" thumbnailSrc={videoThumbnail} images={surroundingImages} />
      </motion.div>

      {/* Circular Gallery — always present, scroll down to see it */}
      <div className="circular-gallery-section">
        <div className="circular-gallery-sticky">
          <div className="circular-gallery-header">
            <h2>Gallery</h2>
          </div>
          <CircularGallery items={galleryItems} radius={isMobile ? 400 : 750} isMobile={isMobile} />
        </div>
      </div>
    </section>
  );
};

export default Projects;
