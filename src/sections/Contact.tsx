"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import "./contact.css";
import Image from 'next/image';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<{email?: string; phone?: string}>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Accept 10-digit US numbers with optional formatting
  const phoneRegex = /^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    // live validation
    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: emailRegex.test(value) ? '' : 'Invalid email address' }));
    }
    if (name === 'phone') {
      // Allow only digits and limited formatting characters while typing
      let cleaned = value.replace(/[^0-9\s().+-]/g, '');
      const digitsOnly = cleaned.replace(/\D/g, '');
      if (digitsOnly.length > 10) {
        // prevent input beyond 10 significant digits (ignoring +1 which we strip)
        return;
      }
      setFormData(prevState => ({ ...prevState, phone: cleaned }));
      setErrors(prev => ({ ...prev, phone: phoneRegex.test(cleaned) ? '' : 'Enter a valid 10-digit phone number' }));
      return;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // final validation check
    const emailError = emailRegex.test(formData.email) ? '' : 'Invalid email address';
    const phoneError = phoneRegex.test(formData.phone) ? '' : 'Enter a valid 10-digit phone number';
    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
  };

  return (
    <>
     
      {/* Contact Form Section */}
      <div className='pt-20 bg-[#fafafa]'>
        <div className="container1">
          <span className="big-circle"></span>
          <img src="img/shape.png" className="square" alt="" />
          <div className="form">
            <div className="contact-info">
              <h3 className="title">Let's get in touch</h3>
              <p className="text">
              We'd love to hear from you! Whether you have a question, feedback, or just want to chat, feel free to reach out. Contact us through the form below or via our social media channels.  
              </p>

              <div className="info">
                <div className="information">
                  <FontAwesomeIcon icon={faLocationDot} className="icon" />
                  <a href="https://www.google.com/maps/search/?api=1&query=Bytes+Platform+LLC,+2809+Joshua+Street+Denton,+Texas,+United+States" target="_blank" rel="noopener noreferrer">Bytes Platform LLC, 2809 Joshua Street Denton, Texas, United States</a>
                </div>
                <div className="information">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <a href="mailto:info@bytesplatform.com">info@bytesplatform.com</a>
                </div>
                <div className="information">
                  <FontAwesomeIcon icon={faPhoneVolume} className="icon" />
                  <a href="tel:18333230371">833-323-0371 (Toll Free)</a>
                </div>
              </div>

              <div className="social-media">
                <p>Connect with us :</p>
                <div className="social-icons">
                  <a href="https://www.facebook.com/share/1BT8jkeBKK/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a href="https://www.instagram.com/bytesplatform?igsh=aG50c3VvZmlrMG5o" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <span className="circle one"></span>
              <span className="circle two"></span>

              <form className="sub-form" action="index.html" autoComplete="off" onSubmit={handleSubmit}>
                <h3 className="title">Contact us</h3>
                <div className="input-container">
                  <input type="text" name="name" className="input" placeholder="Username" onChange={handleChange} />
                </div>
                <div className="input-container">
                  <input type="email" name="email" className="input" placeholder="Email" onChange={handleChange} />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="input-container">
                  <input type="tel" name="phone" className="input" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                <div className="input-container textarea">
                  <textarea name="message" className="input" placeholder="Message" onChange={handleChange}></textarea>
                </div>
                <input type="submit" data-cta="true" value="Send" className="btn" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
export const ContactSection = Contact;