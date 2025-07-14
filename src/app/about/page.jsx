"use client";

import { Header } from "@/sections/Navbar";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactSection } from "@/sections/Contact";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, animate, useInView } from "framer-motion";
import ReactIcon from "@/assets/icons/react.svg";
import JsIcon from "@/assets/icons/square-js.svg";
import HtmlIcon from "@/assets/icons/html5.svg";
import CssIcon from "@/assets/icons/css3.svg";
import GithubIcon from "@/assets/icons/github.svg";
import ChromeIcon from "@/assets/icons/chrome.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { useRouter } from "next/navigation";

// Animated counter component
function Counter({ from = 0, to, duration = 2, className = "" }) {
  const count = useMotionValue(from);
  const nodeRef = useRef(null);

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (nodeRef.current) nodeRef.current.textContent = Math.round(latest).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [to]);

  return <span ref={nodeRef} className={className}></span>;
}

function CountUp({ end, duration = 2, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated && isInView && ref.current) {
      setHasAnimated(true);
      let start = 0;
      const increment = end / (duration * 60);
      function step() {
        start += increment;
        if (start >= end) start = end;
        if (ref.current) {
          ref.current.textContent = `${Math.round(start).toLocaleString()}${suffix}`;
        }
        if (start < end) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }, [isInView]);

  return (
    <span ref={ref} className="inline-block">0{suffix}</span>
  );
}

// Component to remount its children each time it enters the viewport
const ResetOnView = ({ children, margin = "-100px" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isInView) {
      setKey(Date.now()); // trigger remount when entering view
    }
  }, [isInView]);

  return (
    <div ref={ref} key={key} className="w-full h-full">
      {children}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// New animated service-showcase components
// ────────────────────────────────────────────────────────────────────────────────

const AnimatedCodeEditor = () => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const codeLines = [
      "const app = new React.App();",
      "app.render(<Component />);",
      "export default app;",
      "// Building magic...",
    ];

    const interval = setInterval(() => {
      setLines(prev => {
        if (prev.length >= codeLines.length) return [];
        return [...prev, codeLines[prev.length]];
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 font-mono text-sm overflow-hidden h-40">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-green-400 mb-2"
        >
          {line}
        </motion.div>
      ))}
      <motion.div
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-2 h-5 bg-green-400 inline-block"
      />
    </div>
  );
};

const AnimatedNetworkGraph = () => {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 200,
  }));

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl overflow-hidden">
      <svg className="w-full h-full">
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((otherNode, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={otherNode.x}
              y2={otherNode.y}
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          ))
        )}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="6"
            fill="#6366f1"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
};

const AnimatedGrowthChart = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const dataPoints = [20, 45, 30, 70, 60, 85, 95];

  return (
    <div className="p-6 bg-transparent">
      <div className="grid grid-cols-7 gap-2 items-end h-32">
        {dataPoints.map((height, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-emerald-400 to-teal-400 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${(height * progress) / 100}%` }}
            transition={{ duration: 0.25, ease: "linear" }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4 text-xs text-emerald-400">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
      </div>
    </div>
  );
};

const AnimatedAIBrain = () => {
  const [pulses, setPulses] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulses(prev => [
        ...prev,
        { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100 },
      ]);
    }, 500);

    const cleanup = setInterval(() => {
      setPulses(prev => prev.slice(-10));
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, []);

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-pink-900/20 to-orange-900/20 rounded-2xl overflow-hidden">
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full"
            style={{
              left: `${(i * 23) % 100}%`,
              top: `${(i * 37) % 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {pulses.map(pulse => (
        <motion.div
          key={pulse.id}
          className="absolute w-4 h-4 border-2 border-pink-400 rounded-full"
          style={{ left: `${pulse.x}%`, top: `${pulse.y}%` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1 }}
        />
      ))}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Animated Neural Network (replaces brain in Intelligence Layer)
// ────────────────────────────────────────────────────────────────────────────────

const AnimatedNeuralNetwork = () => {
  const nodes = [
    { id: 1, x: 20, y: 30, layer: 'input' },
    { id: 2, x: 20, y: 50, layer: 'input' },
    { id: 3, x: 20, y: 70, layer: 'input' },
    { id: 4, x: 40, y: 20, layer: 'hidden1' },
    { id: 5, x: 40, y: 40, layer: 'hidden1' },
    { id: 6, x: 40, y: 60, layer: 'hidden1' },
    { id: 7, x: 40, y: 80, layer: 'hidden1' },
    { id: 8, x: 60, y: 30, layer: 'hidden2' },
    { id: 9, x: 60, y: 50, layer: 'hidden2' },
    { id: 10, x: 60, y: 70, layer: 'hidden2' },
    { id: 11, x: 80, y: 40, layer: 'output' },
    { id: 12, x: 80, y: 60, layer: 'output' },
  ];

  const connections = [
    ...[1, 2, 3].flatMap((i) => [4, 5, 6, 7].map((j) => ({ from: i, to: j }))),
    ...[4, 5, 6, 7].flatMap((i) => [8, 9, 10].map((j) => ({ from: i, to: j }))),
    ...[8, 9, 10].flatMap((i) => [11, 12].map((j) => ({ from: i, to: j }))),
  ];

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  return (
    <div className="relative w-full h-80 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.1) 1px,transparent 1px)', backgroundSize: '20px 20px' }}
      />

      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, idx) => {
          const from = getNodeById(conn.from);
          const to = getNodeById(conn.to);
          const x1 = `${from.x}%`, y1 = `${from.y}%`, x2 = `${to.x}%`, y2 = `${to.y}%`;
          return (
            <g key={idx}>
              <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(59,130,246,0.3)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, delay: idx * 0.05 }} />
              <motion.circle r="2" fill="#3b82f6" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], cx: [x1, x2], cy: [y1, y2] }} transition={{ duration: 1.5, delay: 1 + idx * 0.1, repeat: Infinity, repeatDelay: 2 }} />
            </g>
          );
        })}
        {nodes.map((n, idx) => (
          <motion.circle key={n.id} cx={`${n.x}%`} cy={`${n.y}%`} r="4" fill={{ input: '#10b981', hidden1: '#3b82f6', hidden2: '#8b5cf6', output: '#f59e0b' }[n.layer]} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
            <motion.animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          </motion.circle>
        ))}
      </svg>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-cyan-400 rounded-full" initial={{ x: Math.random() * 400, y: Math.random() * 300, opacity: 0 }} animate={{ x: Math.random() * 400, y: Math.random() * 300, opacity: [0, 1, 0] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
      ))}
    </div>
  );
};

const FloatingParticles = ({ children }) => {
  return (
    <div className="relative">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {children}
    </div>
  );
};

const ServicesSection = () => {
  // Animation variants
  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const scaleIn = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  const rotateIn = {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, rotate: 10, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-32 pt-8 pb-16 bg-[#010a14]">
      {/* Digital Experiences - Left Aligned */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl">
          <motion.div
            className="w-full lg:w-2/5 lg:ml-16"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-100px" }}
          >
            <div className="space-y-6 px-2">
              <motion.h3
                className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {"Digital Experiences".split(" ").map((word, i) => (
                  <motion.span
                    key={word + i}
                    className="inline-block mr-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.45 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h3>
              <motion.ul
                className="space-y-4 text-lg text-gray-300"
                initial="hidden"
                whileInView="visible"
                variants={staggerContainer}
              >
                {["Custom Website Development", "Native Mobile Applications (iOS & Android)", "Progressive Web Applications"].map(item => (
                  <motion.li
                    key={item}
                    className="flex items-start group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.span
                      className="mr-3 text-blue-400 text-xl"
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      ▶
                    </motion.span>
                    <span className="group-hover:text-blue-300 transition-colors duration-300">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:w-3/5 lg:mr-0 flex items-center justify-center"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-100px" }}
          >
            <FloatingParticles>
              <ResetOnView>
                <AnimatedCodeEditor />
              </ResetOnView>
            </FloatingParticles>
          </motion.div>
        </div>
      </div>

      {/* Enterprise Solutions - Right Aligned */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 max-w-7xl mx-auto">
          <motion.div
            className="w-full lg:w-2/5 lg:mr-16"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-100px" }}
          >
            <div className="space-y-6 px-2">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                Enterprise Solutions
              </h3>
              <motion.ul
                className="space-y-4 text-gray-300 text-lg"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
              >
                {["CRM & ERP Ecosystem Integration", "SaaS & Micro-SaaS Platforms", "AI-Powered Automation Systems"].map(item => (
                  <motion.li key={item} variants={fadeInUp} className="flex items-center group">
                    <motion.span
                      className="mr-3 text-blue-400 text-xl"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {item.includes('CRM') ? '⚡' : item.includes('SaaS') ? '🚀' : '🤖'}
                    </motion.span>
                    <span className="group-hover:text-blue-300 transition-colors duration-300">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:w-3/5"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-100px" }}
          >
            <FloatingParticles>
              <ResetOnView>
                <AnimatedEnterpriseSystem />
              </ResetOnView>
            </FloatingParticles>
          </motion.div>
        </div>
      </div>

      {/* Growth Acceleration - Diagonal Layout */}
      <div className="container mx-auto px-4">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false }}
          />
          <div className="flex flex-col lg:flex-row items-center gap-16 pt-12">
            <motion.div
              className="w-full lg:w-1/2"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-100px" }}
            >
              <div className="space-y-6 px-2">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                  Growth Acceleration
                </h3>
                <motion.ul
                  className="space-y-4 text-gray-300 text-lg"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                >
                  {["Advanced SEO & Technical Optimization", "Performance Marketing & PPC", "Conversion Rate Optimization"].map(item => (
                    <motion.li key={item} variants={fadeInUp} className="flex items-center group">
                      <motion.span
                        className="mr-3 text-blue-400 text-xl"
                        whileHover={{ scale: 1.2, y: -5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        ↗
                      </motion.span>
                      <span className="group-hover:text-blue-300 transition-colors duration-300">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
            <motion.div
              className="w-full lg:w-1/2"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-100px" }}
            >
              <ResetOnView>
                <AnimatedGrowthChart />
              </ResetOnView>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Intelligence Layer */}
      <div className="w-full bg-[#010a14] py-20">
        <div className="container mx-auto px-4">
          <div className="relative max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <FloatingParticles>
                  <ResetOnView margin="-150px">
                    <AnimatedNeuralNetwork />
                  </ResetOnView>
                </FloatingParticles>
              </motion.div>

              <motion.div
                variants={slideInRight}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="w-full space-y-6 px-2">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                    Intelligence Layer
                  </h3>
                  <motion.ul
                    className="space-y-4 text-gray-300 text-lg"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                  >
                    {["Conversational AI & Chatbots", "Predictive Analytics Dashboards", "Social Media Automation"].map(item => (
                      <motion.li key={item} variants={fadeInUp} className="flex items-center group">
                        <motion.span
                          className="mr-3 text-blue-400 text-xl"
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          ◉
                        </motion.span>
                        <span className="group-hover:text-blue-300 transition-colors duration-300">{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Enterprise animation - Server/Database visualization
// ────────────────────────────────────────────────────────────────────────────────

const AnimatedEnterpriseSystem = () => {
  const [activeConnections, setActiveConnections] = useState([]);
  const [dataFlow, setDataFlow] = useState([]);

  useEffect(() => {
    const connectionInterval = setInterval(() => {
      const connections = Array.from({ length: 6 }, (_, i) => i);
      setActiveConnections(connections.slice(0, Math.floor(Math.random() * 6) + 2));
    }, 2000);

    const dataInterval = setInterval(() => {
      setDataFlow(prev => [
        ...prev.slice(-5),
        { id: Date.now(), path: Math.floor(Math.random() * 4) },
      ]);
    }, 300);

    return () => {
      clearInterval(connectionInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const servers = [
    { id: 'main', x: 150, y: 50, type: 'main', label: 'CRM Core' },
    { id: 'db1', x: 50, y: 120, type: 'database', label: 'Analytics DB' },
    { id: 'db2', x: 250, y: 120, type: 'database', label: 'User DB' },
    { id: 'api1', x: 80, y: 200, type: 'api', label: 'REST API' },
    { id: 'api2', x: 220, y: 200, type: 'api', label: 'GraphQL' },
    { id: 'ai', x: 150, y: 270, type: 'ai', label: 'AI Engine' },
  ];

  const connections = [
    { from: 'main', to: 'db1' },
    { from: 'main', to: 'db2' },
    { from: 'db1', to: 'api1' },
    { from: 'db2', to: 'api2' },
    { from: 'api1', to: 'ai' },
    { from: 'api2', to: 'ai' },
  ];

  const getServerPosition = (id) => servers.find((s) => s.id === id);

  return (
    <div className="relative w-full h-80 overflow-hidden">
      {/* grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#8b5cf6" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg className="w-full h-full relative z-10" viewBox="0 0 300 320" preserveAspectRatio="xMidYMid meet">
        {/* connections */}
        {connections.map((conn, i) => {
          const from = getServerPosition(conn.from);
          const to = getServerPosition(conn.to);
          const isActive = activeConnections.includes(i);

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isActive ? '#a855f7' : '#6b21a8'}
              strokeWidth={isActive ? '3' : '1'}
              opacity={isActive ? 1 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          );
        })}

        {/* data flow particles */}
        {dataFlow.map((flow) => {
          const connection = connections[flow.path % connections.length];
          const from = getServerPosition(connection.from);
          const to = getServerPosition(connection.to);
          return (
            <motion.circle
              key={flow.id}
              r="3"
              fill="#fbbf24"
              initial={{ cx: from.x, cy: from.y, opacity: 1 }}
              animate={{ cx: to.x, cy: to.y, opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          );
        })}

        {/* servers */}
        {servers.map((server, i) => (
          <g key={server.id}>
            <motion.circle
              cx={server.x}
              cy={server.y}
              r="20"
              fill={server.type === 'main' ? '#8b5cf6' : server.type === 'ai' ? '#f59e0b' : '#6366f1'}
              opacity="0.3"
              animate={{ r: [15, 25, 15] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
            <motion.rect
              x={server.x - 12}
              y={server.y - 8}
              width="24"
              height="16"
              rx="4"
              fill={server.type === 'main' ? '#a855f7' : server.type === 'ai' ? '#fbbf24' : '#6366f1'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
            {[0, 1, 2].map((d) => (
              <motion.circle
                key={d}
                cx={server.x - 8 + d * 4}
                cy={server.y - 2}
                r="1.5"
                fill="#22c55e"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
              />
            ))}
            <text x={server.x} y={server.y + 25} textAnchor="middle" className="text-xs fill-purple-300 font-medium">
              {server.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // GSAP refs and state
  const heroRef = useRef(null);
  const overlayRef = useRef(null);
  const [canInteract, setCanInteract] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();



  // GSAP ScrollTrigger effect
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Clear any existing ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.registerPlugin(ScrollTrigger);

    const scaleFactor = 2.7;

    const ctx = gsap.context(() => {
      // Ensure elements exist before animating
      const heroElement = heroRef.current;
      const overlayElement = overlayRef.current;
      const imgContainer = heroElement?.querySelector(".img-container");
      const heroTitle = heroElement?.querySelector(".hero-title");

      if (!heroElement || !overlayElement || !imgContainer || !heroTitle) {
        return;
      }

      // Set initial states to prevent flashing - ensure bidirectional reset
      gsap.set(overlayElement, {
        opacity: 0,
        scale: 0.85,
        y: 50,
        clearProps: "transform", // Clear any lingering transforms
      });

      // Ensure hero elements start in proper state
      gsap.set([imgContainer, heroTitle], {
        scale: 1,
        opacity: 1,
        clearProps: "transform",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "about-hero-pin",
          trigger: heroElement,
          start: "top top",
          end: "bottom+=150% top", // Increased end point for more scroll space
          scrub: 1.5, // Enables bidirectional scrubbing
          pin: true,
          anticipatePin: 1,
          refreshPriority: -1,
          invalidateOnRefresh: true, // Ensures proper refresh behavior
          onUpdate: self => {
            // Smoother interaction threshold - bidirectional
            setCanInteract(self.progress > 0.45 && self.direction === 1); // Only interact on forward scroll
          },
          onToggle: self => {
            // Reset interaction state when leaving trigger area
            if (!self.isActive) {
              setCanInteract(false);
            }
          }
        },
      });

      // Smoother, more coordinated animation sequence - optimized for bidirectional
      tl.to([imgContainer, heroTitle], {
        scale: scaleFactor,
        ease: "none", // Use "none" for better scrub reversibility
        duration: 1.2,
      })

        // Gradual fade out of heading with better timing
        .to(heroTitle, {
          opacity: 0,
          ease: "none", // Use "none" for smooth reverse
          duration: 0.5,
        }, 0.2)

        // Smoother overlay reveal with coordinated scaling and fading
        .to(overlayElement, {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "none", // Use "none" for smooth reverse
          duration: 0.8,
        }, 0.4)

        // More gradual background fade with overlap
        .to(imgContainer, {
          opacity: 0,
          ease: "none", // Use "none" for smooth reverse
          duration: 0.6,
        }, 0.6);

      // Add a refresh method to ensure proper state on resize
      ScrollTrigger.addEventListener("refresh", () => {
        if (tl.scrollTrigger && tl.scrollTrigger.progress === 0) {
          // Reset to initial state when at the beginning
          gsap.set([imgContainer, heroTitle], { scale: 1, opacity: 1 });
          gsap.set(overlayElement, { opacity: 0, scale: 0.85, y: 50 });
        }
      });

    }, heroRef);

    return () => {
      // Proper cleanup
      ScrollTrigger.getById("about-hero-pin")?.kill();
      ctx.revert();
    };
  }, []);

  // Video handler functions
  const handleVideoError = (e) => {
    setVideoError(true);
    setVideoLoading(false);
  };

  const handleVideoLoadStart = () => {
    setVideoLoading(true);
    setVideoError(false);
  };

  const handleVideoCanPlay = () => {
    setVideoLoading(false);
  };

  const handleVideoLoadedData = () => {
    setVideoLoading(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Custom animation variants
  const slideInLeft = {
    hidden: { opacity: 0, x: -100, rotateY: -15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.5 }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100, rotateY: 15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.5 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: { duration: 0.4 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8, rotateZ: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      transition: { duration: 0.6, ease: "backOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const rotateIn = {
    hidden: { opacity: 0, rotateX: 90, y: 50 },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      rotateX: -30,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <main className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
      <Header />

      {/* Hero Section with Beach/Logo Entry */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden pt-20">
        <div className="bg bg-[#010a14] absolute inset-0"></div>
        <div className="img-container relative flex flex-col gap-8 items-center justify-center h-full w-full will-change-transform transform-gpu">
          <Image className="image" src="/assets/bg.jpg" alt="Background" fill priority />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="hero-title text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-8xl xl:text-9xl leading-none whitespace-nowrap will-change-transform transform-gpu">
              <span className="bg-gradient-to-r from-purple-900 via-white to-purple-900 bg-clip-text text-transparent">About</span> <span className="bg-gradient-to-r from-purple-500 via-white to-purple-400 bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="max-w-xl mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-[#bbbbbb]">
              Innovating the Future Together
            </p>
          </div>
        </div>

        {/* Info overlay - Shows about content after animation */}
        <div
          ref={overlayRef}
          className="info-overlay pointer-events-auto absolute inset-0 will-change-transform transform-gpu bg-white/90 backdrop-blur-xl"
          style={{ backgroundImage: 'url("/assets/aboutUs/hero.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12">
            <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
              <div className="pt-4 sm:pt-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6">
                  Who We Are
                </h2>
                <p className="max-w-2xl mx-auto text-center text-white text-base sm:text-lg md:text-xl lg:text-2xl">
                  We're a passionate team of innovators, designers, and developers dedicated to crafting exceptional digital experiences that drive meaningful change.
                </p>
              </div>

              {/* Scroll indicator */}
              <div className="mt-8">
                <p className="text-white font-semibold animate-bounce">↓ Scroll down to learn more about us ↓</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden py-8 sm:py-20">
        {/* Title & Description: full width */}
        <div className="w-full text-center mb-6 sm:mb-10 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Discover Our Story
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto pt-3 sm:pt-5">
            Watch how we transform ideas into powerful digital solutions that drive growth and innovation.
          </p>
        </div>

        {/* Video: full width on mobile, centered and smaller on larger screens */}
        <div className="relative mx-auto w-full px-2 sm:max-w-xl sm:px-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-none sm:rounded-2xl blur opacity-25"></div>
          <div className="relative bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl">
            <video
              className="w-full h-auto rounded-none sm:rounded-2xl"
              controls
              poster="/assets/aboutUs/hero.jpg"
              autoPlay={false}
              playsInline
            >
              <source src="/Videos/About-Video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Video Description */}
        <div className="mt-4 sm:mt-6 text-center space-y-3 sm:space-y-4 px-4">
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            From concept to deployment, see how our team collaborates to deliver exceptional digital experiences that exceed expectations and drive measurable results.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              High-Quality Production
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              Professional Team
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Innovative Solutions
            </span>
          </div>
        </div>
      </section>
      
      {/* About Content Section */}
      <section id="about-us" className="relative">

        {/* Hero Section - Full Width - Updated for white theme */}
        <div className="relative z-10 w-full px-4 pt-20 pb-8 bg-[#010a14] text-white">
          <motion.div
            className="text-center space-y-8 max-w-6xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-100px" }}
          >
            <div className="inline-block">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                About Bytes Platform
              </motion.h1>
              <motion.div
                className="h-2 w-48 bg-gradient-to-r from-white via-[#010a14] to-white mx-auto mt-6 rounded-full"
                animate={{
                  scaleX: [0.5, 1.2, 0.5],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-5xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Your full-spectrum digital transformation partner, engineering tomorrow's most profitable brands with cutting-edge solutions that scale.
            </motion.p>
          </motion.div>
        </div>

        {/* Core Services - Asymmetric Layout */}
        <ServicesSection />

        {/* Philosophy - Split Screen */}
        <div className="w-full relative py-12 overflow-hidden bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-stretch max-w-7xl mx-auto">
              <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16"
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="space-y-8 max-w-lg">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#010a14] via-blue-800 to-[#010a14] bg-clip-text text-transparent">
                    Our Philosophy
                  </h2>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg text-gray-900 leading-relaxed">
                  At Bytes, we don’t just build softwares — we build trust, experiences, and futures. We believe in full transparency, working openly and collaboratively so our clients are part of every step, not just the final product. Innovation drives us, but clarity guides us.

We challenge the status quo of static portfolios and hidden processes by inviting you into the heart of development — live, real, and evolving. Every line of code, every design choice, is crafted with purpose, passion, and precision.

Our mission is simple: to empower businesses with digital solutions that don’t just look good but perform flawlessly, scale effortlessly, and grow sustainably. Because at Bytes, your vision is our blueprint — and together, we build more than websites. We build lasting impact.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="w-full lg:w-1/2 p-4 lg:p-8"
                variants={slideInRight}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <motion.div variants={fadeInUp}>
                  <Image
                    src="/assets/aboutUs/image1.png"
                    alt="Philosophy"
                    width={800}
                    height={600}
                    className="object-contain w-full h-[420px] lg:h-[500px]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* The Bytes Advantage - Masonry Grid */}
        <div className="w-full py-6 bg-[#010a14]">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0 }}
            >
              The Bytes Advantage
            </motion.h2>

            <motion.div
              className="grid lg:grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
            >
              <motion.div
                className="w-full lg:row-span-1 bg-white border border-blue-100 rounded-3xl p-3 sm:p-5 hover:scale-105 transition-all duration-500 order-1"
                variants={rotateIn}
              >
                <h3 className="text-xl font-bold text-[#010a14] mb-3">Real-Time Development Visibility</h3>
                <p className="text-[#010a14] leading-relaxed">
                  Every client receives live staging environments throughout development. Watch your vision materialize, provide instant feedback, and iterate in real-time. No surprises, no delays, no compromises.
                </p>
              </motion.div>

              <motion.div
                className="w-full lg:row-span-1 bg-white border border-blue-100 rounded-3xl p-3 sm:p-5 hover:scale-105 transition-all duration-500 order-2"
                variants={slideInRight}
              >
                <h3 className="text-xl font-bold text-[#010a14] mb-3">Hyper-Speed Delivery</h3>
                <p className="text-[#010a14] leading-relaxed mb-6">
                  Our agile methodology and parallel processing workflows deliver production-ready solutions 3x faster than industry benchmarks — without sacrificing quality or cutting corners.
                </p>
              </motion.div>

              <motion.div
                className="w-full lg:col-span-2 lg:w-1/2 mx-auto bg-white border border-blue-100 rounded-3xl p-3 sm:p-5 hover:scale-105 transition-all duration-500 order-5"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-bold text-[#010a14] mb-3">Bespoke Design Architecture</h3>
                <p className="text-[#010a14] leading-relaxed">
                  Zero templates, zero shortcuts. Every interface is meticulously crafted to align with your brand DNA, user psychology, and conversion objectives. Authenticity meets performance.
                </p>
              </motion.div>

              <motion.div
                className="w-full bg-white border border-blue-100 rounded-3xl p-3 sm:p-5 hover:scale-105 transition-all duration-500 order-4"
                variants={slideInLeft}
              >
                <h3 className="text-xl font-bold text-[#010a14] mb-3">Infinite Scalability</h3>
                <p className="text-[#010a14] leading-relaxed">
                  From MVP to enterprise-grade platforms, our infrastructure scales seamlessly with your ambitions. Start lean, scale fast, dominate markets.
                </p>
              </motion.div>

              {/* Cost Effective Solution Card */}
              <motion.div
                className="w-full bg-white border border-blue-100 rounded-3xl p-3 sm:p-5 hover:scale-105 transition-all duration-500 order-4"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-bold text-[#010a14] mb-3">Cost Effective Solution</h3>
                <p className="text-[#010a14] leading-relaxed">
                  Our streamlined processes and reusable component library minimize development overhead, delivering exceptional results within your budget without compromising on quality or performance.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Technology Stack - Showcase */}
        <div className="w-full py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Image */}
              <motion.div
                className="w-full lg:w-1/3"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <Image
                  src="/assets/aboutUs/img2.png"
                  alt="Tech Stack Image Left"
                  width={800}
                  height={600}
                  className="object-cover w-full h-64 rounded-2xl"
                />
              </motion.div>

              <motion.div
                className="w-full lg:w-1/3"
                variants={rotateIn}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="relative group">
                  <div className="w-full h-96 relative">
                    <div className="absolute inset-0 hidden"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-6">
                        <motion.div
                          className="grid grid-cols-3 gap-4"
                          variants={staggerContainer}
                          initial="hidden"
                          whileInView="visible"
                        >
                          {[
                            { Icon: ReactIcon, name: "React" },
                            { Icon: JsIcon, name: "JavaScript" },
                            { Icon: HtmlIcon, name: "HTML5" },
                            { Icon: CssIcon, name: "CSS3" },
                            { Icon: GithubIcon, name: "GitHub" },
                            { Icon: ChromeIcon, name: "Chrome DevTools" },
                          ].map(({ Icon, name }, idx) => (
                            <motion.div
                              key={name}
                              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
                              variants={scaleIn}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#010a14]" aria-label={name} />
                            </motion.div>
                          ))}
                        </motion.div>
                        <p className="font-medium text-base sm:text-lg bg-gradient-to-r from-[#010a14] via-blue-800 to-[#010a14] bg-clip-text text-transparent">Modern Tech Stack</p>
                        <p className="text-xs sm:text-sm text-[#010a14] max-w-xs mx-auto">We harness the latest frameworks, languages, and cloud services to build resilient, future-proof applications tailored to your growth trajectory.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="w-full lg:w-1/3 mt-8 lg:mt-0"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <Image
                  src="/assets/aboutUs/tech-stack.png"
                  alt="Tech Stack Image Right"
                  width={800}
                  height={600}
                  className="object-cover w-full h-64 rounded-2xl"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Integration Ecosystem - Floating Cards */}
        <div className="w-full py-20 bg-[#010a14]">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-16"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0 }}
            >
              Integration Ecosystem
            </motion.h2>

            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
            >
              <div className="w-full space-y-6">
                <motion.div
                  className="bg-white border border-blue-100 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:rotate-1"
                  variants={slideInLeft}
                  whileHover={{ y: -10 }}
                >
                  <h4 className="font-semibold text-[#010a14] mb-3 text-lg">Business Intelligence</h4>
                  <p className="text-[#010a14]">CRM systems, Analytics platforms, Sales tracking, Performance dashboards.<br />Empower your business with actionable insights and data-driven decision making for sustainable growth.</p>
                </motion.div>

                <motion.div
                  className="bg-white border border-blue-100 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-rotate-1"
                  variants={slideInLeft}
                  whileHover={{ y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-semibold text-[#010a14] mb-3 text-lg">AI & Automation</h4>
                  <p className="text-[#010a14]">Workflow automation, Predictive algorithms.<br />Streamline operations and boost productivity with intelligent automation tailored to your unique needs.</p>
                </motion.div>
              </div>

              <div className="w-full space-y-4">
                <motion.div
                  className="bg-white border border-blue-100 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:rotate-1"
                  variants={slideInRight}
                  whileHover={{ y: -10 }}
                >
                  <h4 className="font-semibold text-[#010a14] mb-3 text-lg">Commerce & Payments</h4>
                  <p className="text-[#010a14]">Payment gateways, Booking systems, Subscription management</p>
                </motion.div>

                <motion.div
                  className="bg-white border border-blue-100 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-rotate-1"
                  variants={slideInRight}
                  whileHover={{ y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-semibold text-[#010a14] mb-3 text-lg">Marketing Stack</h4>
                  <p className="text-[#010a14]">Email automation, Social integration, Campaign management</p>
                </motion.div>

                <motion.div
                  className="bg-white border border-blue-100 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:rotate-1"
                  variants={slideInRight}
                  whileHover={{ y: -10 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-semibold text-[#010a14] mb-3 text-lg">Custom Chatbots</h4>
                  <p className="text-[#010a14]">Conversational AI solutions tailored for your business needs.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Support & Growth - Full Width Banner */}
        <div className="w-full py-24 sm:py-32 relative overflow-hidden bg-[#010a14] text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-white"></div>
            <motion.div
              className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.6, 0.3, 0.6]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <motion.div
              className="text-center space-y-8 bg-white/90 rounded-3xl py-16 px-4 shadow-lg"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-[#010a14] via-blue-800 to-[#010a14] bg-clip-text text-transparent">
                Ready to Build the Future?
              </h2>
              <motion.p
                className="text-lg sm:text-xl md:text-2xl text-[#18181b] max-w-3xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                Transform your vision into reality. Scale your impact. Dominate your market.
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
              >
                {[
                  {
                    label: '24/7 Support', icon: (
                      <svg className="w-8 h-8" fill="none" stroke="#222" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" /></svg>)
                  },
                  {
                    label: 'Auto Updates', icon: (
                      <svg className="w-8 h-8" fill="none" stroke="#222" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v6h6M20 20v-6h-6M5 19l4-4M19 5l-4 4" /></svg>)
                  },
                  {
                    label: 'Performance Monitoring', icon: (
                      <svg className="w-8 h-8" fill="none" stroke="#222" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3v18h18M16 3v18M8 9h8M8 15h8" /></svg>)
                  },
                  {
                    label: 'Growth Analytics', icon: (
                      <svg className="w-8 h-8" fill="none" stroke="#222" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 17l6-6 4 4 8-8" /></svg>)
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="text-center"
                    variants={scaleIn}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/60 rounded-2xl flex items-center justify-center mb-3 mx-auto backdrop-blur-2xl border border-gray-200">
                      {item.icon}
                    </div>
                    <p className="text-[#18181b] text-sm uppercase tracking-wider">{item.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Call-to-Action Section */}
      <section className="relative py-16 px-4 bg-[#E1E1E1] overflow-hidden">
        {/* Decorative background image */}
        <Image
          src="/assets/aboutUs/aboutus-contact.png"
          alt="Contact illustration"
          fill
          className="object-cover absolute inset-0"
          priority
        />
        {/* Semi-transparent overlay to improve text readability */}
        <div className="absolute inset-0 bg-white/40" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            Let Google Drive Your Business
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Growth—Effortlessly
            </span>
          </h2>

          <motion.p
            className="text-base sm:text-lg text-gray-700 mb-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Contact our team and let's bring your vision to life.
          </motion.p>
          <motion.button
            data-cta="true"
            className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-900 hover:to-gray-700 px-8 py-3 rounded-full text-lg font-semibold text-white transition-all duration-300 mt-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/contact')}
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
} 