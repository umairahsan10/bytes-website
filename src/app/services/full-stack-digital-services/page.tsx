"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { useState, useEffect } from "react";

export default function FullStackDigitalServicesPage() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Frontend Development",
      description: "Modern, responsive user interfaces built with cutting-edge technologies",
      icon: "🎨",
      features: ["React/Next.js", "TypeScript", "Tailwind CSS", "Progressive Web Apps"]
    },
    {
      title: "Backend Development", 
      description: "Scalable server architecture and robust API development",
      icon: "⚙️",
      features: ["Node.js/Python", "Database Design", "API Integration", "Cloud Services"]
    },
    {
      title: "Full-Stack Solutions",
      description: "Complete end-to-end application development and deployment",
      icon: "🚀",
      features: ["DevOps", "CI/CD Pipeline", "Performance Optimization", "Security Implementation"]
    }
  ];

  const projects = [
    {
      title: "E-Commerce Platform",
      category: "Full-Stack Web App",
      image: "🛒",
      description: "Complete shopping experience with payment integration"
    },
    {
      title: "SaaS Dashboard",
      category: "React Application", 
      image: "📊",
      description: "Analytics dashboard with real-time data visualization"
    },
    {
      title: "Mobile-First PWA",
      category: "Progressive Web App",
      image: "📱",
      description: "Cross-platform mobile experience with offline capabilities"
    },
    {
      title: "API Gateway",
      category: "Backend Service",
      image: "🔗",
      description: "Microservices architecture with scalable API management"
    },
    {
      title: "Real-time Chat App",
      category: "Full-Stack Solution",
      image: "💬",
      description: "WebSocket-based communication platform"
    },
    {
      title: "AI-Powered Analytics",
      category: "Machine Learning",
      image: "🤖",
      description: "Intelligent data processing and predictive analytics"
    }
  ];

  const technologies = [
    { name: "React", level: 95, color: "from-blue-500 to-cyan-400" },
    { name: "Node.js", level: 90, color: "from-green-500 to-emerald-400" },
    { name: "TypeScript", level: 88, color: "from-blue-600 to-blue-400" },
    { name: "Python", level: 85, color: "from-yellow-500 to-orange-400" },
    { name: "PostgreSQL", level: 82, color: "from-indigo-500 to-purple-400" },
    { name: "AWS/Cloud", level: 80, color: "from-orange-500 to-red-400" }
  ];

  /**
   * Simple intersection-observer powered reveal + progress animation
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = document.querySelectorAll<HTMLElement>(".animate-on-scroll");

    // Hide initially
    elements.forEach(el => {
      el.classList.add("opacity-0", "translate-y-12");
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;

            // Reveal animation
            target.classList.remove("opacity-0", "translate-y-12");
            target.classList.add("opacity-100", "translate-y-0", "transition-all", "duration-700");

            // Animate progress bars
            const progress = target.getAttribute("data-progress");
            if (progress) {
              target.style.width = progress + "%";
            }

            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
                  ✨ Full-Stack Excellence
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  Digital Services
                  <span className="block text-4xl lg:text-6xl">That Scale</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  We build powerful, scalable applications from concept to deployment. 
                  Full-stack expertise with modern technologies and best practices.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                  Start Your Project
                </button>
                <button className="border border-purple-500/50 text-purple-300 px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300">
                  View Portfolio
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">150+</div>
                  <div className="text-sm text-gray-400">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-gray-400">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Support Available</div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Card Effect */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                      💻
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Live Development</h3>
                      <p className="text-gray-400">Building amazing experiences</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">● Frontend Ready</span>
                      <span className="text-sm text-gray-400">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400">● Backend Processing</span>
                      <span className="text-sm text-gray-400">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400">● Database Optimized</span>
                      <span className="text-sm text-gray-400">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400">● Deployment Ready</span>
                      <span className="text-sm text-gray-400">78%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Next Deploy:</span>
                      <span className="text-white">In 2 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  activeService === index ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' : 'border-gray-700/50'
                }`}
                onClick={() => setActiveService(index)}
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-purple-300">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Recent <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-xl text-gray-400">Showcasing our latest work and innovations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center text-6xl">
                  {project.image}
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-400 mb-2">{project.category}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    View Project →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Tech Stack</span>
            </h2>
            <p className="text-xl text-gray-400">Cutting-edge technologies we work with</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {technologies.map((tech, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">{tech.name}</span>
                  <span className="text-gray-400">{tech.level}%</span>
                </div>
                <div
                  className={`h-3 bg-slate-800 rounded-full overflow-hidden animate-on-scroll`}
                  data-progress={tech.level}
                  style={{ width: "0%" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and bring your vision to life with our full-stack expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              Get Started Today
            </button>
            <button className="border border-purple-500/50 text-purple-300 px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}