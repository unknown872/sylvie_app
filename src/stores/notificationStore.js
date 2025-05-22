import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: 0,
  addNotification: () =>
    set((state) => ({ notifications: state.notifications + 1 })),
  clearNotifications: () => set({ notifications: 0 }),
}));

export default useNotificationStore;
