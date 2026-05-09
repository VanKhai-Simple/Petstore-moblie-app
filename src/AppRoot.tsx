import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './navigation/AppNavigation';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { colors } from './constants/theme';

export default function AppRoot() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="dark" backgroundColor={colors.background} />
            <AppNavigation />
          </NavigationContainer>
        </CartProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
