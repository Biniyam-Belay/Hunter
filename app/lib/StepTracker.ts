import { Pedometer } from 'expo-sensors';
import * as TaskManager from 'expo-task-manager';
import { AppState, AppStateStatus } from 'react-native'; // Import AppState and AppStateStatus
import { StepStorage } from './StepStorage'; // Import StepStorage

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================
const BACKGROUND_STEP_TASK = 'BACKGROUND_STEP_TRACKER';

// ============================================================================
// BACKGROUND TASK DEFINITION
// Must be defined in the global scope to register correctly with the native bridge.
// ============================================================================
TaskManager.defineTask(BACKGROUND_STEP_TASK, async ({ data, error }) => {
  if (error) {
    console.error('[BackgroundStepTask] Error:', error);
    return;
  }

  if (data) {
    // Pedometer.watchSteps acts as an event emitter.
    // 'steps' here is the delta (steps taken since the last event).
    const { steps } = data as { steps: number };
    
    // We persist this delta immediately.
    const newTotal = await StepStorage.addSteps(steps);
    console.log(`[Background] +${steps} steps. Today's Total: ${newTotal}`);
  }
});

// ============================================================================
// SERVICE: STEP TRACKER MANAGER
// Handles permissions, initialization, and the critical Reconciliation Algorithm.
// ============================================================================
export const StepTracker = {
  /**
   * Initialize the tracking system.
   */
  init: async () => {
    console.log('[StepTracker] Initializing...');
    const isAvailable = await Pedometer.isAvailableAsync();
    if (!isAvailable) {
      console.warn('[StepTracker] Pedometer not available on this device');
      alert('Pedometer (motion sensor) is not available on this device.');
      return false;
    }

    const { status } = await Pedometer.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('[StepTracker] Permission denied');
      alert('Motion sensor permission is required for step tracking.');
      return false;
    }

    console.log('[StepTracker] Permissions granted. Starting reconciliation and background task.');
    // 1. CRITICAL: Reconcile Storage with Hardware
    // This repairs data gaps if the app was killed or phone restarted.
    await StepTracker.reconcileSteps();

    // 2. Start Background Tracking
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    if (!isRegistered) {
      await Pedometer.watchSteps(BACKGROUND_STEP_TASK);
      console.log('[StepTracker] Background task registered');
    } else {
      console.log('[StepTracker] Background task already registered.');
    }
    
    return true;
  },

  /**
   * INDUSTRY LEVEL ALGORITHM: RECONCILIATION
   * Queries the native hardware history for steps taken since Midnight.
   * Updates local storage to match the hardware truth.
   */
  reconcileSteps: async (): Promise<number> => {
    console.log('[StepTracker] Reconciling steps...');
    try {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0); // Midnight today

      // Get accurate hardware count
      const result = await Pedometer.getStepCountAsync(start, end);
      
      if (result && typeof result.steps === 'number') {
        console.log('[StepTracker] Reconciling: Hardware reports', result.steps);
        // Overwrite storage with the hardware truth
        await StepStorage.setTodaySteps(result.steps);
        return result.steps;
      }
    } catch (e) {
      console.warn('[StepTracker] Reconciliation skipped (History API unavailable or error):', e);
    }
    // Fallback to existing storage if history API fails
    const storedSteps = await StepStorage.getTodaySteps();
    console.log('[StepTracker] Reconciliation fallback to stored steps:', storedSteps);
    return storedSteps;
  },

  /**
   * Checks if the background task is currently registered.
   */
  isTracking: async (): Promise<boolean> => {
    const registered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    console.log(`[StepTracker] isTracking: ${registered}`);
    return registered;
  },

  /**
   * Unregisters the background task (e.g., for stopping tracking).
   */
  stopTracking: async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    if (isRegistered) {
      await TaskManager.unregisterAllTasksAsync(); // Unregister all tasks to be safe
      console.log('[StepTracker] Background task unregistered.');
    }
  },

  /**
   * INDUSTRY LEVEL ALGORITHM: HOOK FOR REACT COMPONENTS
   * Provides steps and reconciliation logic to React components.
   */
  useStepCounter: () => {
    const [steps, setSteps] = useState(0);
    const [isReady, setIsReady] = useState(false);
  
    const refreshSteps = useCallback(async () => {
      const count = await StepStorage.getTodaySteps();
      setSteps(count);
    }, []);
  
    useEffect(() => {
      // 1. Initial Setup
      const start = async () => {
        const success = await StepTracker.init();
        if (success) {
          await refreshSteps();
          setIsReady(true);
        }
      };
  
      start();
  
      // 2. AppState Listener
      // Re-syncs data when user brings app from background to foreground.
      const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          await StepTracker.reconcileSteps(); 
          await refreshSteps();
        }
      };
  
      const appStateSub = AppState.addEventListener('change', handleAppStateChange);
  
      // 3. UI Polling
      // Polls storage for updates to keep the UI "live" while looking at it.
      const interval = setInterval(refreshSteps, 2000);
  
      return () => {
        appStateSub.remove();
        clearInterval(interval);
      };
    }, [refreshSteps]);
  
    return { steps, isReady };
  }
};
