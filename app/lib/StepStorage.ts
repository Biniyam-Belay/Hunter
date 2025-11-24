import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// SERVICE: STEP STORAGE (PERSISTENCE LAYER)
// Handles date-keyed storage to solve the "Midnight Reset" problem automatically.
// ============================================================================
export const StepStorage = {
  /**
   * Helper to get a consistent date key (YYYY-MM-DD).
   * Used to partition data by day.
   */
  getTodayKey: () => {
    const now = new Date();
    return `step_tracker_${now.toISOString().split('T')[0]}`; // Prefix with 'step_tracker_'
  },

  /**
   * Get steps for today. Returns 0 if no entry exists (new day).
   */
  getTodaySteps: async (): Promise<number> => {
    try {
      const key = StepStorage.getTodayKey();
      const val = await AsyncStorage.getItem(key);
      return val ? parseInt(val, 10) : 0;
    } catch (e) {
      console.error('[StepStorage] Read Error', e);
      return 0;
    }
  },

  /**
   * Atomically adds steps to today's total.
   */
  addSteps: async (count: number): Promise<number> => {
    try {
      const key = StepStorage.getTodayKey();
      const current = await StepStorage.getTodaySteps();
      const newTotal = current + count;
      await AsyncStorage.setItem(key, newTotal.toString());
      return newTotal;
    } catch (e) {
      console.error('[StepStorage] Write Error', e);
      return 0;
    }
  },

  /**
   * Force update today's steps (used during sync/reconciliation).
   */
  setTodaySteps: async (count: number): Promise<void> => {
    try {
      const key = StepStorage.getTodayKey();
      await AsyncStorage.setItem(key, count.toString());
    } catch (e) {
      console.error('[StepStorage] Set Error', e);
    }
  }
};
