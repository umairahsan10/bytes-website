import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQApp: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'app-development-process',
      question: 'What is your app development process?',
      answer: 'Our app development process includes: Discovery & Planning (requirements gathering), Design & Prototyping (UI/UX design), Development & Testing (agile development with regular testing), Deployment & Launch (app store submission), and Ongoing Support & Maintenance. We work closely with you throughout each phase.'
    },
    {
      id: 'app-timeline',
      question: 'How long does app development take?',
      answer: 'Development time varies by complexity: Simple apps take 2-3 months, medium complexity apps 4-6 months, and complex enterprise apps 6-12 months. We provide detailed timelines during planning and keep you updated with regular progress reports and demos.'
    },
    {
      id: 'app-cost',
      question: 'How much does app development cost?',
      answer: 'App development costs depend on features, complexity, and platforms. Simple apps start at $15,000, medium complexity apps from $30,000, and complex enterprise apps from $50,000+. We provide detailed quotes after understanding your specific requirements and can work with various budgets.'
    },
    {
      id: 'app-platforms',
      question: 'Which platforms do you develop for?',
      answer: 'We develop for iOS (iPhone/iPad), Android, and cross-platform solutions. We use React Native and Flutter for cross-platform apps, native Swift for iOS, and Kotlin/Java for Android. We recommend the best approach based on your target audience and budget.'
    },
    {
      id: 'app-maintenance',
      question: 'Do you provide app maintenance and updates?',
      answer: 'Yes, we offer comprehensive maintenance packages including bug fixes, performance updates, security patches, and feature additions. We also handle app store updates and ensure compatibility with new OS versions. Maintenance typically costs 15-20% of development cost annually.'
    },
    {
      id: 'app-features',
      question: 'What features can you build into my app?',
      answer: 'We can build virtually any feature including user authentication, payment processing, push notifications, real-time messaging, GPS/location services, camera integration, social media integration, analytics, offline functionality, and custom APIs. We specialize in creating unique, innovative features tailored to your business needs.'
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

export default FAQApp; 