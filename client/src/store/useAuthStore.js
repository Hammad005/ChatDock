import axios from "@/lib/axios";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand";
import { useRequestStore } from "./useRequestStore";

const BACKEND_PORT = import.meta.env.VITE_API_URL;
export const useAuthStore = create((set, get) => ({
    user: null,
    allUsers: null,
    userLoading: false,
    authLoading: false,
    updateUserLoading: false,
    progress: 0,
    socket: null,

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
            set({ user: res.data.user, authLoading: false });
            get().connectSocket();
        } catch (error) {
            console.log(error);
            set({ authLoading: false });
        }
    },
    signup: async (data) => {
        set({ userLoading: true });
        try {
            const res = await axios.post('/auth/signup', data);
            set({ user: res.data.user, userLoading: false });
            toast.success('Signup successful');
            get().connectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ userLoading: false, user: null });
        }
    },
    login: async (data) => {
        set({ userLoading: true });
        try {
            const res = await axios.post('/auth/login', data);
            set({ user: res.data.user, userLoading: false });
            toast.success('Login successful');
            get().connectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ userLoading: false, user: null });
        }
    },
    logout: async () => {
        set({ userLoading: true });
        try {
            await axios.post('/auth/logout');
            set({ user: null, userLoading: false });
            toast.success('Logout successful');
            get().disConnectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ userLoading: false, user: null });
        }
    },
    update: async (data) => {
        set({ updateUserLoading: true });
        try {
            const res = await axios.put('/auth/update', data);
            set({ user: res.data.user, updateUserLoading: false });
            toast.success('Update successful');
            get().connectSocket();
            return { success: true }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ updateUserLoading: false, user: null });
        }
    },
    removeProfile: async () => {
        set({ updateUserLoading: true });
        try {
            const res = await axios.delete('/auth/removeProfile');
            set({ user: res.data.user, updateUserLoading: false });
            toast.success('Profile removed successfully');
            get().connectSocket();
            return { success: true }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({ updateUserLoading: false, user: null });
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
            }
            
            
            useRequestStore.setState((state) => ({
                receivedRequests: [data?.request, ...state.receivedRequests],
            }));
        });

        newSocket.off("rejectRequest").on("rejectRequest", (data) => {
            useRequestStore.setState(() => ({
                sendedRequests: data.sentRequests,
                receivedRequests: data.receivedRequests,
            }));
        });
        

        set({ socket: newSocket });
    },

    disConnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));