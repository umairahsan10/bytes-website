"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from '@/sections/Navbar';
import ZoomParallax from "@/components/ZoomParallax";

// Image paths adjusted to reference the public/assets directory
const img1 = "/assets/img1.jpg";
const img2 = "/assets/img-2.jpg";
const img3 = "/assets/img-3.jpg";
const img4 = "/assets/img-4.jpg";
const projImg = "/assets/Careers/Proj.png";
const cloudImg = "/assets/Careers/cloud.png";
const uiImg = "/assets/Careers/ui.png";
const marketImg = "/assets/Careers/market.png";
const frontendImg = "/assets/Careers/frontend.png";
const backendImg = "/assets/Careers/backend.png";
const contactImg = "/assets/career-contact.jpg";
const heroImg = "/assets/hero.jpg";

function App() {
    const [selectedJob, setSelectedJob] = useState(null);
    const [scrollPos, setScrollPos] = useState(0);
    const contactRef = useRef(null);
    const jobsRef = useRef(null);

    return (
        <div className="w-full min-h-screen overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full z-20">
                <Header />
            </div>
            {/* Hero Section */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-gray-900 pt-12">
                {/* Overlay Header */}

                <div className="absolute inset-0">
                    <Image src={heroImg} alt="Join Bytes Team" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8"
                >
                    <motion.h1
                        className="whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Build the Future with Us
                    </motion.h1>
                    <motion.p
                        className="mt-4 text-lg sm:text-2xl text-gray-200"
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Innovate, collaborate, and grow alongside a passionate team — where your ideas matter, your growth is prioritized, and your well-being is part of our mission.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => jobsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="mt-8 inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                        Explore Open Roles<span className="text-base sm:text-xl">→</span>
                    </motion.button>
                </motion.div>
            </section>

            {/* Parallax Image Gallery
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <ZoomParallax />
            </motion.div> */}

            {/* Jobs Section - Regular scrollable content */}
            <section ref={jobsRef} className="py-12 sm:py-16 lg:py-20 bg-white relative z-10">
                <div className="container mx-auto px-4">
                    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.h2
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Available Positions
                            </motion.h2>
                            <motion.p
                                className="max-w-2xl mx-auto text-center text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                Join our team and help shape the future of digital innovation.
                            </motion.p>
                        </motion.div>

                        {/* Job cards */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {[
                                {
                                    title: "Frontend Engineer",
                                    image: frontendImg,
                                    location: "On-site",
                                    type: "Internship / Full-time",
                                    requirements: [
                                        "3+ years React / Next.js",
                                        "Strong CSS / Tailwind",
                                        "Experience with GSAP is a plus"
                                    ]
                                },
                                {
                                    title: "Backend Engineer",
                                    image: backendImg,
                                    location: "On-site",
                                    type: "Internship / Full-time",
                                    requirements: [
                                        "3+ years Node.js / TypeScript",
                                        "Familiar with micro-services & REST",
                                        "Cloud experience (AWS/GCP)"
                                    ]
                                },
                                {
                                    title: "UI / UX Designer",
                                    image: uiImg,
                                    location: "On-site",
                                    type: "Internship / Full-time",
                                    requirements: [
                                        "Proficient in Figma / Adobe XD",
                                        "Solid portfolio of web & mobile apps",
                                        "Basic prototyping skills"
                                    ]
                                },
                                {
                                    title: "Digital Marketer",
                                    image: marketImg,
                                    location: "On-site",
                                    type: "Internship / Full-time",
                                    requirements: [
                                        "Knowledge of SEO & SEM",
                                        "Hands-on with social media ads",
                                        "Analytical mindset"
                                    ]
                                },
                                {
                                    title: "Cloud DevOps",
                                    image: cloudImg,
                                    location: "On-site",
                                    type: "Internship / Full-time",
                                    requirements: [
                                        "IaC (Terraform/CDK)",
                                        "CI/CD pipelines (GitHub Actions)",
                                        "Monitoring & logging"
                                    ]
                                },
                                {
                                    title: "Project Manager",
                                    image: projImg,
                                    location: "On-site",
                                    type: "Internship / Full-time",
                                    requirements: [
                                        "5+ years managing software teams",
                                        "Agile / Scrum mastery",
                                        "Excellent communication"
                                    ]
                                }
                            ].map((job) => {
                                return (
                                    <motion.div
                                        key={job.title}
                                        className="group cursor-pointer bg-gradient-to-br from-blue-100 via-white to-purple-100 p-[1px] rounded-xl sm:rounded-2xl w-full hover:shadow-lg hover:shadow-blue-200/60 transition-all duration-500 ease-out border border-gray-200 transform hover:scale-105"
                                        onClick={() => setSelectedJob(job)}
                                        whileHover={{ y: -8, scale: 1.05, rotate: 0.5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        variants={{
                                            hidden: { opacity: 0, y: 50, scale: 0.9 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                transition: {
                                                    duration: 0.6,
                                                    ease: [0.25, 0.46, 0.45, 0.94]
                                                }
                                            }
                                        }}
                                    >
                                        <div className="rounded-xl sm:rounded-2xl h-full w-full bg-white/90 backdrop-blur-sm p-4 sm:p-6 min-h-[140px] sm:min-h-[160px] flex flex-col justify-between group-hover:bg-white transition-all duration-500 ease-out">
                                            {job.image && (
                                                <div className="relative w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
                                                    <Image
                                                        src={job.image}
                                                        alt={job.title}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-gray-900 text-lg sm:text-xl md:text-2xl font-semibold mb-2 group-hover:text-blue-700 transition-colors duration-300">{job.title}</h3>
                                                <p className="text-gray-600 text-xs sm:text-sm md:text-base group-hover:text-gray-700 transition-colors duration-300">{job.location}</p>
                                                <span className="inline-block mt-2 px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200 group-hover:bg-blue-200 group-hover:border-blue-300 transition-all duration-300">{job.type}</span>
                                            </div>
                                            <p className="mt-3 sm:mt-4 text-blue-600 text-xs sm:text-sm font-medium transition-all duration-300 ease-out">View details →</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section ref={contactRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50 md:min-h-screen md:flex md:items-center">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                        {/* Left side - Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 sm:space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                                    Let's Connect
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                                    Ready to take the next step in your career? We'd love to hear from you.
                                </p>
                            </div>

                            <div className="space-y-6 bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50">
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium text-sm">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value=""
                                            onChange={() => { }}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium text-sm">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value=""
                                            onChange={() => { }}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value=""
                                        onChange={() => { }}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                        placeholder="Job Application - Frontend Engineer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        required
                                        value=""
                                        onChange={() => { }}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                        placeholder="Tell us about yourself and why you're interested in joining our team..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Upload Your CV</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            name="cv"
                                            accept="application/pdf,.doc,.docx"
                                            onChange={() => { }}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/50 backdrop-blur-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm sm:text-base"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX files only (Max 5MB)</p>
                                </div>

                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => alert('Form submitted! (In a real app, this would handle the submission)')}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                >
                                    Send Application
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Right side - Elegant Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div
                                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl h-64 sm:h-[420px] lg:h-[600px]"
                                style={{ aspectRatio: "4/5" }}
                            >
                                <Image src={contactImg} alt="Contact" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/30" />

                                {/* Decorative elements */}
                                <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 lg:w-20 sm:h-16 lg:h-20 bg-white/10 rounded-full backdrop-blur-sm"></div>
                                <div className="absolute bottom-4 left-4 w-10 h-10 sm:w-12 lg:w-16 sm:h-12 lg:h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
                                <div className="absolute top-1/2 left-4 w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-full backdrop-blur-sm"></div>
                            </div>

                            {/* Floating stats */}
                            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-white/50">
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-blue-600">50+</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Team Members</div>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-white/50">
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-purple-600">100%</div>
                                    <div className="text-xs sm:text-sm text-gray-600">On-site / Remote Friendly</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Modal with AnimatePresence */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 w-full h-full overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedJob(null)}
                    >
                        <motion.div
                            className="relative bg-white border border-gray-200 rounded-2xl sm:rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl my-8 mx-auto max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                                y: 50
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                                y: 50
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        >
                            <button
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10"
                                onClick={() => setSelectedJob(null)}
                                aria-label="Close"
                            >
                                ✕
                            </button>

                            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                                {/* Left side - Job Details */}
                                <div className="md:col-span-2 space-y-4 sm:space-y-6">
                                    <div>
                                        <h3 className="text-gray-900 text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pr-12">
                                            {selectedJob.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-gray-600 flex-wrap">
                                            <span className="text-sm sm:text-base">{selectedJob.location}</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full hidden sm:block"></span>
                                            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm rounded-full border border-blue-200">
                                                {selectedJob.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-gray-900 font-semibold text-base sm:text-lg">Requirements</h4>
                                        <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                                            {selectedJob.requirements.map((req, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="mt-2 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-gray-900 font-semibold text-base sm:text-lg">About the Role</h4>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                            Join our dynamic team and contribute to cutting-edge projects that shape the future of technology.
                                            We offer a collaborative environment where innovation thrives and your ideas make a real impact.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-gray-600 mb-4 text-sm sm:text-base">Ready to join our team?</p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedJob(null);
                                                    // smooth scroll to contact form
                                                    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-transform duration-300 hover:scale-105 text-sm sm:text-base"
                                            >
                                                Apply Now<span className="text-base sm:text-lg">→</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedJob(null)}
                                                className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base"
                                            >
                                                Back to Jobs
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Job Image and Info */}
                                <div className="md:col-span-1 space-y-4">
                                    {selectedJob.image && (
                                        <div className="relative">
                                            <Image
                                                src={selectedJob.image}
                                                alt={selectedJob.title}
                                                width={600}
                                                height={350}
                                                className="w-full h-48 sm:h-56 rounded-xl object-cover shadow-lg"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                                        </div>
                                    )}

                                    {/* Additional Info Cards */}
                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm-1 4a1 1 0 112 0v4a1 1 0 11-2 0v-4zm8 0a1 1 0 112 0v4a1 1 0 11-2 0v-4z" clipRule="evenodd" />
                                                </svg>
                                                <h5 className="font-semibold text-gray-900 text-sm">Benefits</h5>
                                            </div>
                                            <ul className="text-xs text-gray-600 space-y-1">
                                                <li>• Competitive salary</li>
                                                <li>• Health insurance</li>
                                                <li>• Flexible working hours</li>
                                                <li>• Professional development</li>
                                            </ul>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <h5 className="font-semibold text-gray-900 text-sm">Work Style</h5>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {selectedJob.location.includes('Remote') ? 'Fully remote with optional office visits' :
                                                    selectedJob.location.includes('Hybrid') ? 'Flexible hybrid work arrangement' :
                                                        'On-site collaboration in modern office'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;