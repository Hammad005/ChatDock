import axios from "@/lib/axios";
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
            set({ user: res.data, authLoading: false });
        } catch (error) {
            console.log(error);
            set({ authLoading: false });
        }
    }
}));