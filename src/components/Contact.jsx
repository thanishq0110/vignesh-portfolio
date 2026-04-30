import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import useScrollReveal from '../hooks/useScrollReveal';
import { AnimatedInput } from './AnimatedInput';
import { AnimatedTextarea } from './AnimatedTextarea';
import './Contact.css';

const Contact = () => {
  const [ref, isVisible] = useScrollReveal();
  const form = useRef();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    // EmailJS Configuration
    const SERVICE_ID = 'service_n7a5kga';
    const TEMPLATE_ID = 'template_wy4x0jc'; 
    const PUBLIC_KEY = 'c3-hx80OlOI95XTxp';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      }, (error) => {
        console.error('Email failed to send:', error.text);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      });
  };

  return (
    <section id="contact" className="contact-section" ref={ref}>
      <div className={`contact-container reveal-container ${isVisible ? 'visible' : ''}`}>
        <h2 className="section-title">03. Let's Connect</h2>
        <p className="contact-desc">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your next big game or cinematic experience.
        </p>
        
        <form ref={form} className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <AnimatedInput 
              id="name" 
              name="name"
              label="Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <AnimatedInput 
              id="email" 
              name="email"
              type="email"
              label="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <AnimatedTextarea 
              id="message" 
              name="message"
              label="Message" 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary submit-btn ${status === 'sending' ? 'loading' : ''}`}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="form-status success">Message sent successfully! I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="form-status error">Something went wrong. Please try again or email me directly.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
