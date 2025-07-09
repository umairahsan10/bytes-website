import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQMarketing: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'marketing-strategy',
      question: 'What marketing strategies do you offer?',
      answer: 'We offer comprehensive digital marketing strategies including Social Media Marketing (SMM), Pay-Per-Click (PPC) advertising, Content Marketing, Email Marketing, Influencer Marketing, and Brand Development. We create customized strategies based on your industry, target audience, and business goals.'
    },
    {
      id: 'marketing-roi',
      question: 'How do you measure marketing ROI?',
      answer: 'We use advanced analytics tools to track key metrics including conversion rates, cost per acquisition (CPA), return on ad spend (ROAS), customer lifetime value (CLV), and engagement rates. We provide detailed monthly reports showing your marketing performance and ROI, with actionable insights for optimization.'
    },
    {
      id: 'marketing-budget',
      question: 'What budget do I need for marketing?',
      answer: 'Marketing budgets vary based on your goals and industry. Small businesses typically start with $2,000-5,000/month, medium businesses $5,000-15,000/month, and enterprise clients $15,000+/month. We work with various budgets and can create effective campaigns at any scale.'
    },
    {
      id: 'marketing-platforms',
      question: 'Which social media platforms do you manage?',
      answer: 'We manage all major platforms including Facebook, Instagram, LinkedIn, Twitter, TikTok, YouTube, and Pinterest. We recommend platforms based on your target audience and industry. Our team creates platform-specific content strategies to maximize engagement and conversions.'
    },
    {
      id: 'marketing-timeline',
      question: 'How long does it take to see marketing results?',
      answer: 'PPC campaigns can show immediate results, while organic social media growth takes 3-6 months to build momentum. Content marketing and brand building are long-term strategies that show results over 6-12 months. We provide regular updates and adjust strategies based on performance data.'
    },
    {
      id: 'marketing-content',
      question: 'Do you create content for marketing campaigns?',
      answer: 'Yes, our creative team produces all content including graphics, videos, copywriting, and photography. We create engaging, platform-optimized content that aligns with your brand voice and drives engagement. We also offer content calendars and scheduling services.'
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

export default FAQMarketing; 