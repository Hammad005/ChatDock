import axios from "@/lib/axios";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand";
import { useRequestStore } from "./useRequestStore";
import { useChatStore } from "./useChatStore";

const BACKEND_PORT = import.meta.env.VITE_API_URL;
export const useAuthStore = create((set, get) => ({
    user: null,
    allUsers: null,
    userLoading: false,
    authLoading: false,
    updateUserLoading: false,
    progress: 0,
    socket: null,
    userFriends: null,
    onlineUsers: null,

    checkAuth: async () => {
        set({ authLoading: true, progress: 0 });
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        const steps = [0, 35, 60, 85, 100];

        for (let value of steps) {
            await delay(1000);
            set({ progress: value });
        }

        await delay(1500);
        try {
            const res = await axios.get('/auth/me');
            set({ user: res.data.user, authLoading: false, userFriends: res.data.user?.friends });
            get().connectSocket();
        } catch (error) {
            console.log(error);
            set({ authLoading: false, user: null, userFriends: null });
        }
    },
    signup: async (data) => {
        set({ userLoading: true });
        try {
            const res = await axios.post('/auth/signup', data);
            set({ user: res.data.user, userLoading: false, userFriends: res.data.user?.friends });
            toast.success('Signup successful');
            get().connectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ userLoading: false, user: null, userFriends: null });
        }
    },
    login: async (data) => {
        set({ userLoading: true });
        try {
            const res = await axios.post('/auth/login', data);
            set({ user: res.data.user, userLoading: false, userFriends: res.data.user?.friends });
            toast.success('Login successful');
            get().connectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ userLoading: false, user: null, userFriends: null });
        }
    },
    logout: async () => {
        set({ userLoading: true });
        try {
            await axios.post('/auth/logout');
            set({ user: null, userLoading: false, userFriends: null });
            toast.success('Logout successful');
            get().disConnectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ userLoading: false });
        }
    },
    update: async (data) => {
        set({ updateUserLoading: true });
        try {
            const res = await axios.put('/auth/update', data);
            set({ user: res.data.user, updateUserLoading: false, userFriends: res.data.user?.friends });
            toast.success('Update successful');
            get().connectSocket();
            return { success: true }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ updateUserLoading: false });
        }
    },
    removeProfile: async () => {
        set({ updateUserLoading: true });
        try {
            const res = await axios.delete('/auth/removeProfile');
            set({ user: res.data.user, updateUserLoading: false, userFriends: res.data.user?.friends });
            toast.success('Profile removed successfully');
            get().connectSocket();
            return { success: true }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ updateUserLoading: false });
        }
    },
    getAllUsers: async () => {
        set({ userLoading: true });
        try {
            const res = await axios.get('/auth/allUsers');
            set({ allUsers: res.data.users, userLoading: false });
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ userLoading: false, user: null });
        }
    },
    connectSocket: () => {
        const { user, socket } = get();
        if (!user) return;

        // ✅ reuse existing socket
        if (socket) {
            if (!socket.connected) socket.connect();
            return;
        }

        const newSocket = io(BACKEND_PORT, {
            query: { userId: user._id },
            autoConnect: true,
        });

        newSocket.off('getOnlineUsers').on('getOnlineUsers', (data) => {
            set({ onlineUsers: data });
        });

        // ✅ safe event binding (prevent duplicates)
        newSocket.off("updateProfile").on("updateProfile", (data) => {
            set({
                allUsers: get().allUsers?.map((u) =>
                    u._id === data._id ? { ...u, ...data } : u
                ),
            });
        });

        newSocket.off("newRequest").on("newRequest", (data) => {
            if (data?.request?.requestReceiver === user?._id) {
                toast.warning(`You have a new request from ${data?.fullName}`);
                useRequestStore.setState((state) => ({
                    receivedRequests: [data?.request, ...state.receivedRequests],
                }));
            }
        });

        newSocket.off("rejectRequest").on("rejectRequest", (data) => {
            useRequestStore.setState((state) => ({
                sendedRequests: state.sendedRequests?.filter((r) => r._id !== data),
                receivedRequests: state.receivedRequests?.filter((r) => r._id !== data),
            }));
        });


        newSocket.off("acceptRequest").on("acceptRequest", (data) => {
            useRequestStore.setState((state) => ({
                sendedRequests: state.sendedRequests?.filter((r) => r._id !== data?.sentRequests?._id),
            }));
            set({ userFriends: [data?.senderFriend, ...get().userFriends] });
        });

        newSocket.off("removeFriend").on("removeFriend", (data) => {
            if (data?.removedBy !== user?._id) {
                useRequestStore.setState((state) => ({
                    receivedRequests: state.receivedRequests?.filter((r) => r._id !== data?.requestId),
                    sendedRequests: state.sendedRequests?.filter((r) => r._id !== data?.requestId),
                }));
                set((state) => {
                    return {
                        userFriends: state.userFriends?.filter((f) => f !== data?.removedBy),
                    };
                });
            }
        })

        newSocket.off("newMessage").on("newMessage", (data) => {
            if (data?.message?.receiverId === user._id) {
                useChatStore.setState((state) => ({
                    receivedMessages: [data?.message, ...state.receivedMessages],
                }));
            }
        });

        newSocket.on("messageSeen", (data) => {
            useChatStore.setState((state) => ({
                sendedMessages: state.sendedMessages.map((msg) =>
                    data.messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
                ),
            }));
        });



        set({ socket: newSocket });
    },

    disConnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
        }
        // clear the socket reference
        set({ socket: null });
    },

}));