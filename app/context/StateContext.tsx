import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { loadState, saveState } from '../lib/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Pedometer } from 'expo-sensors'; // Import Pedometer for permissions
import { StepTracker } from '../lib/StepTracker'; // Import StepTracker
import { StepStorage } from '../lib/StepStorage'; // Import StepStorage

// Food Item and Meal Interfaces
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  quantity?: number; // Optional
  unit?: string; // Optional (e.g., "g", "oz", "cup")
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface Meal {
  id: string;
  type: MealType;
  date: string; // YYYY-MM-DD format (e.g., "2023-10-27")
  foodItems: FoodItem[];
  totalCalories: number; // Calculated field
}

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
    sleep: string; // e.g., "7.5" for 7.5 hours
    mood: string;  // e.g., "8" for 8/10
    soreness: string; // e.g., "LOW", "MEDIUM", "HIGH"
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
  calorieGoal: number;
  meals: Meal[];
  todaySteps: number; // New: Current day's step count
  pedometerPermissionStatus: string; // New: Pedometer permission status
}

// Helper function to calculate total calories for a meal
const calculateMealTotalCalories = (foodItems: FoodItem[]): number => {
  return foodItems.reduce((sum, item) => sum + item.calories, 0);
};

// Helper function to calculate readiness score and status
const calculateReadiness = (vitals: AppState['vitals']) => {
  let score = 0;
  let moodScore = 0;
  let sleepScore = 0;
  let sorenessScore = 0;

  // Sleep scoring (assuming ideal is 7-9 hours)
  const sleepHours = parseFloat(vitals.sleep);
  if (!isNaN(sleepHours)) {
    if (sleepHours >= 7 && sleepHours <= 9) {
      sleepScore = 100; // Optimal
    } else if (sleepHours >= 6.5 || sleepHours <= 9.5) {
      sleepScore = 80; // Good
    } else if (sleepHours >= 6 || sleepHours <= 10) {
      sleepScore = 60; // Fair
    } else {
      sleepScore = 30; // Poor
    }
  }

  // Mood scoring (assuming 1-10 scale)
  const moodValue = parseInt(vitals.mood);
  if (!isNaN(moodValue)) {
    if (moodValue >= 8) {
      moodScore = 100;
    } else if (moodValue >= 6) {
      moodScore = 70;
    } else if (moodValue >= 4) {
      moodScore = 40;
    } else {
      moodScore = 20;
    }
  }

  // Soreness scoring
  switch (vitals.soreness.toUpperCase()) {
    case 'LOW':
      sorenessScore = 100;
      break;
    case 'MEDIUM':
      sorenessScore = 60;
      break;
    case 'HIGH':
      sorenessScore = 20;
      break;
    default:
      sorenessScore = 50; // Neutral
  }

  // Simple weighted average (can be refined)
  score = (sleepScore * 0.4 + moodScore * 0.4 + sorenessScore * 0.2); // Weighted
  score = Math.round(Math.max(0, Math.min(100, score))); // Clamp between 0 and 100

  let status = 'OPTIMAL';
  if (score < 50) {
    status = 'RECOVER';
  } else if (score < 75) {
    status = 'GOOD';
  } else if (score < 90) {
    status = 'STRONG';
  } else {
    status = 'PEAK CONDITION';
  }

  return { score, status: status.toUpperCase() };
};

// Create the initial state
const initialState: AppState = {
  user: {
    name: 'Hunter',
    initials: 'H',
  },
  readiness: calculateReadiness({ // Calculate initial readiness
    sleep: '7.5',
    mood: '8',
    soreness: 'LOW',
    weight: 78.2,
    water: 1.2,
    cardio: 45,
    calories: 840,
  }),
  vitals: {
    sleep: '7.5',
    mood: '8',
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
  calorieGoal: 2500, // Example goal
  meals: [
    {
      id: uuidv4(),
      type: 'BREAKFAST',
      date: '2025-11-24', // Example date
      foodItems: [
        { id: uuidv4(), name: 'Oatmeal', calories: 150, quantity: 1, unit: 'cup' },
        { id: uuidv4(), name: 'Protein Powder', calories: 120, quantity: 1, unit: 'scoop' },
      ],
      totalCalories: 270,
    },
    {
      id: uuidv4(),
      type: 'LUNCH',
      date: '2025-11-24',
      foodItems: [
        { id: uuidv4(), name: 'Chicken Breast', calories: 300, quantity: 150, unit: 'g' },
        { id: uuidv4(), name: 'Broccoli', calories: 50, quantity: 200, unit: 'g' },
      ],
      totalCalories: 350,
    },
  ],
  todaySteps: 0, // Initialize today's steps
  pedometerPermissionStatus: 'unknown', // Initialize pedometer permission status
};

// Create the context
const StateContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  isReady: boolean;
} | undefined>(undefined);

// Create a provider component
export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setInternalState] = useState<AppState>(initialState);
  const [isReady, setIsReady] = useState(false);

  // Custom setState function to recalculate readiness and meal totals
  const setState = useCallback((action: React.SetStateAction<AppState>) => {
    setInternalState(prev => {
      const newState = typeof action === 'function' ? action(prev) : action;

      // Recalculate readiness if vitals changed
      const { score, status } = calculateReadiness(newState.vitals);
      let updatedState = { ...newState, readiness: { score, status } };

      // Recalculate meal total calories
      const updatedMeals = (newState.meals ?? []).map(meal => ({
        ...meal,
        totalCalories: calculateMealTotalCalories(meal.foodItems),
      }));
      updatedState = { ...updatedState, meals: updatedMeals };

      return updatedState;
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      const savedState = await loadState();
      let newState = savedState || initialState;

      // Ensure readiness is calculated on load
      const { score, status } = calculateReadiness(newState.vitals);
      newState = { ...newState, readiness: { score, status } };

      // Ensure meal total calories are calculated on load
      const updatedMeals = (newState.meals ?? []).map(meal => ({
        ...meal,
        totalCalories: calculateMealTotalCalories(meal.foodItems),
      }));
      newState = { ...newState, meals: updatedMeals };

      // Load today's steps from StepStorage
      const steps = await StepStorage.getTodaySteps();
      newState = { ...newState, todaySteps: steps };

      // Get pedometer permission status
      const { status: pedoStatus } = await Pedometer.getPermissionsAsync();
      newState = { ...newState, pedometerPermissionStatus: pedoStatus };
      
      setInternalState(newState);
      setIsReady(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (isReady) {
      saveState(state);

      // Set up interval to refresh steps from StepStorage periodically and update permission status
      const stepRefreshInterval = setInterval(async () => {
        const currentSteps = await StepStorage.getTodaySteps();
        const { status: pedoStatus } = await Pedometer.getPermissionsAsync();
        
        setInternalState(prev => {
          let updated = prev;
          if (prev.todaySteps !== currentSteps) {
            updated = { ...updated, todaySteps: currentSteps };
          }
          if (prev.pedometerPermissionStatus !== pedoStatus) {
            updated = { ...updated, pedometerPermissionStatus: pedoStatus };
          }
          return updated;
        });
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(stepRefreshInterval); // Clear interval on unmount
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
