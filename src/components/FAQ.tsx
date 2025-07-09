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
      question: 'Why is web development important for my business?',
      answer: 'It is crucial for any business to have a professional, responsive, and user-friendly website to engage customers and improve online visibility.'
    },
    {
      id: 'timeline',
      question: 'How long does it take to build a website?',
      answer: 'The timeline depends on the complexity and features of the website. A standard website might take less than a week, while more complex projects could take longer.'
    },
    {
      id: 'cost',
      question: 'What types of websites can you create?',
      answer: 'We create various types of websites, including business sites, e-commerce stores, blogs, portfolios, and more, tailored to your specific needs. We also create websites using platforms like WordPress, Shopify, and full-stack development, depending on your requirements.'
    },
    {
      id: 'technologies',
      question: 'Will my website be mobile-friendly?',
      answer: 'Absolutely! All of our websites are designed to be responsive, ensuring they work smoothly across all devices, including smartphones and tablets.'
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