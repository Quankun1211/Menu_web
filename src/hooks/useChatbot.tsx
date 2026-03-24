import { useMutation } from "@tanstack/react-query";
import { onAskChatbot } from "../services/api";

const useChatbot = () => {
    return useMutation({
        mutationKey: ["chatbot"],
        mutationFn: async (payload: { message: string, history: any[] }) => {
            return onAskChatbot(payload);
        }
    });
};

export default useChatbot