import React from 'react';
import { MessageCircle, Phone, Mail, ArrowLeft, Bell, User, ChevronRight, Check } from 'lucide-react';

const HelpSupport = () => {
  const supportOptions = [
    {
      icon: <MessageCircle className="w-5 h-5 text-gray-500" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
    },
    {
      icon: <Phone className="w-5 h-5 text-gray-500" />,
      title: 'Call Support',
      description: 'Speak with a representative',
    },
    {
      icon: <Mail className="w-5 h-5 text-gray-500" />,
      title: 'Email Support',
      description: 'Send us an email',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen font-sans">
      {/* Navbar Mockup */}
      <nav className="flex justify-between items-center mb-10">
        <span className="text-red-500 font-bold text-xl italic">E-pay</span>
        <div className="flex gap-8 text-gray-600 font-medium text-sm">
          <button className="hover:text-black">Home</button>
          <button className="hover:text-black">About</button>
          <button className="hover:text-black">Contact Us</button>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <Bell className="w-5 h-5 cursor-pointer" />
          <div className="p-1 border-2 border-red-400 rounded-full">
            <User className="w-5 h-5 text-red-400" />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <ArrowLeft className="w-6 h-6 text-gray-800 cursor-pointer" />
        <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
      </div>

      {/* Support Methods */}
      <div className="border-t border-gray-100">
        {supportOptions.map((option, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between py-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors px-2"
          >
            <div className="flex items-center gap-5">
              <div className="p-1">
                {option.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        ))}
      </div>

      {/* Support Hours Box */}
      <div className="mt-10 bg-yellow-400 rounded-2xl p-8 relative overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Support Hours</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Check className="w-4 h-4 text-gray-800" />
            <span className="font-medium text-gray-900 min-w-[140px]">Monday - Friday</span>
            <span className="text-gray-800">9:00 AM - 8:00 PM</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Check className="w-4 h-4 text-gray-800" />
            <span className="font-medium text-gray-900 min-w-[140px]">Saturday</span>
            <span className="text-gray-800">10:00 AM - 4:00 PM</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Check className="w-4 h-4 text-gray-800" />
            <span className="font-medium text-gray-900 min-w-[140px]">Sunday</span>
            <span className="text-gray-800">Emergency support only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;