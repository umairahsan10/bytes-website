import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'what-is-animata',
      question: 'What is Animata?',
      answer: 'Animata is a modern animation library that provides beautiful, performant animations for React applications. It offers a comprehensive set of pre-built components and utilities to create stunning user interfaces with smooth transitions and effects.'
    },
    {
      id: 'who-is-this-for',
      question: 'Who is this for?',
      answer: 'Animata is designed for developers, designers, and teams who want to create engaging web applications with beautiful animations. Whether you\'re building a simple website or a complex web application, Animata provides the tools you need to enhance user experience.'
    },
    {
      id: 'cost',
      question: 'How much does it cost?',
      answer: 'Animata offers flexible pricing plans to suit different needs. We have a free tier for personal projects and small applications, as well as premium plans for commercial use and enterprise solutions. Visit our pricing page for detailed information.'
    },
    {
      id: 'why-care',
      question: 'Why should I care?',
      answer: 'In today\'s competitive digital landscape, user experience is crucial. Animata helps you create memorable, engaging interfaces that keep users interested and improve conversion rates. Good animations can make the difference between a forgettable app and one that users love.'
    },
    {
      id: 'make-myself',
      question: 'I can make these myself. Why should I use this?',
      answer: 'While you could build animations from scratch, Animata saves you countless hours of development time. Our components are thoroughly tested, optimized for performance, and designed to work seamlessly together. Focus on your core business logic while we handle the animation complexities.'
    },
    {
      id: 'how-to-use',
      question: 'Sounds amazing, how do I use it?',
      answer: 'Getting started with Animata is simple! Install our package via npm, import the components you need, and start adding animations to your React application. We provide comprehensive documentation, examples, and tutorials to help you get up and running quickly.'
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItem(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl font-bold text-gray-600">FAQ</div>
          </div>
          <p className="text-gray-500 text-lg">You ask. We answer.</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-2">
          {faqItems.map((item) => {
            const isExpanded = expandedItem === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed pt-4">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;