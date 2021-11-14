import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StripeProvider publishableKey="pk_test_51JJ4mVLXJPxkoziMaKqB1C8o88yhZWmwnDAotNr3CCMLX7bQm3hPiF3xQwLxFRcyXcqPPk1UNSdGbLL85zxzJeF300OCOjvtiE">
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </StripeProvider>
      </SafeAreaProvider>
    );
  }
}
