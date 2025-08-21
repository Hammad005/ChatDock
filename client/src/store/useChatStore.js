import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useChatStore = create((set) => ({
    sendedMessages: [],
    receivedMessages: [],
    messagesLoading: false,

    getMyMessages: async () => {
        set({ messagesLoading: true });
        try {
            const res = await axios.get('/messages/getMessages');
            set({ sendedMessages: res.data.sendedMessages, receivedMessages: res.data.receivedMessages, messagesLoading: false });
        } catch (error) {
            console.log(error);
            set({ messagesLoading: false });
        }
    },
    sendMessage: async (id, data) => {
        set({ messagesLoading: true });
        
        try {
            const res = await axios.post(`/messages/sendMessage/${id}`, data);
            set((state) => ({
                sendedMessages: [res.data, ...state.sendedMessages],
                messagesLoading: false,
            }));
            
            return { success: true }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ messagesLoading: false });
        }
    },
}))