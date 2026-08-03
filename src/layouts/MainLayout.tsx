import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import AppHoc from "../hocs/appHocs";
import Header from "../components/Header/Header";
import FloatingChatbot from "../components/common/FloatingModal"; 
import CustomerChat from "../components/common/CustomerChat"
import Footer from "../components/footer/Footer";
import TestInstructionsModal from "../components/common/TestInstruction";
import RouteSeo from "../components/common/RouteSeo";
import SeoBreadcrumbs from "../components/common/SeoBreadcrumbs";
import CommerceTrustBar from "../components/common/CommerceTrustBar";
import MobileBottomNavigation from "../components/common/MobileBottomNavigation";
function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);

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
    <div className="flex h-screen flex-col overflow-hidden bg-[#FFFDF9]">
      <RouteSeo />
      <Header />
      <CommerceTrustBar />

      <main 
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto bg-[#FFFDF9] scroll-smooth"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-10 py-8 relative z-10 min-h-[calc(100vh-80px)]">
          <SeoBreadcrumbs />
          <Outlet />
        </div>

        <Footer />
      </main>

      <FloatingChatbot onClick={() => setIsChatOpen(!isChatOpen)} hasUnread={chatUnread > 0} />

      <CustomerChat
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onUnreadChange={setChatUnread}
      />
      <TestInstructionsModal />
      <MobileBottomNavigation />
    </div>
  );
}

export default AppHoc(MainLayout);
