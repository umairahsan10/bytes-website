import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQSEO: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'seo-timeline',
      question: 'How long does it take to see SEO results?',
      answer: 'SEO is a long-term strategy. Initial improvements can be seen within 2-4 weeks, but significant ranking improvements typically take 3-6 months. We provide monthly reports showing progress and can adjust strategies based on performance data.'
    },
    {
      id: 'seo-cost',
      question: 'How much does SEO cost?',
      answer: 'Our SEO pricing is based on project scope and competition level. Local SEO starts at $1,500/month, national SEO from $3,000/month, and enterprise SEO from $5,000/month. We offer custom packages tailored to your specific goals and budget.'
    },
    {
      id: 'seo-guarantees',
      question: 'Do you guarantee first page rankings?',
      answer: 'While we cannot guarantee specific rankings (as Google\'s algorithm is constantly changing), we guarantee measurable improvements in organic traffic, keyword rankings, and conversion rates. We focus on sustainable, white-hat SEO that builds lasting authority.'
    },
    {
      id: 'seo-techniques',
      question: 'What SEO techniques do you use?',
      answer: 'We use only white-hat, Google-approved SEO techniques including on-page optimization, technical SEO, content strategy, link building, local SEO, and performance optimization. We never use black-hat techniques that could harm your site.'
    },
    {
      id: 'seo-reporting',
      question: 'How often do you provide reports?',
      answer: 'We provide comprehensive monthly reports showing keyword rankings, organic traffic growth, conversion rates, and actionable insights. We also offer weekly check-ins and can set up real-time dashboards for ongoing monitoring.'
    },
    {
      id: 'seo-competition',
      question: 'Can you help with competitive markets?',
      answer: 'Yes, we specialize in competitive markets. We conduct thorough competitor analysis, identify gaps and opportunities, and develop strategies to outperform your competition. Our data-driven approach helps you gain market share in even the most competitive industries.'
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

export default FAQSEO; 