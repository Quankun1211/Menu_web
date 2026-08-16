import { useMutation } from "@tanstack/react-query";
import { onAskChatbot } from "../services/api";

type ChatbotPayload = {
  message: string;
  history: any[];
};

const useChatbot = () => {
  return useMutation({
    mutationKey: ["chatbot"],

    mutationFn: async (payload: ChatbotPayload) => {
      const data = await onAskChatbot(payload);
      return data;
    },

    onError: (error) => {
      console.error("[useChatbot] Error:", error);
    },
  });
};

export default useChatbot;