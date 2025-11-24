import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { loadState, saveState } from '../lib/storage';

// Define the shape of our state
export interface AppState {
  user: {
    name: string;
    initials: string;
  };
  readiness: {
    score: number;
    status: string;
  };
  vitals: {
    sleep: string;
    mood: string;
    soreness: string;
    weight: number;
    water: number;
    cardio: number;
    calories: number;
  };
  workout: {
    title: string;
    description: string;
    duration: number;
  };
}

// Create the initial state
const initialState: AppState = {
  user: {
    name: 'Hunter',
    initials: 'H',
  },
  readiness: {
    score: 94,
    status: 'PEAK CONDITION',
  },
  vitals: {
    sleep: '7.5 h',
    mood: '8/10',
    soreness: 'LOW',
    weight: 78.2,
    water: 1.2,
    cardio: 45,
    calories: 840,
  },
  workout: {
    title: 'Upper Power',
    description: 'Chest, Back, Heavy Compounds',
    duration: 60,
  },
};

// Create the context
const StateContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  isReady: boolean;
} | undefined>(undefined);

// Create a provider component
export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const savedState = await loadState();
      if (savedState) {
        setState(savedState);
      }
      setIsReady(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (isReady) {
      saveState(state);
    }
  }, [state, isReady]);

  return (
    <StateContext.Provider value={{ state, setState, isReady }}>
      {children}
    </StateContext.Provider>
  );
};

// Create a custom hook to use the state
export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
