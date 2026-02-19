import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '../app-store';
import type { Profile, Technology, TechDomain, DifficultyLevel } from '@/types/database';

// Mock localStorage for persistence tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      profile: null,
      filters: {
        technologies: [],
        domains: [],
        difficulty: null,
        searchQuery: '',
      },
      currentSessionId: null,
      sidebarOpen: true,
    });
    localStorageMock.clear();
  });

  describe('profile management', () => {
    it('sets profile correctly', () => {
      const mockProfile: Profile = {
        id: 'user-123',
        email: 'test@example.com',
        display_name: 'Test User',
        avatar_url: null,
        timezone: 'UTC',
        target_role: 'fullstack',
        target_level: 'mid',
        preferred_technologies: ['react', 'typescript'] as Technology[],
        target_company: 'TechCorp',
        daily_session_limit_minutes: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      useAppStore.getState().setProfile(mockProfile);
      expect(useAppStore.getState().profile).toEqual(mockProfile);
    });

    it('clears profile when set to null', () => {
      const mockProfile: Profile = {
        id: 'user-123',
        email: 'test@example.com',
        display_name: 'Test User',
        avatar_url: null,
        timezone: 'UTC',
        target_role: 'frontend',
        target_level: 'junior',
        preferred_technologies: [],
        target_company: null,
        daily_session_limit_minutes: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      useAppStore.getState().setProfile(mockProfile);
      useAppStore.getState().setProfile(null);
      expect(useAppStore.getState().profile).toBeNull();
    });
  });

  describe('filters management', () => {
    it('sets individual filter properties', () => {
      useAppStore.getState().setFilters({ searchQuery: 'react hooks' });
      expect(useAppStore.getState().filters.searchQuery).toBe('react hooks');
      // Other filters should remain unchanged
      expect(useAppStore.getState().filters.technologies).toEqual([]);
    });

    it('sets multiple filter properties at once', () => {
      useAppStore.getState().setFilters({
        technologies: ['react', 'typescript'] as Technology[],
        difficulty: 'intermediate' as DifficultyLevel,
      });

      const { filters } = useAppStore.getState();
      expect(filters.technologies).toEqual(['react', 'typescript']);
      expect(filters.difficulty).toBe('intermediate');
    });

    it('preserves existing filters when updating', () => {
      useAppStore.getState().setFilters({
        technologies: ['react'] as Technology[],
        searchQuery: 'hooks',
      });

      useAppStore.getState().setFilters({
        difficulty: 'advanced' as DifficultyLevel,
      });

      const { filters } = useAppStore.getState();
      expect(filters.technologies).toEqual(['react']);
      expect(filters.searchQuery).toBe('hooks');
      expect(filters.difficulty).toBe('advanced');
    });

    it('resets filters to defaults', () => {
      useAppStore.getState().setFilters({
        technologies: ['react', 'vue', 'angular'] as Technology[],
        domains: ['frontend'] as TechDomain[],
        difficulty: 'expert' as DifficultyLevel,
        searchQuery: 'complex query',
      });

      useAppStore.getState().resetFilters();

      const { filters } = useAppStore.getState();
      expect(filters.technologies).toEqual([]);
      expect(filters.domains).toEqual([]);
      expect(filters.difficulty).toBeNull();
      expect(filters.searchQuery).toBe('');
    });
  });

  describe('session management', () => {
    it('sets current session ID', () => {
      useAppStore.getState().setCurrentSessionId('session-abc-123');
      expect(useAppStore.getState().currentSessionId).toBe('session-abc-123');
    });

    it('clears session ID when set to null', () => {
      useAppStore.getState().setCurrentSessionId('session-abc-123');
      useAppStore.getState().setCurrentSessionId(null);
      expect(useAppStore.getState().currentSessionId).toBeNull();
    });
  });

  describe('UI state', () => {
    it('toggles sidebar open state', () => {
      expect(useAppStore.getState().sidebarOpen).toBe(true);

      useAppStore.getState().setSidebarOpen(false);
      expect(useAppStore.getState().sidebarOpen).toBe(false);

      useAppStore.getState().setSidebarOpen(true);
      expect(useAppStore.getState().sidebarOpen).toBe(true);
    });
  });

  describe('persistence configuration', () => {
    it('store has correct persist name', () => {
      // Verify the store is configured with the expected persist name
      // The persist middleware serializes to 'interview-ace-store' key
      const persistOptions = useAppStore.persist;
      expect(persistOptions).toBeDefined();
      expect(persistOptions.getOptions().name).toBe('interview-ace-store');
    });

    it('partializes state correctly (only filters and sidebarOpen)', () => {
      // Set all state
      useAppStore.getState().setFilters({ searchQuery: 'test' });
      useAppStore.getState().setSidebarOpen(false);
      useAppStore.getState().setProfile({
        id: 'user-123',
        email: 'test@example.com',
        display_name: 'Test',
        avatar_url: null,
        timezone: 'UTC',
        target_role: 'backend',
        target_level: 'senior',
        preferred_technologies: [],
        target_company: null,
        daily_session_limit_minutes: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      useAppStore.getState().setCurrentSessionId('session-123');

      // Get partialize function from persist options
      const partialize = useAppStore.persist.getOptions().partialize;
      const state = useAppStore.getState();
      const partializedState = partialize?.(state);

      // Only filters and sidebarOpen should be persisted
      expect(partializedState).toHaveProperty('filters');
      expect(partializedState).toHaveProperty('sidebarOpen');
      expect(partializedState).not.toHaveProperty('profile');
      expect(partializedState).not.toHaveProperty('currentSessionId');
    });
  });
});
