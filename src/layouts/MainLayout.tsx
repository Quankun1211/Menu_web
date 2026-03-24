import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import AppHoc from "../hocs/appHocs";
import Header from "../components/Header/Header";
import FloatingChatbot from "../components/common/FloatingModal"; 
import ChatBotWindow from "../components/common/Chatbot"
import Footer from "../components/footer/Footer";
import TestInstructionsModal from "../components/common/TestInstruction";
import PageMeta from "../components/common/PageMeta";
function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", 
      });
    }
  }, [pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#faece1]">
      <PageMeta title="Bếp Việt" description="Chào mừng bạn quay trở lại với Bếp Việt" />
      <Header />

      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto relative scroll-smooth" 
        style={{
          background: `linear-gradient(180deg, #C9936E 0%, #E8C5A8 20%, #ffeddf 50%, #f2dbc9 100%)`,
        }}
      >
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-10 py-8 relative z-10 min-h-[calc(100vh-80px)]">
          <Outlet />
        </div>

        <Footer />
      </main>

      <FloatingChatbot onClick={() => setIsChatOpen(!isChatOpen)} />

      <ChatBotWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
      <TestInstructionsModal />
    </div>
  );
}

export default AppHoc(MainLayout);