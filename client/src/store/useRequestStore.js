import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useRequestStore = create((set) => ({
    sendedRequests: null,
    receivedRequests: null,
    requestsLoading: false,

    getMyRequests: async () => {
        set({ requestsLoading: true });
        try {
            const res = await axios.get('/requests/getMyRequests');

            set({ sendedRequests: res.data.sentRequests, receivedRequests: res.data.receivedRequests, requestsLoading: false });
        } catch (error) {
            console.log(error);
            set({ requestsLoading: false });
        }
    },
    sendRequest: async (id) => {
        set({ requestsLoading: true });
        try {
            const res = await axios.post(`/requests/sendRequest/${id}`);
            set((state) => {
                return {
                    sendedRequests: [res.data.request, ...state.sendedRequests],
                    requestsLoading: false,
                };
            });
        } catch (error) {
            console.log(error);
            set({ requestsLoading: false });
            toast.error(error.response.data.error);
        }
    },
    rejectRequest: async (id) => {
        set({ requestsLoading: true });
        try {
            const res = await axios.delete(`/requests/rejectRequest/${id}`);
            set({ sendedRequests: res.data.sentRequests, receivedRequests: res.data.receivedRequests, requestsLoading: false });
        } catch (error) {
            console.log(error);
            set({ requestsLoading: false });
            toast.error(error.response.data.error);
        }
    },
    acceptRequest: async (id) => {
        set({ requestsLoading: true });
        try {
            const res = await axios.put(`/requests/acceptRequest/${id}`);
            set({ sendedRequests: res.data.sentRequests, receivedRequests: res.data.receivedRequests, requestsLoading: false });
            useAuthStore.setState((state) => ({
                allUsers: state.allUsers.filter(r => r._id !== res.data.receiverFriend),
                userFriends: [res.data.receiverFriend, ...state.userFriends]
            }
        ));

        console.log(useAuthStore.getState().allUsers)
        } catch (error) {
            console.log(error);
            set({ requestsLoading: false });
            toast.error(error.response.data.error);
        }
    }
}))