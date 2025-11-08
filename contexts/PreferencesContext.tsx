import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskFilter } from '@/components/tasks';
import { setHapticsGlobalState } from '@/utils/haptics';
import { setSoundsGlobalState } from '@/utils/sounds';

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'dueDate' | 'priority';

interface PreferencesContextType {
  sorting: SortOption;
  setSorting: (sorting: SortOption) => void;
  filtering: TaskFilter;
  setFiltering: (filtering: TaskFilter) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SORTING: '@task_sorting',
  FILTERING: '@task_filtering',
  HAPTICS: '@haptics_enabled',
  SOUNDS: '@sounds_enabled',
} as const;

const DEFAULT_PREFERENCES = {
  SORTING: 'newest' as SortOption,
  FILTERING: 'all' as TaskFilter,
  HAPTICS: true,
  SOUNDS: true,
} as const;

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [sorting, setSortingState] = useState<SortOption>(DEFAULT_PREFERENCES.SORTING);
  const [filtering, setFilteringState] = useState<TaskFilter>(DEFAULT_PREFERENCES.FILTERING);
  const [hapticsEnabled, setHapticsEnabledState] = useState<boolean>(DEFAULT_PREFERENCES.HAPTICS);
  const [soundsEnabled, setSoundsEnabledState] = useState<boolean>(DEFAULT_PREFERENCES.SOUNDS);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [savedSorting, savedFiltering, savedHaptics, savedSounds] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SORTING),
          AsyncStorage.getItem(STORAGE_KEYS.FILTERING),
          AsyncStorage.getItem(STORAGE_KEYS.HAPTICS),
          AsyncStorage.getItem(STORAGE_KEYS.SOUNDS),
        ]);

        if (savedSorting) {
          setSortingState(savedSorting as SortOption);
        }
        if (savedFiltering) {
          setFilteringState(savedFiltering as TaskFilter);
        }
        if (savedHaptics !== null) {
          const enabled = savedHaptics === 'true';
          setHapticsEnabledState(enabled);
          setHapticsGlobalState(enabled);
        } else {
          setHapticsGlobalState(DEFAULT_PREFERENCES.HAPTICS);
        }
        if (savedSounds !== null) {
          const enabled = savedSounds === 'true';
          setSoundsEnabledState(enabled);
          setSoundsGlobalState(enabled);
        } else {
          setSoundsGlobalState(DEFAULT_PREFERENCES.SOUNDS);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Persist sorting preference to AsyncStorage
  const setSorting = async (newSorting: SortOption) => {
    try {
      setSortingState(newSorting);
      await AsyncStorage.setItem(STORAGE_KEYS.SORTING, newSorting);
    } catch (error) {
      console.error('Error saving sorting preference:', error);
    }
  };

  // Persist filtering preference to AsyncStorage
  const setFiltering = async (newFiltering: TaskFilter) => {
    try {
      setFilteringState(newFiltering);
      await AsyncStorage.setItem(STORAGE_KEYS.FILTERING, newFiltering);
    } catch (error) {
      console.error('Error saving filtering preference:', error);
    }
  };

  // Persist haptics preference to AsyncStorage
  const setHapticsEnabled = async (enabled: boolean) => {
    try {
      setHapticsEnabledState(enabled);
      setHapticsGlobalState(enabled);
      await AsyncStorage.setItem(STORAGE_KEYS.HAPTICS, String(enabled));
    } catch (error) {
      console.error('Error saving haptics preference:', error);
    }
  };

  // Persist sounds preference to AsyncStorage
  const setSoundsEnabled = async (enabled: boolean) => {
    try {
      setSoundsEnabledState(enabled);
      setSoundsGlobalState(enabled);
      await AsyncStorage.setItem(STORAGE_KEYS.SOUNDS, String(enabled));
    } catch (error) {
      console.error('Error saving sounds preference:', error);
    }
  };

  const value: PreferencesContextType = {
    sorting,
    setSorting,
    filtering,
    setFiltering,
    hapticsEnabled,
    setHapticsEnabled,
    soundsEnabled,
    setSoundsEnabled,
    isLoading,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
