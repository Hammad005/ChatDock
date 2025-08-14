import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    allUsers: null,
    userLoading: false,
    authLoading: false,
    updateUserLoading: false,
    progress: 0,

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
        } catch (error) {
            console.log(error);
            set({ authLoading: false });
        }
    },
    signup: async (data) => {
        set({userLoading: true});
        try {
            const res = await axios.post('/auth/signup', data);
            set({user: res.data.user, userLoading: false});
            toast.success('Signup successful');
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({userLoading: false, user: null});
        }
    },
    login: async (data) => {
        set({userLoading: true});
        try {
            const res = await axios.post('/auth/login', data);
            set({user: res.data.user, userLoading: false});
            toast.success('Login successful');
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({userLoading: false, user: null});
        }
    },
    logout: async () => {
        set({userLoading: true});
        try {
            await axios.post('/auth/logout');
            set({user: null, userLoading: false});
            toast.success('Logout successful');
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
            set({userLoading: false, user: null});
        }
    }
}));