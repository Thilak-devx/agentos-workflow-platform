import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiState = {
  commandPaletteOpen: boolean;
  onboardingDismissed: boolean;
  readNotificationIds: string[];
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  dismissOnboarding: () => void;
  markNotificationsRead: (ids: string[]) => void;
  markAllNotificationsRead: (ids: string[]) => void;
  hasReadNotification: (id: string) => boolean;
};

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      commandPaletteOpen: false,
      onboardingDismissed: false,
      readNotificationIds: [],
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      dismissOnboarding: () => set({ onboardingDismissed: true }),
      markNotificationsRead: (ids) =>
        set((state) => ({
          readNotificationIds: Array.from(
            new Set([...state.readNotificationIds, ...ids]),
          ),
        })),
      markAllNotificationsRead: (ids) =>
        set((state) => ({
          readNotificationIds: Array.from(
            new Set([...state.readNotificationIds, ...ids]),
          ),
        })),
      hasReadNotification: (id) => get().readNotificationIds.includes(id),
    }),
    {
      name: "agentos-ui-state",
      partialize: (state) => ({
        onboardingDismissed: state.onboardingDismissed,
        readNotificationIds: state.readNotificationIds,
      }),
    },
  ),
);
