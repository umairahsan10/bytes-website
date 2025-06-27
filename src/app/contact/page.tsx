"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import "./contact.css";
import Image from 'next/image';
import { Header } from "../../sections/Navbar";
import { useRouter } from 'next/navigation';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear form data
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    
    // Redirect to thank you page
    router.push('/thank-you');
  };

  return (
    <>
      {/* Navigation Bar */}
      <Header  />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden text-center bg-gray-800">
        {/* Background Image */}
        <Image
          src="/assets/contactbg.png"
          alt="Contact background"
          fill
          priority
          className="object-cover object-center absolute inset-0 z-0"
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/60 via-purple-700/50 to-violet-800/40 z-0" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-indigo-100 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with any questions, feedback, or collaboration ideas—our team will respond promptly.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <div className='mt-20 bg-white'>
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
                  <p>92 Cherry Drive Uniondale, NY 11553</p>
                </div>
                <div className="information">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <p>lorem@ipsum.com</p>
                </div>
                <div className="information">
                  <FontAwesomeIcon icon={faPhoneVolume} className="icon" />
                  <p>123-456-789</p>
                </div>
              </div>

              <div className="social-media">
                <p>Connect with us :</p>
                <div className="social-icons">
                  <a href="#">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="#">
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
                  <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} />
                  <label htmlFor="">Username</label>
                </div>
                <div className="input-container">
                  <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} />
                  <label htmlFor="">Email</label>
                </div>
                <div className="input-container">
                  <input type="tel" name="phone" className="input" value={formData.phone} onChange={handleChange} />
                  <label htmlFor="">Phone</label>
                </div>
                <div className="input-container textarea">
                  <textarea name="message" className="input" value={formData.message} onChange={handleChange}></textarea>
                  <label htmlFor="">Message</label>
                </div>
                <input 
                  type="submit" 
                  value={isSubmitting ? "Sending..." : "Send"} 
                  className="btn" 
                  disabled={isSubmitting}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;