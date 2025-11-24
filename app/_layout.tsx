import { Stack } from 'expo-router';
import './global.css';
import { useFonts, Oswald_400Regular, Oswald_700Bold } from '@expo-google-fonts/oswald';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import { StepTracker } from './lib/StepTracker'; // Import StepTracker

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isReady } = useAppState();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // Auto-start Pedometer on app mount
  useEffect(() => {
    const initPedometer = async () => {
      const isTracking = await StepTracker.isTracking();
      if (!isTracking) {
        console.log('Pedometer not tracking, attempting to start...');
        await StepTracker.init(); // Use StepTracker.init()
      } else {
        console.log('Pedometer already tracking.');
      }
    };
    initPedometer();
  }, []); // Run once on mount

  if (!isReady) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StateProvider>
      <RootLayoutNav />
    </StateProvider>
  );
}