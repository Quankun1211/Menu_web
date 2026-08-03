import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Headphones, Send, X } from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../services/axios";
import useChatbot from "../../hooks/useChatbot";
import useGetMe from "../../hooks/useGetMe";
import { useAppStore } from "../../store/app.store";
import { useSocket } from "../../context/SocketContext";
import BOT_AVATAR from "../../assets/images/chatavt.png";

const welcome = { role: "model", parts: [{ text: "Chào bạn! Tôi là Bếp trưởng AI. Tôi có thể giúp gì cho bạn hôm nay?" }] };

export default function CustomerChat({ isOpen, onClose, onUnreadChange }) {
  const [tab, setTab] = useState("bot");
  const [botMessages, setBotMessages] = useState([welcome]);
  const [supportMessages, setSupportMessages] = useState([]);
  const [input, setInput] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const scrollRef = useRef(null);
  const { userData } = useAppStore();
  const { data: meData } = useGetMe(false);
  const { mutate: askBot, isPending } = useChatbot();
  const socket = useSocket();
  const navigate = useNavigate();

  const loadSupport = async () => {
    if (!userData) return;
    const response = await api.get("/support-chats/me");
    setSupportMessages(response.data.data?.messages || []);
    onUnreadChange(response.data.data?.unreadByCustomer || 0);
  };

  useEffect(() => { loadSupport().catch(() => undefined); }, [userData]);
  useEffect(() => {
    if (!socket) return;
    const receive = ({ message }) => {
      if (message?.senderRole !== "admin") return;
      setSupportMessages((items) => items.some((item) => item._id === message._id) ? items : [...items, message]);
      if (isOpen && tab === "admin") api.patch("/support-chats/me/read").then(() => onUnreadChange(0));
      else onUnreadChange((count) => Number(count || 0) + 1);
    };
    socket.on("support_message", receive);
    return () => socket.off("support_message", receive);
  }, [socket, isOpen, tab]);
  useEffect(() => {
    if (isOpen && tab === "admin" && userData) api.patch("/support-chats/me/read").then(() => onUnreadChange(0));
  }, [isOpen, tab, userData]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [botMessages, supportMessages, isOpen, tab]);

  const selectAdmin = () => {
    if (!userData) { onClose(); navigate("/account/login"); return; }
    setTab("admin");
  };
  const send = async (event) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || isPending || supportLoading) return;
    setInput("");
    if (tab === "bot") {
      const next = { role: "user", parts: [{ text: content }] };
      setBotMessages((items) => [...items, next]);
      askBot({ message: content, history: botMessages }, { onSuccess: (data) => setBotMessages((items) => [...items, { role: "model", parts: [{ text: data.reply }] }]) });
      return;
    }
    setSupportLoading(true);
    try {
      const response = await api.post("/support-chats/me/messages", { content });
      setSupportMessages((items) => [...items, response.data.data]);
    } finally { setSupportLoading(false); }
  };

  const messages = tab === "bot" ? botMessages : supportMessages;
  return <AnimatePresence>{isOpen && (
    <motion.div initial={{ opacity: 0, y: 40, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: .95 }} className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-[390px] h-[560px] bg-[#fffaf5] shadow-2xl rounded-2xl flex flex-col z-[10000] border border-[#e8c5a8] overflow-hidden">
      <div className="bg-white px-4 pt-4 border-b border-[#e8c5a8]">
        <div className="flex justify-between items-center mb-3"><div><p className="font-bold text-gray-800">Trò chuyện cùng Bếp Việt</p><p className="text-xs text-gray-500">Chúng tôi luôn sẵn sàng hỗ trợ</p></div><button onClick={onClose} aria-label="Đóng"><X size={20}/></button></div>
        <div className="grid grid-cols-2 gap-1">
          <button onClick={() => setTab("bot")} className={`flex justify-center items-center gap-2 py-2 text-sm font-semibold border-b-2 ${tab === "bot" ? "border-[#E25822] text-[#E25822]" : "border-transparent text-gray-500"}`}><Bot size={17}/> Chatbot</button>
          <button onClick={selectAdmin} className={`relative flex justify-center items-center gap-2 py-2 text-sm font-semibold border-b-2 ${tab === "admin" ? "border-[#E25822] text-[#E25822]" : "border-transparent text-gray-500"}`}><Headphones size={17}/> Quản trị viên</button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {tab === "admin" && messages.length === 0 && <div className="text-center text-gray-500 mt-16"><Headphones className="mx-auto mb-3 text-[#E25822]" size={36}/><p className="font-semibold text-gray-700">Bạn cần Bếp Việt hỗ trợ?</p><p className="text-sm mt-1">Hãy gửi tin nhắn, quản trị viên sẽ phản hồi sớm nhất.</p></div>}
        {messages.map((item, index) => {
          const mine = tab === "bot" ? item.role === "user" : item.senderRole === "user";
          const text = tab === "bot" ? item.parts?.[0]?.text : item.content;
          return <div key={item._id || index} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
            <img src={mine ? meData?.data?.avatar : BOT_AVATAR} className="w-8 h-8 rounded-full object-cover border" alt="avatar"/>
            <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${mine ? "bg-[#E25822] text-white rounded-br-sm" : "bg-white border border-[#e8c5a8] text-gray-800 rounded-bl-sm"}`}>{text}</div>
          </div>;
        })}
        {(isPending || supportLoading) && <p className="text-xs italic text-gray-400">Đang gửi...</p>}
      </div>
      <form onSubmit={send} className="p-3 bg-white border-t flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} maxLength={2000} placeholder={tab === "bot" ? "Hỏi Bếp trưởng AI..." : "Nhắn tin cho quản trị viên..."} className="flex-1 bg-white border border-[#CFA98B] rounded-full px-4 py-2 text-sm text-[#2C1810] caret-[#E25822] placeholder:text-[#806A5C] outline-none focus:border-[#E25822] focus:ring-2 focus:ring-[#E25822]/15"/><button className="p-2 text-[#E25822] disabled:text-gray-300" disabled={!input.trim() || isPending || supportLoading}><Send size={20}/></button></form>
    </motion.div>
  )}</AnimatePresence>;
}
