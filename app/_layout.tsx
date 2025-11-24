import { Stack } from 'expo-router';
import './global.css';
import { useFonts, Oswald_400Regular, Oswald_700Bold } from '@expo-google-fonts/oswald';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StateProvider, useAppState } from './context/StateContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isReady } = useAppState();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

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