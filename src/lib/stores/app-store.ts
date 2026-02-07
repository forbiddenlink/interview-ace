import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Technology, TechDomain, DifficultyLevel, Profile } from "@/types/database";

interface PracticeFilters {
  technologies: Technology[];
  domains: TechDomain[];
  difficulty: DifficultyLevel | null;
  searchQuery: string;
}

interface AppState {
  // User
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;

  // Practice filters
  filters: PracticeFilters;
  setFilters: (filters: Partial<PracticeFilters>) => void;
  resetFilters: () => void;

  // Session
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const defaultFilters: PracticeFilters = {
  technologies: [],
  domains: [],
  difficulty: null,
  searchQuery: "",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      profile: null,
      setProfile: (profile) => set({ profile }),

      // Practice filters
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),

      // Session
      currentSessionId: null,
      setCurrentSessionId: (id) => set({ currentSessionId: id }),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "interview-ace-store",
      partialize: (state) => ({
        filters: state.filters,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
