import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const FloatingChatbot = ({ onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="relative w-14 h-14 bg-[#E25822] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 border-none cursor-pointer"
        aria-label="Open Chat"
      >
        <MessageSquare color="white" size={28} />
        
        <span className="absolute top-0 right-0 w-4 h-4 bg-[#4CAF50] border-2 border-white rounded-full" />
      </motion.button>
    </div>
  );
};

export default FloatingChatbot;