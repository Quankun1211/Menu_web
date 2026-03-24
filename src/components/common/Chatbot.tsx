import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, ChefHat } from "lucide-react";
import useChatbot from "../../hooks/useChatbot";
import useGetMe from "../../hooks/useGetMe";
import BOT_AVATAR from "../../assets/images/chatavt.png"
// const BOT_AVATAR = "../../assets/images/chatavt.png"; 

export default function ChatBotWindow({ isOpen, onClose }) {
  const { data: meData } = useGetMe(false);
  const INITIAL_MESSAGE = {
    role: 'model',
    parts: [{ text: "Chào bạn! Tôi là Bếp trưởng của Bếp Việt. Tôi có thể giúp gì cho thực đơn của bạn hôm nay?" }]
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const { mutate: sendMessage, isPending } = useChatbot();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg = { role: 'user', parts: [{ text: input.trim() }] };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    setInput('');

    sendMessage({ message: currentInput, history: messages }, {
      onSuccess: (data) => {
        const botMsg = { role: 'model', parts: [{ text: data.reply }] };
        setMessages(prev => [...prev, botMsg]);
      }
    });
  };

  const renderMessageContent = (text, isUser) => {
    if (isUser) return <p className="text-sm">{text}</p>;

    let cleanText = text.replace(/\*\*/g, '').replace(/^\s*\*\s/gm, '- ');
    const steps = cleanText.split(/(?=Bước \d+:|Step \d+:|\n\d+\.)/g);

    if (steps.length > 1) {
      return (
        <div className="space-y-3 w-full">
          {steps.map((step, index) => {
            let trimmed = step.trim();
            if (!trimmed) return null;
            const colonIndex = trimmed.indexOf(':');
            let title = "";
            let content = trimmed;

            if (colonIndex !== -1 && colonIndex < 30) {
              title = trimmed.substring(0, colonIndex + 1);
              content = trimmed.substring(colonIndex + 1).trim();
            }

            return (
              <div key={index} className="bg-white/80 p-3 rounded-lg border-l-4 border-[#E25822] shadow-sm text-sm">
                {title && <span className="block font-bold text-[#E25822] mb-1">{title}</span>}
                <p className="text-gray-700">{content}</p>
              </div>
            );
          })}
        </div>
      );
    }
    return <p className="text-sm leading-relaxed">{cleanText}</p>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 right-8 w-[380px] h-[550px] bg-[#fffaf5] shadow-2xl rounded-2xl flex flex-col z-[10000] border border-[#e8c5a8] overflow-hidden"
        >
          <div className="bg-white p-4 border-b border-[#e8c5a8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <ChefHat size={20} className="text-[#E25822]" />
              <span className="font-bold text-gray-800">Bếp trưởng AI</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((item, index) => {
              const isUser = item.role === 'user';
              return (
                <div key={index} className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img 
                    src={isUser ? meData?.data?.avatar : BOT_AVATAR} 
                    className="w-8 h-8 rounded-full border border-gray-200"
                    alt="avatar"
                  />
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    isUser 
                      ? 'bg-[#E25822] text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-[#e8c5a8] rounded-bl-none shadow-sm'
                  }`}>
                    {renderMessageContent(item.parts[0].text, isUser)}
                  </div>
                </div>
              );
            })}
            {isPending && (
              <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
                Bếp trưởng đang nghĩ...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#e8c5a8] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi Bếp trưởng về công thức..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#E25822] transition-colors"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isPending}
              className={`p-2 rounded-full transition-colors ${
                !input.trim() || isPending ? 'text-gray-300' : 'text-[#E25822] hover:bg-orange-50'
              }`}
            >
              <Send size={20} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}