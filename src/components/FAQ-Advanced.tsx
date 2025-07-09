import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'web-development-process',
      question: 'What is your web development process?',
      answer: 'Our web development process follows a proven methodology: Discovery & Planning, Design & Prototyping, Development & Testing, Deployment & Launch, and Ongoing Support. We work closely with you at every stage to ensure your vision becomes reality.'
    },
    {
      id: 'timeline',
      question: 'How long does web development take?',
      answer: 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, e-commerce sites 6-12 weeks, and complex web applications 3-6 months. We provide detailed timelines during the planning phase and keep you updated throughout development.'
    },
    {
      id: 'cost',
      question: 'How much does web development cost?',
      answer: 'Our pricing is transparent and project-based. Simple websites start at $2,000, e-commerce sites from $5,000, and custom web applications from $15,000. We provide detailed quotes after understanding your specific requirements and goals.'
    },
    {
      id: 'technologies',
      question: 'What technologies do you use?',
      answer: 'We use modern, scalable technologies including React, Next.js, Node.js, Python, PHP, and various databases. For e-commerce, we specialize in Shopify and WooCommerce. We choose the best tech stack based on your project requirements and scalability needs.'
    },
    {
      id: 'maintenance',
      question: 'Do you provide ongoing maintenance?',
      answer: 'Yes, we offer comprehensive maintenance packages including security updates, performance optimization, content updates, and technical support. We recommend ongoing maintenance to keep your website secure, fast, and up-to-date.'
    },
    {
      id: 'seo-included',
      question: 'Is SEO included in web development?',
      answer: 'Yes, we build SEO-friendly websites from the ground up. This includes proper meta tags, structured data, fast loading times, mobile optimization, and clean code structure. We also offer additional SEO services for ongoing optimization.'
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItem(prev => prev === id ? null : id);
  };

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full py-12 px-4 sm:px-8 transition-colors duration-500 ${isExpanded ? 'bg-[#010A14]' : 'bg-gray-50'}`}>
      {/* FAQ Button - Only show when collapsed */}
      {!isExpanded && (
        <div className="text-center flex flex-col items-center justify-center cursor-pointer select-none py-16" onClick={toggleSection}>
          <div className="flex items-center justify-center">
            <span className="text-5xl sm:text-6xl font-extrabold text-[#4b5563]">FAQ</span>
            <ChevronDown className="w-8 h-8 ml-3 text-[#4b5563]" />
          </div>
          <p className="text-lg text-[#6b7280] mt-2">You ask. We answer.</p>
        </div>
      )}

      {/* FAQ Content - Only show when expanded */}
      {isExpanded && (
        <>
          {/* Header with close button */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl font-bold text-white">FAQ</div>
              <button
                onClick={toggleSection}
                className="ml-4 p-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <ChevronUp className="w-8 h-8" />
              </button>
            </div>
            <p className="text-gray-300 text-lg">You ask. We answer.</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-2 w-full">
            {faqItems.map((item) => {
              const isExpanded = expandedItem === item.id;
              return (
                <div
                  key={item.id}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors duration-200"
                  >
                    <span className="font-medium text-white pr-4">
                      {item.question}
                    </span>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-4 border-t border-white/20">
                      <p className="text-gray-200 leading-relaxed pt-4">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default FAQ; 