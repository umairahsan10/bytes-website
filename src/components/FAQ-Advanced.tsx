import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQAdvanced: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'advanced-services',
      question: 'What advanced services do you offer?',
      answer: 'We offer cutting-edge technology services including Data Modernization, Advanced Analytics & AI, Connected Intelligence (IoT), Generative AI, Cybersecurity Solutions, and Emerging Technologies implementation. We help businesses transform their operations with the latest technological innovations.'
    },
    {
      id: 'ai-implementation',
      question: 'How do you implement AI in businesses?',
      answer: 'Our AI implementation process includes: Assessment of current systems, Data preparation and cleaning, Model development and training, Integration with existing workflows, Testing and validation, and Ongoing optimization. We focus on practical AI solutions that deliver immediate business value.'
    },
    {
      id: 'data-security',
      question: 'How do you ensure data security in advanced projects?',
      answer: 'We implement enterprise-grade security measures including encryption, secure data transmission, access controls, regular security audits, compliance with GDPR/CCPA, and secure cloud infrastructure. We follow industry best practices and can help you achieve SOC 2, ISO 27001, and other security certifications.'
    },
    {
      id: 'advanced-cost',
      question: 'What do advanced technology services cost?',
      answer: 'Advanced technology services are project-based and vary by complexity. Data modernization projects start at $25,000, AI implementations from $50,000, IoT solutions from $75,000, and enterprise cybersecurity from $100,000+. We provide detailed proposals after understanding your specific requirements.'
    },
    {
      id: 'emerging-tech',
      question: 'Which emerging technologies do you specialize in?',
      answer: 'We specialize in AI/ML, IoT, Blockchain, Edge Computing, 5G applications, AR/VR, Quantum Computing applications, and Industry 4.0 solutions. We stay ahead of technology trends and help businesses adopt the right technologies for their specific needs and industry.'
    },
    {
      id: 'integration-support',
      question: 'Do you provide ongoing support for advanced systems?',
      answer: 'Yes, we offer comprehensive support including system monitoring, performance optimization, security updates, feature enhancements, and 24/7 technical support. We also provide training for your team and documentation to ensure smooth operation of advanced systems.'
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItem(prev => prev === id ? null : id);
  };

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
        {isExpanded && (
          <>
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
            <div className="space-y-2">
              {faqItems.map((item) => {
                const isExpanded = expandedItem === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden"
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
    </div>
  );
};

export default FAQAdvanced; 