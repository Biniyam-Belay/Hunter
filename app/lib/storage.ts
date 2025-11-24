import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../context/StateContext';

const STATE_KEY = 'appState';

export const loadState = async (): Promise<AppState | undefined> => {
  try {
    const jsonState = await AsyncStorage.getItem(STATE_KEY);
    if (jsonState === null) {
      return undefined;
    }
    return JSON.parse(jsonState);
  } catch (err) {
    console.error('Failed to load state from storage', err);
    return undefined;
  }
};

export const saveState = async (state: AppState) => {
  try {
    const jsonState = JSON.stringify(state);
    await AsyncStorage.setItem(STATE_KEY, jsonState);
  } catch (err) {
    console.error('Failed to save state to storage', err);
  }
};
